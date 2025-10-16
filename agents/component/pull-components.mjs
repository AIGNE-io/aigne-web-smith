import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import _ from "lodash";
import { parse } from "yaml";
import { BUILTIN_COMPONENT_LIBRARY_NAME, COMPONENTS_DIR } from "../../utils/constants.mjs";
import { clearDirExcept, resolveToAbsolute } from "../../utils/utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function pullComponents(input, options = {}) {
  const { tmpDir, outputDir, url } = input;

  if (!url) {
    return { message: "Please provide a URL to pull components" };
  }

  const rootDir = path.join(__dirname, "../../");
  const componentDir = path.join(rootDir, COMPONENTS_DIR);
  const filePath = path.join(componentDir, BUILTIN_COMPONENT_LIBRARY_NAME);

  const workspacePath = resolveToAbsolute(tmpDir);
  const websiteStructurePath = path.join(workspacePath, "website-structure.yaml");
  const generatedPagesPath = resolveToAbsolute(outputDir);

  try {
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // --- 读取旧文件 ---
    let oldAtomicCount = 0;
    let oldCompositeCount = 0;
    if (fs.existsSync(filePath)) {
      try {
        const oldText = fs.readFileSync(filePath, "utf8");
        const oldDoc = parse(oldText);
        oldAtomicCount = oldDoc.atomic?.length || 0;
        oldCompositeCount = oldDoc.composite?.length || 0;
      } catch {
        // ignore parse error
      }
    }

    // --- 拉取新文件（但不立即保存）---
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const text = await res.text();
    const doc = parse(text);

    const atomicCount = doc.atomic?.length || 0;
    const compositeCount = doc.composite?.length || 0;

    const formatSummary = (summary) => {
      const base = summary ?? "no summary";
      const normalized = base.replace(/\s+/g, " ").trim();
      const display = normalized || "no summary";
      return _.truncate(display, { length: 60 });
    };

    // --- 格式化输出 ---
    let statsMessage = `✅ Pull Components successfully (not saved yet)!
📊 New Components Statistics:
  🔹 Atomic components: ${atomicCount} (${oldAtomicCount} → ${atomicCount})`;
    doc.atomic?.forEach((a) => {
      statsMessage += `\n    • ${a.name} - ${formatSummary(a.summary)}`;
    });

    statsMessage += `\n  🧩 Composite components: ${compositeCount} (${oldCompositeCount} → ${compositeCount})`;
    doc.composite?.forEach((c) => {
      statsMessage += `\n    • ${c.name} - ${formatSummary(c.summary)}`;
    });

    console.info(statsMessage);

    let resultMessage = "";

    // --- 是否需要保存 ---
    if (options.prompts) {
      const answer = await options.prompts.confirm({
        message: "Do you want to update (save) the built-in components file?",
        initial: false,
      });

      if (answer) {
        // 确认后才保存
        fs.writeFileSync(filePath, text);
        resultMessage += `\n💾 New components saved.`;

        const failed = [];

        // keep website-structure.yaml, because user may have modified it
        try {
          clearDirExcept(workspacePath, [websiteStructurePath]);
        } catch (e) {
          failed.push(`workspace: ${e?.message || String(e)}`);
        }

        // output（全量清空）
        try {
          if (fs.existsSync(generatedPagesPath)) {
            fs.rmSync(generatedPagesPath, { recursive: true, force: true });
          }
          fs.mkdirSync(generatedPagesPath, { recursive: true });
        } catch (e) {
          failed.push(`output: ${e?.message || String(e)}`);
        }

        if (failed.length === 0) {
          const cleanedMsg = "🧹 Cleaned previous generated content.";
          resultMessage += `\n${cleanedMsg}`;
        } else {
          const warnMsg =
            "⚠️ Some previous generated content could not be cleaned, please check manually.";
          resultMessage += `\n${warnMsg}`;
        }

        const reminder = `🚀 Next: please run below command to re-generate pages:\n\n  \`aigne web generate\`\n\n`;
        resultMessage += `\n${reminder}`;
      } else {
        resultMessage += `\n⏩ No modification applied.`;
      }
    }

    return { message: resultMessage };
  } catch (err) {
    return { message: `❌ Pull Components Error: ${err.message}` };
  }
}

pullComponents.taskRenderMode = "hide";
