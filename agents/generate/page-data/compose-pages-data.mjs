/**
 * ===================== Compose Pages Data (Refactored) =====================
 *
 * ## 目标
 * - 正确解析并渲染 `LIST_KEY.*` 层级：layout-block 模板里出现的 `{{LIST_KEY.N}}` 占位，必须由对应
 *   的 list 子项实例 **精确替换**，而不是平铺到父节点外层或随意 append。
 * - 全局一致的 id 映射：无论 id 出现在 sections、sectionIds、config.gridSettings 或其他配置 key/value，
 *   都通过同一套 `applyIdMapDeep` 完成一次性替换，避免“补丁式”遗漏。
 * - 可维护性：把“clone → 生成 idMap → 统一替换 → 递归插槽替换”的流程单点实现；递归处理时父子职责清晰。
 *
 * ## 核心流程
 * 1) 读入 middle 格式（支持多语言）。
 * 2) 构建 **树形** section 节点（仅把真实的 `section[list]` 当作子节点；名字形如 `{{list.N}}` 的只是模板占位，不算子节点）。
 * 3) 递归处理每个节点：
 *    - 依据 fieldCombinations 匹配组件模板；
 *    - clone 模板 → 生成稳定 id（包含 path）→ 形成 `idMap`；
 *    - 用 `applyIdMapDeep` 对 clone 后的 section（含 config/sections/sectionIds）统一替换 id；
 *    - 对父实例：**收集 layout-block 占位（{{list.N}}）**，按子节点的 N **在父实例内**精确替换 slot；
 *      同时用 `applyIdMapDeep` 把父实例 config 中对占位 id 的引用替换为子实例 id（保证 gridSettings 等同步）。
 * 4) 构建最终 YAML：顶层仅挂 **根节点实例**；所有数据源 dataSource 统一在外层聚合。
 *
 * ## 关键保证
 * - **层级**：只在父实例找到与 `child.path` 对应的 slot（`{{list.N}}`）时才挂入；
 *   若找不到 slot，记录 warning，并 **不把子实例提升到顶层**（避免“跑外面去”）。
 * - **id 一致性**：唯一方法 `applyIdMapDeep` 统一替换任意对象的 key/值里的旧 id → 新 id。
 */

import { readFileSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import _ from "lodash";
import { parse, stringify } from "yaml";
import { LIST_KEY } from "../../../utils/constants.mjs";
import {
  extractFieldCombinations,
  generateDeterministicId,
} from "../../../utils/generate-helper.mjs";
import savePagesKitData from "./save-pages-data.mjs";

// ============= Logging =============
const ENABLE_LOGS = process.env.ENABLE_LOGS === "true";
const log = (...args) => ENABLE_LOGS && console.log(...args);
const logError = (...args) => ENABLE_LOGS && console.error(...args);

// 小工具：path 数组可视化
const fmtPath = (p) => (Array.isArray(p) ? p.join(" › ") : String(p ?? ""));

// ============= IO Utils =============
async function readMiddleFormatFile(tmpDir, locale, fileName) {
  try {
    const filePath = join(tmpDir, locale, fileName);
    const content = readFileSync(filePath, "utf8");
    log("📥 [readMiddleFormatFile] loaded:", { locale, fileName, bytes: content.length });
    return parse(content);
  } catch (err) {
    logError("⚠️  [readMiddleFormatFile] failed:", { locale, fileName, error: err.message });
    return null;
  }
}

// ============= Simple Template ============
function getNestedValue(obj, path) {
  return path.split(".").reduce((cur, key) => (cur ? cur[key] : undefined), obj);
}
function processSimpleTemplate(obj, data) {
  if (typeof obj === "string") {
    return obj.replace(/<%=\s*([^%]+)\s*%>/g, (_m, key) => {
      const v = getNestedValue(data, key.trim());
      return v !== undefined ? v : "";
    });
  }
  if (Array.isArray(obj)) return obj.map((x) => processSimpleTemplate(x, data));
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, processSimpleTemplate(v, data)]),
    );
  }
  return obj;
}
function processArrayTemplate(templateArray, data) {
  if (!Array.isArray(templateArray) || templateArray.length !== 1) {
    return templateArray.map((x) => processSimpleTemplate(x, data));
  }
  const arrayField = Object.keys(data).find((k) => Array.isArray(data[k]));
  if (arrayField && data[arrayField]?.length > 0) {
    const t = templateArray[0];
    const out = data[arrayField].map((item) => {
      const r = processSimpleTemplate(t, item);
      return r;
    });
    log("🧩 [processArrayTemplate] expanded array template:", {
      items: data[arrayField].length,
    });
    return out;
  }
  return templateArray.map((x) => processSimpleTemplate(x, data));
}
function processTemplate(obj, data) {
  const isArrayCase = Array.isArray(obj) && obj.length === 1;
  const res = isArrayCase ? processArrayTemplate(obj, data) : processSimpleTemplate(obj, data);
  if (ENABLE_LOGS) {
    const preview =
      typeof res === "string"
        ? res.slice(0, 80)
        : Array.isArray(res)
          ? `[array x${res.length}]`
          : res && typeof res === "object"
            ? "{object}"
            : String(res);
    log("🧪 [processTemplate] done:", { arrayCase: isArrayCase, preview });
  }
  return res;
}

// ============= ID Mapping (single source of truth) ============
/**
 * 把对象里所有 **key & string 值** 中的旧 id 映射为新 id。
 * 注意：返回新对象，不会原地修改传入对象。
 */
function applyIdMapDeep(obj, idMap) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((v) => applyIdMapDeep(v, idMap));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const newKey = idMap.get(k) || k;
    if (typeof v === "string" && idMap.has(v)) {
      out[newKey] = idMap.get(v);
    } else {
      out[newKey] = applyIdMapDeep(v, idMap);
    }
  }
  return out;
}

/** 用一个临时 idMap（from→to）对目标对象进行就地替换（便于 slot 替换后同步 config） */
function remapIdsInPlace(obj, fromId, toId) {
  const map = new Map([[fromId, toId]]);
  const remapped = applyIdMapDeep(obj, map);
  // 原地覆盖
  if (Array.isArray(obj)) {
    obj.length = 0;
    remapped.forEach((x) => obj.push(x));
  } else if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((k) => delete obj[k]);
    Object.entries(remapped).forEach(([k, v]) => {
      obj[k] = v;
    });
  }
  log("🔁 [remapIdsInPlace] remapped:", { fromId, toId });
}

// ============= Section Instantiation ============
function ensureCustomComponentConfig(section) {
  if (section.component === "custom-component") {
    section.config = { useCache: true, ...section.config };
    log("⚙️  [ensureCustomComponentConfig] applied default config for custom-component:", {
      id: section.id,
    });
  }
  return section;
}

/**
 * 深度 clone 模板 section，并生成稳定 id：
 * - 参与因子：templateId / 原模板 section.id / sectionIndex / path（含 list 索引）
 * - clone 完成后：用 idMap 对 {sections/sectionIds/config...} 做一次性全替换
 */
function cloneTemplateSection(section, { templateId, sectionIndex, path = [] }, idMap) {
  const cloned = _.cloneDeep(section);

  const derivedId = generateDeterministicId(
    JSON.stringify({ templateId, templateSectionId: section.id, sectionIndex, path }),
  );
  idMap.set(section.id, derivedId);
  cloned.id = derivedId;

  // 递归处理子 section
  if (cloned.sectionIds && cloned.sections) {
    const nextSections = {};
    const nextIds = [];
    cloned.sectionIds.forEach((cid, idx) => {
      const childTpl = section.sections?.[cid];
      if (!childTpl) {
        logError("⚠️  [cloneTemplateSection] missing child template:", { cid, parent: section.id });
        return;
      }
      const childClone = cloneTemplateSection(
        childTpl,
        { templateId, sectionIndex, path: [...path, idx] },
        idMap,
      );
      nextSections[childClone.id] = childClone;
      nextIds.push(childClone.id);
    });
    cloned.sections = nextSections;
    cloned.sectionIds = nextIds;
  } else {
    delete cloned.sections;
    delete cloned.sectionIds;
  }

  ensureCustomComponentConfig(cloned);

  // 统一替换：任何 key/值里出现旧 id → 新 id
  cloned.sections = applyIdMapDeep(cloned.sections, idMap);
  cloned.sectionIds = (cloned.sectionIds || []).map((id) => idMap.get(id) || id);
  cloned.config = applyIdMapDeep(cloned.config, idMap);

  if (ENABLE_LOGS) {
    // 打印少量映射（最多 5 个），避免过度噪声
    const mapPreview = [];
    let c = 0;
    for (const [from, to] of idMap.entries()) {
      mapPreview.push([from, "→", to]);
      if (++c >= 5) break;
    }
    log("🧬 [cloneTemplateSection] cloned", {
      templateId,
      sectionIndex,
      path: fmtPath(path),
      newId: cloned.id,
      idMapPreview: mapPreview,
    });
  }

  return cloned;
}

function instantiateComponentTemplate({ component, sectionData, sectionIndex, path = [] }) {
  const templateId = component.id || component.componentId || component.name;
  if (!component?.section) {
    logError("⚠️  [instantiateComponentTemplate] component has no section:", {
      templateId,
      path: fmtPath(path),
    });
    return { section: null, idMap: new Map(), dataSource: {} };
  }

  const idMap = new Map();
  const clonedSection = cloneTemplateSection(
    component.section,
    { templateId, sectionIndex, path },
    idMap,
  );

  const transformedDataSource = {};
  const tplDS = component.dataSource || {};
  Object.entries(tplDS).forEach(([origId, t]) => {
    const newId = idMap.get(origId);
    if (!newId) {
      logError("⚠️  [instantiateComponentTemplate] dataSource id missing in idMap:", {
        templateId,
        origId,
      });
      return;
    }
    const processed = processTemplate(_.cloneDeep(t), sectionData);
    if (processed !== undefined && !(typeof processed === "object" && _.isEmpty(processed))) {
      transformedDataSource[newId] = processed;
    }
  });

  log("✅ [instantiateComponentTemplate] instantiated:", {
    templateId,
    sectionIndex,
    path: fmtPath(path),
    sectionId: clonedSection.id,
    dsKeys: Object.keys(transformedDataSource).length,
  });

  return { section: clonedSection, idMap, dataSource: transformedDataSource };
}

// ============= Layout-block Slot Helpers ============
const isLayoutBlock = (sec) =>
  !!sec && (sec.component === "layout-block" || sec.type === "layout-block");

// 仅处理 {{LIST_KEY.N}} 形式；若未来需要 {{features.LIST_KEY.N}} 可扩展此解析
function parseListIndexFromName(name) {
  if (typeof name !== "string") return null;
  const m = name.match(/^\s*\{\{\s*list\.(\d+)\s*\}\}\s*$/);
  return m ? Number(m[1]) : null;
}

/** 深度遍历父实例，收集所有 layout-block 的 {{LIST_KEY.N}} 占位 → Map<N, {parent, placeholderId, position}> */
function collectLayoutSlots(rootSection) {
  const slots = new Map();
  function dfs(node, parent = null) {
    if (!node) return;
    if (isLayoutBlock(node)) {
      const idx = parseListIndexFromName(node.name);
      if (idx !== null && parent && parent.sections && parent.sectionIds) {
        const pos = parent.sectionIds.indexOf(node.id);
        if (pos !== -1 && !slots.has(idx)) {
          slots.set(idx, { parent, placeholderId: node.id, position: pos });
          log("📌 [collectLayoutSlots] slot found:", {
            listIndex: idx,
            placeholderId: node.id,
            parentId: parent.id,
            position: pos,
          });
        }
      }
    }
    if (node.sectionIds && node.sections) {
      node.sectionIds.forEach((cid) => dfs(node.sections[cid], node));
    }
  }
  dfs(rootSection, null);
  return slots;
}

/** 从子节点 path 中提取 list 索引（…,"list", N, …） */
function extractListIndexFromPath(path) {
  const i = path.findIndex((p) => p === LIST_KEY);
  if (i === -1 || i + 1 >= path.length) return null;
  const v = path[i + 1];
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

/** 用子实例替换占位：同步 sections/sectionIds，并把 parent.config 中占位 id 全量替换为子实例 id */
function replaceSlotWithChild(slot, childSection) {
  const { parent, placeholderId, position } = slot;

  if (!parent.sections) parent.sections = {};
  if (!parent.sectionIds) parent.sectionIds = [];

  // 1) 替换 sectionIds 的位置
  if (position >= 0 && position < parent.sectionIds.length) {
    parent.sectionIds.splice(position, 1, childSection.id);
  } else {
    logError("⚠️  [replaceSlotWithChild] unexpected slot position:", {
      placeholderId,
      parentId: parent.id,
      position,
    });
    parent.sectionIds.push(childSection.id);
  }

  // 2) 更新 sections 映射：删除占位 → 挂新 child
  delete parent.sections[placeholderId];
  parent.sections[childSection.id] = childSection;

  // 3) 同步 config 中对占位 id 的所有引用（gridSettings 等）
  if (parent.config) remapIdsInPlace(parent.config, placeholderId, childSection.id);

  log("🔗 [replaceSlotWithChild] slot replaced:", {
    parentId: parent.id,
    placeholderId,
    childId: childSection.id,
  });
}

// ============= Tree Build（只把真实 list 当作子节点；占位块不当子节点） ============
function collectSectionsHierarchically(section, path = []) {
  const node = { section, path, children: [] };
  // 严格：只有当 section[list] 是数组时，才把其元素视为 list 子节点
  if (Array.isArray(section?.[LIST_KEY])) {
    section[LIST_KEY].forEach((item, idx) => {
      node.children.push(collectSectionsHierarchically(item, [...path, LIST_KEY, idx]));
    });
  }
  // 注意：名字为 "{{list.N}}" 的布局块只是模板槽位，不是数据，不放进 children
  return node;
}

// ============= Per-node Processing（递归 + 精确插槽替换） ============
function processNode(node, compositeComponents, sectionIndex) {
  const { section, path, children } = node;

  // 1) 匹配组件
  const analysis = extractFieldCombinations({ sections: [section] });
  const fieldCombinations = analysis[0]?.fieldCombinations || [];

  const matched = compositeComponents.find((c) =>
    _.isEqual((c.fieldCombinations || []).sort(), fieldCombinations.sort()),
  );

  if (ENABLE_LOGS) {
    log("🔎 [processNode] match try:", {
      path: fmtPath(path),
      sectionName: section?.name,
      fcCount: fieldCombinations.length,
      matched: !!matched,
      matchedName: matched?.name || matched?.id || null,
    });
  }

  let instantiation = null;

  if (matched) {
    try {
      instantiation = instantiateComponentTemplate({
        component: matched,
        sectionData: section,
        sectionIndex,
        path,
      });
    } catch (e) {
      logError("❌ [processNode] instantiate failed:", {
        path: fmtPath(path),
        error: e?.message,
      });
    }
  } else {
    log("🟡 [processNode] no component matched, skip instantiation:", { path: fmtPath(path) });
  }

  const result = {
    section,
    path,
    component: matched,
    instantiation,
    matched: !!matched,
    children: [],
  };

  // 2) 只有父已实例化时，才收集 slot（在父实例范围内）
  const slotMap = instantiation?.section ? collectLayoutSlots(instantiation.section) : new Map();

  // 3) 递归处理子节点，并按 slot 精确替换（严格按本父节点 children 的索引）
  children.forEach((childNode, idx) => {
    const childResult = processNode(childNode, compositeComponents, idx);
    result.children.push(childResult);

    if (!childResult.instantiation?.section || !instantiation?.section) return;

    const childSection = childResult.instantiation.section;
    const listIdx = extractListIndexFromPath(childNode.path);

    if (listIdx !== null && slotMap.has(listIdx)) {
      replaceSlotWithChild(slotMap.get(listIdx), childSection);
    } else {
      // 找不到 slot：为了避免再次把子实例“挂到外面”，这里仅记录告警，不做 fallback append
      logError("⚠️  [processNode] no slot matched for child, skipped mounting:", {
        parentPath: fmtPath(path),
        childPath: fmtPath(childNode.path),
        childId: childSection.id,
      });
    }
  });

  return result;
}

// ============= Compose（一口气搞定匹配 & 递归挂载） ============
function composeSectionsWithComponents(middleFormatContent, componentLibrary) {
  const parsed =
    typeof middleFormatContent === "string" ? parse(middleFormatContent) : middleFormatContent;
  if (!parsed?.sections) {
    logError("⚠️  [compose] middle content has no sections");
    return { roots: [], flat: [] };
  }

  const compositeComponents = (componentLibrary || []).filter((c) => c.type === "composite");
  log("🧱 [compose] start:", {
    sections: parsed.sections.length,
    compositeCount: compositeComponents.length,
  });

  const roots = parsed.sections?.map((s, i) =>
    processNode(collectSectionsHierarchically(s, ["root", i]), compositeComponents, i),
  );

  const flat = [];
  (function flatten(nodes) {
    nodes.forEach((n) => {
      flat.push(n);
      if (n.children?.length) flatten(n.children);
    });
  })(roots);

  const matchedCount = flat.filter((x) => x.matched).length;
  log("✅ [compose] matching completed:", {
    matched: matchedCount,
    total: flat.length,
    ratio: `${matchedCount}/${flat.length}`,
  });
  return { roots, flat };
}

// ============= Main Entrypoint ============
export default async function composePagesData(input) {
  const {
    middleFormatFiles,
    componentLibrary,
    locale,
    translateLanguages = [],
    pagesDir,
    outputDir,
    tmpDir,
  } = input;

  try {
    rmSync(outputDir, { recursive: true, force: true });
    log("🧹 [composePagesData] clean outputDir:", { outputDir });
  } catch (e) {
    logError("⚠️  [composePagesData] clean outputDir failed:", { outputDir, error: e?.message });
  }

  log("🔧 [composePagesData] start:", {
    pagesDir,
    components: componentLibrary?.length || 0,
    locale,
    translateLanguages,
  });

  const allPagesKitYaml = [];
  const fileDataMap = new Map();

  if (Array.isArray(middleFormatFiles)) {
    // 组装多语言处理队列
    const filesToProcess = [
      ...middleFormatFiles.map((f) => ({ ...f, language: locale, isMainLanguage: true })),
      ...(translateLanguages && tmpDir
        ? translateLanguages.flatMap((lang) =>
            middleFormatFiles.map((f) => ({
              filePath: f.filePath,
              content: null,
              language: lang,
              isMainLanguage: false,
            })),
          )
        : []),
    ];

    log("📚 [composePagesData] filesToProcess:", {
      count: filesToProcess.length,
      main: filesToProcess.filter((f) => f.isMainLanguage).length,
      i18n: filesToProcess.filter((f) => !f.isMainLanguage).length,
    });

    for (const file of filesToProcess) {
      let content = file.content;
      if (!file.isMainLanguage) {
        content = await readMiddleFormatFile(tmpDir, file.language, file.filePath);
      } else if (typeof content === "string") {
        try {
          content = parse(content);
        } catch (e) {
          logError("❌ [composePagesData] parse main content failed:", {
            file: file.filePath,
            error: e?.message,
          });
          continue;
        }
      }
      if (!content) {
        logError("⚠️  [composePagesData] skip empty content:", {
          file: file.filePath,
          lang: file.language,
        });
        continue;
      }

      const { roots, flat } = composeSectionsWithComponents(content, componentLibrary);

      if (!fileDataMap.has(file.filePath)) {
        fileDataMap.set(file.filePath, {
          filePath: file.filePath,
          meta: content.meta,
          locales: {},
          sections: {},
          sectionIds: [],
          dataSource: {},
        });
      }
      const fd = fileDataMap.get(file.filePath);

      // 本地化信息
      fd.locales[file.language] = {
        backgroundColor: "",
        style: { maxWidth: "custom:1560px", paddingY: "large", paddingX: "large" },
        title: content.meta?.title,
        description: content.meta?.description,
        image: content.meta?.image,
        header: { sticky: true },
      };

      // 顶层仅挂根实例；子实例已在父实例内按 slot 替换，无需重复挂载
      if (file.isMainLanguage) {
        roots.forEach((r) => {
          const s = r.instantiation?.section;
          if (!s) return;
          fd.sections[s.id] = s;
          if (!fd.sectionIds.includes(s.id)) fd.sectionIds.push(s.id);
        });
        log("🌲 [composePagesData] root instances attached:", {
          file: file.filePath,
          roots: roots.filter((r) => !!r.instantiation?.section).length,
        });
      }

      // dataSource：统一聚合（所有节点）
      let dsAdded = 0;
      flat.forEach(({ instantiation }) => {
        if (!instantiation) return;
        Object.entries(instantiation.dataSource || {}).forEach(([id, data]) => {
          if (!id || data === undefined) return;
          if (!fd.dataSource[id]) fd.dataSource[id] = {};
          fd.dataSource[id][file.language] = _.cloneDeep(data);
          dsAdded++;
        });
      });
      log("🍱 [composePagesData] dataSource aggregated:", {
        file: file.filePath,
        lang: file.language,
        added: dsAdded,
        totalKeys: Object.keys(fd.dataSource).length,
      });
    }

    // 输出 YAML
    fileDataMap.forEach((fd) => {
      const now = new Date().toISOString();
      const yaml = {
        id: generateDeterministicId(fd.filePath),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        isPublic: true,
        locales: fd.locales,
        sections: fd.sections,
        sectionIds: fd.sectionIds,
        dataSource: fd.dataSource,
      };
      const content = stringify(yaml, { aliasDuplicateObjects: false });
      allPagesKitYaml.push({
        filePath: fd.filePath,
        content,
      });
      log("📝 [composePagesData] yaml prepared:", {
        file: fd.filePath,
        sectionCount: Object.keys(fd.sections || {}).length,
        rootIds: fd.sectionIds.length,
        dsKeys: Object.keys(fd.dataSource || {}).length,
      });
    });
  } else {
    logError("⚠️  [composePagesData] middleFormatFiles is not an array");
  }

  // 保存输出
  allPagesKitYaml.forEach(({ filePath, content }) => {
    try {
      savePagesKitData({
        path: basename(filePath).split(".")?.[0] || filePath,
        locale,
        pagesDir,
        pagesKitYaml: content,
        outputDir,
      });
      log("💾 [composePagesData] saved:", { file: filePath, bytes: content.length });
    } catch (e) {
      logError("❌ [composePagesData] save failed:", { file: filePath, error: e?.message });
    }
  });

  log("🎉 [composePagesData] done");
  return { ...input };
}

composePagesData.taskTitle = "Compose Pages Data";
