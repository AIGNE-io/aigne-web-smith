import "../../../setup/enable-logs.mjs";
import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import * as fsSync from "node:fs";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as globModule from "glob";
import { parse } from "yaml";
import composePagesData, {
  __testHelpers,
  __testProcessSimpleTemplate,
} from "../../../../agents/generate/page-data/compose-pages-data.mjs";
import * as savePagesDataModule from "../../../../agents/generate/page-data/save-pages-data.mjs";
import { EMPTY_VALUE } from "../../../../utils/constants.mjs";
import { generateDeterministicId } from "../../../../utils/utils.mjs";
import {
  buildArrayAndFileComponentLibrary,
  buildComplexLayoutComponentLibrary,
  buildListComponentLibrary,
  buildPrunableComponentLibrary,
  buildSimpleComponentLibrary,
} from "../../../mock-data/component-library.mjs";

describe("composePagesData", () => {
  let saveSpy;
  let savedPayloads;
  let tempDirs;

  const registerTempDir = (dir) => {
    tempDirs.push(dir);
    return dir;
  };

  const createOutputDir = () =>
    registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-output-")));

  beforeEach(() => {
    savedPayloads = [];
    tempDirs = [];
    saveSpy = spyOn(savePagesDataModule, "default").mockImplementation(async (payload) => {
      savedPayloads.push(payload);
      return { ...payload, pagesKitFilePath: join(createOutputDir(), `${payload.path}.yaml`) };
    });
  });

  afterEach(() => {
    saveSpy?.mockRestore();
    tempDirs.forEach((dir) => {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    });
  });

  test("generates pages kit yaml with substituted data and cleaned placeholders", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "home.yaml",
          content: {
            meta: { title: "Home", description: "Landing" },
            sections: [
              {
                sectionName: "Simple hero",
                title: "Hero Title",
                subtitle: "Hero Subtitle",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);

    expect(savedPayloads).toHaveLength(1);
    expect(savedPayloads[0].path).toBe("home");

    expect(result.allPagesKitYaml).toHaveLength(1);
    expect(result.allPagesKitYaml[0].filePath).toBe("home.yaml");

    const parsed = parse(result.allPagesKitYaml[0].content);

    const expectedRootId = generateDeterministicId(
      JSON.stringify({
        templateId: "simple-hero-component",
        templateSectionId: "simple-hero-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    expect(parsed.sectionIds).toEqual([expectedRootId]);
    const heroSection = parsed.sections[expectedRootId];
    expect(heroSection.component).toBe("custom-component");
    expect(heroSection.config.componentId).toBe("hero-blocklet");
    expect(heroSection.config.useCache).toBe(true);

    const heroData = parsed.dataSource[expectedRootId].en.properties;
    expect(heroData.headline.value).toBe("Hero Title");
    expect(heroData.subheading.value).toBe("Hero Subtitle");
    expect(heroData.tagline.value).toBe("");
  });

  test("replaces list slots with instantiated children and propagates layout metadata", async () => {
    const componentLibrary = buildListComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "list-page.yaml",
          content: {
            meta: { title: "List Page", description: "List description" },
            sections: [
              {
                sectionName: "List layout",
                title: "Features",
                list: [
                  {
                    sectionName: "First item",
                    itemTitle: "First Feature",
                    itemDescription: "First description",
                  },
                  {
                    sectionName: "Second item",
                    itemTitle: "Second Feature",
                    itemDescription: "Second description",
                  },
                ],
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);

    expect(savedPayloads).toHaveLength(1);
    expect(savedPayloads[0].path).toBe("list-page");

    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "list-layout-component",
        templateSectionId: "list-layout-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );
    const child0Id = generateDeterministicId(
      JSON.stringify({
        templateId: "list-item-component",
        templateSectionId: "list-item-template",
        sectionIndex: 0,
        path: ["root", 0, "list", 0],
      }),
    );
    const child1Id = generateDeterministicId(
      JSON.stringify({
        templateId: "list-item-component",
        templateSectionId: "list-item-template",
        sectionIndex: 1,
        path: ["root", 0, "list", 1],
      }),
    );

    expect(parsed.sectionIds).toEqual([parentId]);
    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds).toEqual([child0Id, child1Id]);
    expect(Object.keys(parentSection.sections).sort()).toEqual([child0Id, child1Id]);

    const desktopLayout = parentSection.config.gridSettings.desktop;
    expect(Object.keys(desktopLayout).sort()).toEqual([child0Id, child1Id]);
    expect(desktopLayout[child0Id].id).toBe(child0Id);
    expect(desktopLayout[child1Id].id).toBe(child1Id);
    expect(JSON.stringify(parentSection.config)).not.toContain("slot-");

    const child0 = parentSection.sections[child0Id];
    const child1 = parentSection.sections[child1Id];
    expect(child0.name).toBe("List Layout-1");
    expect(child1.name).toBe("List Layout-2");
    expect(child0.config.componentId).toBe("list-item-blocklet");
    expect(child0.config.useCache).toBe(true);
    expect(child0.config.paddingX).toBe("none");
    expect(child0.config.paddingY).toBe("small");

    const parentData = parsed.dataSource[parentId].en.properties;
    expect(parentData.sectionTitle.value).toBe("Features");

    const child0Data = parsed.dataSource[child0Id].en.properties;
    expect(child0Data.headline.value).toBe("First Feature");
    expect(child0Data.description.value).toBe("First description");

    const child1Data = parsed.dataSource[child1Id].en.properties;
    expect(child1Data.headline.value).toBe("Second Feature");
    expect(child1Data.description.value).toBe("Second description");
  });

  test("aggregates multi-locale content via translated middle files", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const tmpBase = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));
    const jaDir = join(tmpBase, "ja");
    mkdirSync(jaDir, { recursive: true });
    writeFileSync(
      join(jaDir, "home.yaml"),
      `
meta:
  title: "JA Title"
  description: "日本語の説明"
sections:
  - sectionName: "シンプルヒーロー"
    title: "ヒーロータイトル"
    subtitle: "サブタイトル"
`,
      "utf8",
    );

    const input = {
      middleFormatFiles: [
        {
          filePath: "home.yaml",
          content: {
            meta: { title: "EN Title", description: "English description" },
            sections: [
              {
                sectionName: "Simple hero",
                title: "Hero Title EN",
                subtitle: "Hero Subtitle EN",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: ["ja"],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpBase,
    };

    const result = await composePagesData(input);

    expect(savedPayloads).toHaveLength(1);

    const parsed = parse(result.allPagesKitYaml[0].content);
    expect(Object.keys(parsed.locales).sort()).toEqual(["en", "ja"]);
    expect(parsed.locales.en.title).toBe("EN Title");
    expect(parsed.locales.ja.title).toBe("JA Title");

    const expectedRootId = generateDeterministicId(
      JSON.stringify({
        templateId: "simple-hero-component",
        templateSectionId: "simple-hero-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    expect(parsed.sectionIds).toEqual([expectedRootId]);
    const dataSource = parsed.dataSource[expectedRootId];
    expect(dataSource.en.properties.headline.value).toBe("Hero Title EN");
    expect(dataSource.ja.properties.headline.value).toBe("ヒーロータイトル");
  });

  test("cleans unresolved layout slots when list length is shorter than template", async () => {
    const componentLibrary = buildListComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "short-list.yaml",
          content: {
            meta: { title: "Short List", description: "Only one item" },
            sections: [
              {
                sectionName: "List layout",
                title: "Highlights",
                list: [
                  {
                    sectionName: "Only item",
                    itemTitle: "Single Feature",
                    itemDescription: "Description only",
                  },
                ],
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);

    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "list-layout-component",
        templateSectionId: "list-layout-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );
    const child0Id = generateDeterministicId(
      JSON.stringify({
        templateId: "list-item-component",
        templateSectionId: "list-item-template",
        sectionIndex: 0,
        path: ["root", 0, "list", 0],
      }),
    );
    const missingChildId = generateDeterministicId(
      JSON.stringify({
        templateId: "list-item-component",
        templateSectionId: "list-item-template",
        sectionIndex: 1,
        path: ["root", 0, "list", 1],
      }),
    );

    expect(parsed.sectionIds).toEqual([parentId]);
    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds).toEqual([child0Id]);
    expect(Object.keys(parentSection.sections)).toEqual([child0Id]);
    expect(JSON.stringify(parentSection.config)).not.toContain("slot-");

    const desktopLayout = parentSection.config.gridSettings.desktop;
    expect(Object.keys(desktopLayout)).toEqual([child0Id]);

    expect(parsed.dataSource[child0Id]).toBeDefined();
    expect(parsed.dataSource[missingChildId]).toBeUndefined();
  });

  test("compresses grid settings rows after pruning unused child sections", async () => {
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));
    const componentLibrary = [
      {
        type: "composite",
        id: "grid-root-component",
        name: "GridRoot",
        fieldCombinations: ["primaryValue", "secondaryValue"],
        section: {
          id: "grid-root-template",
          name: "Grid Root",
          component: "layout-block",
          sections: {
            "grid-slot-primary": {
              id: "grid-slot-primary",
              name: "Primary slot",
              component: "custom-component",
              config: {
                componentId: "grid-child-blocklet",
              },
            },
            "grid-slot-secondary": {
              id: "grid-slot-secondary",
              name: "Secondary slot",
              component: "custom-component",
              config: {
                componentId: "grid-child-blocklet",
              },
            },
          },
          sectionIds: ["grid-slot-primary", "grid-slot-secondary"],
          config: {
            gridSettings: {
              desktop: [
                {
                  id: "grid-slot-primary",
                  y: 5,
                  w: 6,
                  gridSettings: {
                    nested: [
                      {
                        id: "nested-slot",
                        y: 11,
                      },
                    ],
                  },
                },
                { id: "grid-slot-secondary", y: 10, w: 6 },
              ],
              tablet: null,
              mobile: "grid-slot-secondary",
              monitor: {
                "grid-slot-secondary": {
                  id: "grid-slot-secondary",
                  y: 8,
                },
                sectionIds: ["grid-slot-secondary"],
                sections: {
                  "grid-slot-secondary": {
                    nested: true,
                  },
                },
                gridSettings: {
                  portrait: [
                    {
                      id: "grid-slot-secondary",
                      y: 14,
                    },
                  ],
                },
              },
            },
          },
        },
        dataSource: {
          "grid-slot-primary": {
            properties: {
              text: {
                value: "<%= primaryValue %>",
              },
            },
          },
          "grid-slot-secondary": {
            properties: {
              text: {
                value: "<%= secondaryValue %>",
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "grid.yaml",
          content: {
            meta: { title: "Grid Page", description: "Grid pruning test" },
            sections: [
              {
                sectionName: "Grid root",
                primaryValue: "Keep me",
                // secondaryValue intentionally omitted to prune the second slot
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "grid-root-component",
        templateSectionId: "grid-root-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );
    const childId = generateDeterministicId(
      JSON.stringify({
        templateId: "grid-root-component",
        templateSectionId: "grid-slot-primary",
        sectionIndex: 0,
        path: ["root", 0, 0],
      }),
    );
    const prunedChildId = generateDeterministicId(
      JSON.stringify({
        templateId: "grid-root-component",
        templateSectionId: "grid-slot-secondary",
        sectionIndex: 0,
        path: ["root", 0, 1],
      }),
    );

    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds).toEqual([childId]);
    expect(parentSection.sections[childId]).toBeDefined();
    expect(parentSection.sections[prunedChildId]).toBeUndefined();

    const gridSettings = parentSection.config.gridSettings;
    expect(Object.keys(gridSettings)).toEqual(["desktop", "monitor"]);
    const desktopLayout = gridSettings.desktop;
    expect(desktopLayout).toHaveLength(1);
    expect(desktopLayout[0].id).toBe(childId);
    expect(desktopLayout[0].y).toBe(0);
    expect(desktopLayout[0].gridSettings.nested[0].y).toBe(0);
    expect(gridSettings.monitor.sectionIds).toEqual(["grid-slot-secondary"]);
    expect(gridSettings.monitor.gridSettings.portrait[0].id).toBe(prunedChildId);
  });

  test("resolveValue falls back for unsupported and failing file references", async () => {
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));
    const realGlobSync = globModule.sync;
    const globSpy = spyOn(globModule, "sync").mockImplementation((pattern, options) => {
      if (pattern.includes("force-error.yaml")) {
        return [join(process.cwd(), "tests/mock-data/snippets/force-error.yaml")];
      }
      return realGlobSync(pattern, options);
    });
    const originalReadFileSync = fsSync.readFileSync;
    const readSpy = spyOn(fsSync, "readFileSync").mockImplementation((filePath, ...rest) => {
      if (typeof filePath === "string" && filePath.includes("force-error.yaml")) {
        throw new Error("forced-read-error");
      }
      return originalReadFileSync(filePath, ...rest);
    });

    const componentLibrary = [
      {
        type: "composite",
        id: "file-ref-component",
        name: "FileRef",
        fieldCombinations: ["unsupportedPath", "errorPath"],
        section: {
          id: "file-ref-template",
          name: "File Ref",
          component: "custom-component",
          config: {
            componentId: "file-ref-blocklet",
          },
        },
        dataSource: {
          "file-ref-template": {
            properties: {
              unsupported: {
                value: "<%= unsupportedPath %>",
              },
              errored: {
                value: "<%= errorPath %>",
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "file-ref.yaml",
          content: {
            meta: { title: "File Ref", description: "File reference test" },
            sections: [
              {
                sectionName: "File ref",
                unsupportedPath: "@tests/mock-data/snippets/sample-copy.bin",
                errorPath: "@tests/mock-data/snippets/force-error.yaml",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    try {
      const result = await composePagesData(input);
      const parsed = parse(result.allPagesKitYaml[0].content);

      const sectionId = generateDeterministicId(
        JSON.stringify({
          templateId: "file-ref-component",
          templateSectionId: "file-ref-template",
          sectionIndex: 0,
          path: ["root", 0],
        }),
      );

      const properties = parsed.dataSource[sectionId].en.properties;
      expect(properties.unsupported.value).toBe("@tests/mock-data/snippets/sample-copy.bin");
      expect(properties.errored.value).toBe("@tests/mock-data/snippets/force-error.yaml");
    } finally {
      globSpy.mockRestore();
      readSpy.mockRestore();
    }
  });

  test("prunes empty child sections and reflows layout config when placeholders remain empty", async () => {
    const componentLibrary = buildPrunableComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "prune.yaml",
          content: {
            meta: { title: "Prune Test", description: "Verify pruning" },
            sections: [
              {
                sectionName: "Prunable",
                title: "Keep Heading",
                // optionalQuote intentionally omitted to trigger prune
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "prunable-layout-component",
        templateSectionId: "prunable-layout-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );
    const childId = generateDeterministicId(
      JSON.stringify({
        templateId: "prunable-layout-component",
        templateSectionId: "prunable-quote",
        sectionIndex: 0,
        path: ["root", 0, 0],
      }),
    );

    expect(parsed.sectionIds).toEqual([parentId]);
    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds).toBeUndefined();
    expect(parentSection.sections).toBeUndefined();
    expect(parentSection.config.gridSettings).toBeUndefined();
    expect(parsed.dataSource[parentId].en.properties.heading.value).toBe("Keep Heading");
    expect(parsed.dataSource[childId]).toBeUndefined();
  });

  test("expands array templates and resolves external file references", async () => {
    const componentLibrary = buildArrayAndFileComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "array-file.yaml",
          content: {
            meta: { title: "Array File", description: "Array template test" },
            sections: [
              {
                sectionName: "Array file",
                title: "Feature Highlights",
                copyPath: "@tests/mock-data/snippets/sample-copy.txt",
                items: [{ label: "Item A", detail: "Detail A" }],
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const sectionId = generateDeterministicId(
      JSON.stringify({
        templateId: "array-file-component",
        templateSectionId: "array-file-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    const dataProps = parsed.dataSource[sectionId].en.properties;
    expect(dataProps.heading.value).toBe("Feature Highlights");
    expect(dataProps.copy.value).toContain("loaded from an external file");
    expect(Array.isArray(dataProps.bulletList.value)).toBe(true);
    expect(dataProps.bulletList.value).toHaveLength(1);
    expect(dataProps.bulletList.value[0]).toEqual({ label: "Item A", detail: "Detail A" });
  });

  test("skips unmatched sections without emitting root instances", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "unmatched.yaml",
          content: {
            meta: { title: "Unmatched", description: "No matching component" },
            sections: [
              {
                sectionName: "Unknown",
                unsupportedField: "value",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    expect(parsed.sectionIds).toEqual([]);
    expect(parsed.sections).toEqual({});
    expect(Object.keys(parsed.dataSource)).toHaveLength(0);
  });

  test("ignores missing translated middle files while keeping main locale output", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "home.yaml",
          content: {
            meta: { title: "Main Locale", description: "Primary" },
            sections: [
              {
                sectionName: "Simple hero",
                title: "Primary Title",
                subtitle: "Primary Subtitle",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: ["fr"],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    expect(Object.keys(parsed.locales)).toEqual(["en"]);
    const rootId = parsed.sectionIds[0];
    expect(parsed.dataSource[rootId].en.properties.headline.value).toBe("Primary Title");
  });

  test("__testProcessSimpleTemplate handles complex values and missing placeholders", () => {
    const data = {
      title: "Sample",
      meta: { count: 3 },
      list: [{ value: "A" }, { value: "B" }],
    };
    const rendered = __testProcessSimpleTemplate("Meta: <%= meta %>", data);
    expect(rendered).toBe('Meta: {"count":3}');

    const cloned = __testProcessSimpleTemplate("<%= meta %>", data);
    expect(cloned).toEqual({ count: 3 });
    expect(cloned).not.toBe(data.meta);

    const arrayResult = __testProcessSimpleTemplate(
      ["<%= list.0.value %>", "<%= missingField %>"],
      data,
    );
    expect(arrayResult[0]).toBe("A");
    expect(arrayResult[1]).toContain("___EMPTY_VALUE___");

    const dottedValue = __testProcessSimpleTemplate("<%= dotted.key %>", {
      "dotted.key": "direct",
    });
    expect(dottedValue).toBe("direct");

    const missingFromNull = __testProcessSimpleTemplate("<%= anything %>", null);
    expect(missingFromNull).toContain("___EMPTY_VALUE___");

    const inlineMissing = __testProcessSimpleTemplate("Hello <%= missing %>", {});
    expect(inlineMissing).toContain("___EMPTY_VALUE___");

    const inlineObject = __testProcessSimpleTemplate("JSON <%= meta %>", {
      meta: { a: 1 },
    });
    expect(inlineObject).toContain('{"a":1}');
  });

  test("handles complex layout cleanup and missing file fallback", async () => {
    const componentLibrary = buildComplexLayoutComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "complex.yaml",
          content: {
            meta: { title: "Complex", description: "Complex layout page" },
            sections: [
              {
                sectionName: "Complex layout",
                title: "Complex Layout Title",
                metaInfo: { count: 42 },
                missingFile: "@tests/mock-data/snippets/not-found.txt",
                list: [
                  {
                    sectionName: "Child A",
                    itemTitle: "A",
                    itemDescription: "Alpha",
                  },
                  {
                    sectionName: "Child B",
                    itemTitle: "B",
                    itemDescription: "Beta",
                  },
                ],
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "complex-layout-component",
        templateSectionId: "complex-layout-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );
    const child0Id = generateDeterministicId(
      JSON.stringify({
        templateId: "complex-item-component",
        templateSectionId: "complex-item-template",
        sectionIndex: 0,
        path: ["root", 0, "list", 0],
      }),
    );
    const child1Id = generateDeterministicId(
      JSON.stringify({
        templateId: "complex-item-component",
        templateSectionId: "complex-item-template",
        sectionIndex: 1,
        path: ["root", 0, "list", 1],
      }),
    );
    expect(parsed.sectionIds).toEqual([parentId]);
    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds).toEqual([child0Id]);
    expect(Object.keys(parentSection.sections)).toEqual([child0Id]);
    const parentConfigDesktop = parentSection.config?.gridSettings?.desktop;
    if (Array.isArray(parentConfigDesktop)) {
      expect(parentConfigDesktop).toHaveLength(2);
      parentConfigDesktop.forEach((entry) => {
        if (typeof entry === "string") {
          expect(typeof entry).toBe("string");
        } else if (entry && typeof entry === "object") {
          expect(Array.isArray(entry.sectionIds) ? entry.sectionIds.length : 0).toBeLessThanOrEqual(
            1,
          );
        }
      });
    }

    const child0Data = parsed.dataSource[child0Id].en.properties;
    expect(child0Data.headline.value).toBe("A");
    expect(parsed.dataSource[child1Id].en.properties.headline.value).toBe("B");
    expect(parsed.locales.en.title).toBe("Complex");

    const rootData = parsed.dataSource[parentId].en.properties;
    expect(rootData.metaSerialized.value).toBe('meta:{"count":42}');
    expect(rootData.missing.value).toBe("@tests/mock-data/snippets/not-found.txt");
    expect(rootData.staticList.value).toEqual([
      "Complex Layout Title",
      "@tests/mock-data/snippets/not-found.txt",
    ]);
  });

  test("logs missing child template and keeps parent without phantom ids", async () => {
    const componentLibrary = [
      {
        type: "composite",
        id: "broken-component",
        name: "BrokenComponent",
        fieldCombinations: ["value"],
        section: {
          id: "broken-root-template",
          name: "Broken Root",
          component: "layout-block",
          sections: {},
          sectionIds: ["missing-child"],
          config: {
            gridSettings: {
              desktop: {
                "missing-child": {
                  id: "missing-child",
                  x: 0,
                  y: 5,
                  w: 12,
                  h: 2,
                },
              },
            },
          },
        },
        dataSource: {
          "broken-root-template": {
            properties: {
              text: {
                value: "<%= value %>",
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "broken.yaml",
          content: {
            meta: { title: "Broken", description: "Missing child" },
            sections: [
              {
                sectionName: "Broken",
                value: "Keeps root",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-"))),
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "broken-component",
        templateSectionId: "broken-root-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    const parentSection = parsed.sections[parentId];
    expect(parentSection.sectionIds || []).toHaveLength(0);
    expect(parentSection.sections || {}).toEqual({});
    const desktopConfig = parentSection.config?.gridSettings?.desktop || {};
    expect(Object.keys(desktopConfig)).toEqual(["missing-child"]);
    const dataSource = parsed.dataSource[parentId].en.properties;
    expect(dataSource.text.value).toBe("Keeps root");
  });

  test("prunes data source when array template receives empty data", async () => {
    const componentLibrary = [
      {
        type: "composite",
        id: "array-empty-component",
        name: "ArrayEmpty",
        fieldCombinations: ["items"],
        section: {
          id: "array-empty-template",
          name: "Array Empty",
          component: "custom-component",
          config: {
            componentId: "array-empty-blocklet",
          },
        },
        dataSource: {
          "array-empty-template": {
            properties: {
              bulletList: {
                value: [
                  {
                    label: "<%= items.label %>",
                  },
                ],
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "array-empty.yaml",
          content: {
            meta: { title: "Array Empty", description: "Empty items" },
            sections: [
              {
                sectionName: "Empty array",
                items: [],
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-"))),
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const parentId = generateDeterministicId(
      JSON.stringify({
        templateId: "array-empty-component",
        templateSectionId: "array-empty-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    expect(parsed.sectionIds).toEqual([]);
    expect(parsed.sections).toEqual({});
    expect(parsed.dataSource[parentId]).toBeUndefined();
  });

  test("compose emits empty sections when middle content lacks sections array", async () => {
    const input = {
      middleFormatFiles: [
        {
          filePath: "no-sections.yaml",
          content: {
            meta: { title: "No Sections", description: "Sectionless content" },
          },
        },
      ],
      componentLibrary: [],
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-"))),
    };

    const result = await composePagesData(input);
    expect(result.allPagesKitYaml).toHaveLength(1);
    const parsed = parse(result.allPagesKitYaml[0].content);
    expect(parsed.sectionIds).toEqual([]);
    expect(parsed.sections).toEqual({});
  });

  test("logs rmSync failures but continues composing output", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const outputDir = createOutputDir();
    const rmSpy = spyOn(fsSync, "rmSync").mockImplementation((target, options) => {
      if (target === outputDir) {
        throw new Error("forced-rm-error");
      }
      return fsSync.rmSync(target, options);
    });

    const input = {
      middleFormatFiles: [
        {
          filePath: "rm-error.yaml",
          content: {
            meta: { title: "RM Error", description: "Output cleanup" },
            sections: [
              {
                sectionName: "Hero",
                title: "Hero",
                subtitle: "Subtitle",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir,
      tmpDir: registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-"))),
    };

    try {
      const result = await composePagesData(input);
      expect(result.allPagesKitYaml).toHaveLength(1);
    } finally {
      rmSpy.mockRestore();
    }
  });

  test("returns early when middleFormatFiles is not an array", async () => {
    const result = await composePagesData({
      middleFormatFiles: null,
      componentLibrary: [],
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-"))),
    });

    expect(result.allPagesKitYaml).toEqual([]);
  });

  test("skips components without template sections", async () => {
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));
    const componentLibrary = [
      {
        type: "composite",
        id: "sectionless-component",
        name: "Sectionless",
        fieldCombinations: ["title"],
        dataSource: {
          orphan: {
            properties: {
              value: {
                value: "<%= title %>",
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "sectionless.yaml",
          content: {
            meta: { title: "Sectionless", description: "No template" },
            sections: [
              {
                sectionName: "No template",
                title: "Should be skipped",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    expect(parsed.sectionIds).toEqual([]);
    expect(parsed.sections).toEqual({});
    expect(parsed.dataSource).toEqual({});
  });

  test("skips invalid main locale YAML gracefully", async () => {
    const componentLibrary = buildSimpleComponentLibrary();
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));

    const input = {
      middleFormatFiles: [
        {
          filePath: "invalid.yaml",
          content: "[unclosed",
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    expect(result.allPagesKitYaml).toHaveLength(0);
  });

  test("keeps root section when pruning cannot remove root instance", async () => {
    const tmpWorkingDir = registerTempDir(mkdtempSync(join(tmpdir(), "compose-pages-temp-")));
    const componentLibrary = [
      {
        type: "composite",
        id: "root-only-component",
        name: "RootOnly",
        fieldCombinations: ["title"],
        section: {
          id: "root-only-template",
          name: "Root Only",
          component: "custom-component",
          config: {
            componentId: "root-only-blocklet",
          },
        },
        dataSource: {
          "root-only-template": {
            properties: {
              placeholderOnly: {
                value: "<%= optionalFeature %>",
              },
            },
          },
        },
      },
    ];

    const input = {
      middleFormatFiles: [
        {
          filePath: "root-only.yaml",
          content: {
            meta: { title: "Root Only", description: "Root prune test" },
            sections: [
              {
                sectionName: "Root only",
                title: "Root Title",
              },
            ],
          },
        },
      ],
      componentLibrary,
      locale: "en",
      translateLanguages: [],
      pagesDir: "/virtual/pages",
      outputDir: createOutputDir(),
      tmpDir: tmpWorkingDir,
    };

    const result = await composePagesData(input);
    const parsed = parse(result.allPagesKitYaml[0].content);

    const rootId = generateDeterministicId(
      JSON.stringify({
        templateId: "root-only-component",
        templateSectionId: "root-only-template",
        sectionIndex: 0,
        path: ["root", 0],
      }),
    );

    expect(parsed.sectionIds).toEqual([rootId]);
    expect(parsed.sections[rootId].component).toBe("custom-component");
    expect(parsed.dataSource[rootId]).toBeUndefined();
  });
});

describe("composePagesData helpers", () => {
  const {
    tryReadFileContent,
    getNestedValue,
    processArrayTemplate,
    __resolver,
    processTemplate,
    cloneTemplateSection,
    compressLayoutRows,
    compressGridSettings,
    cleanupLayoutConfig,
    remapIdsInPlace,
    replaceSlotWithChild,
    removeSlot,
    collectLayoutSlots,
    pruneSectionById,
  } = __testHelpers;

  test("tryReadFileContent handles supported, unsupported, and missing files", () => {
    const cwd = process.cwd();
    expect(tryReadFileContent("tests/mock-data/snippets/sample-copy.txt", cwd)).toContain(
      "This copy is loaded",
    );
    expect(tryReadFileContent("tests/mock-data/snippets/sample-copy.bin", cwd)).toBeNull();
    expect(tryReadFileContent("tests/mock-data/snippets/missing.txt", cwd)).toBeNull();
  });

  test("getNestedValue resolves dotted paths, arrays, and file references", () => {
    const data = {
      simple: "value",
      nested: { item: "inner" },
      "dotted.key": "direct",
      list: [{ name: "A" }],
      fileRef: "@tests/mock-data/snippets/sample-copy.txt",
    };

    expect(getNestedValue(data, "simple")).toBe("value");
    expect(getNestedValue(data, "nested.item")).toBe("inner");
    expect(getNestedValue(data, "dotted.key")).toBe("direct");
    expect(getNestedValue(data, "list[0].name")).toBe("A");
    expect(getNestedValue(data, "fileRef")).toContain("This copy is loaded");
    expect(getNestedValue(null, "anything")).toBeUndefined();
    expect(getNestedValue({ "deep.key": "direct" }, "deep.key")).toBe("direct");
    expect(getNestedValue({ deep: { key: "via path" } }, "deep.key")).toBe("via path");
  });

  test("processArrayTemplate handles multiple templates and empty arrays", () => {
    const stats = { placeholders: 0, filled: 0 };
    const multiTemplate = processArrayTemplate(
      ["<%= first %>", "<%= second %>"],
      { first: "A", second: "B" },
      stats,
    );
    expect(multiTemplate).toEqual(["A", "B"]);

    const emptyResult = processArrayTemplate(
      ["<%= item.value %>"],
      { items: [] },
      { placeholders: 0, filled: 0 },
    );
    expect(emptyResult).toHaveLength(1);
    expect(emptyResult[0]).toBe(EMPTY_VALUE);

    const filled = processArrayTemplate(
      [{ label: "<%= label %>" }],
      { entries: [{ label: "Z" }] },
      { placeholders: 0, filled: 0 },
    );
    expect(filled).toEqual([{ label: "Z" }]);
  });

  test("processTemplate supports array and object results", () => {
    const arrayRes = processTemplate(
      ["<%= value %>"],
      { value: "X" },
      { placeholders: 0, filled: 0 },
    );
    expect(Array.isArray(arrayRes)).toBe(true);
    expect(arrayRes[0]).toBe("X");

    const objectRes = processTemplate(
      { key: "<%= missing %>" },
      { other: "value" },
      { placeholders: 0, filled: 0 },
    );
    expect(objectRes.key).toBe(EMPTY_VALUE);
  });

  test("cloneTemplateSection tolerates missing child templates", () => {
    const template = {
      id: "root",
      component: "layout-block",
      sections: {},
      sectionIds: ["missing"],
      config: {},
    };
    const idMap = new Map();
    const cloned = cloneTemplateSection(
      template,
      { templateId: "temp", sectionIndex: 0, path: [] },
      idMap,
    );
    expect(cloned.sectionIds).toEqual([]);
    expect(cloned.sections).toEqual({});
    expect(cloned.config).toEqual({});
  });

  test("resolveValue returns original when not a string and reads files", () => {
    expect(__testHelpers.resolveValue({ value: 123 })).toBe(123);
    expect(__testHelpers.resolveValue({ value: { key: "value" } })).toEqual({ key: "value" });
    expect(
      __testHelpers.resolveValue({ value: "@tests/mock-data/snippets/sample-copy.txt" }),
    ).toContain("This copy is loaded");
    expect(__testHelpers.resolveValue({ value: "@tests/mock-data/snippets/sample-copy.bin" })).toBe(
      "@tests/mock-data/snippets/sample-copy.bin",
    );
  });

  test("compressLayoutRows normalises y positions", () => {
    const layout = [{ y: 4 }, { y: 10 }, { y: 10 }];
    compressLayoutRows(layout);
    expect(layout.map((item) => item.y)).toEqual([0, 1, 1]);
  });

  test("compressGridSettings removes empty entries across devices", () => {
    const config = {
      gridSettings: {
        desktop: [
          {
            id: "keep",
            y: 5,
            gridSettings: {
              nested: [
                {
                  id: "nested",
                  y: 10,
                },
              ],
            },
          },
          {
            id: "remove",
            y: 2,
            gridSettings: {
              inner: [],
            },
          },
        ],
        tablet: null,
        monitor: {
          sections: {
            placeholder: {},
          },
          sectionIds: ["placeholder"],
        },
        mobile: "placeholder",
      },
    };

    compressGridSettings(config);
    expect(config.gridSettings.desktop).toHaveLength(2);
    expect(config.gridSettings.desktop[0].gridSettings.nested[0].y).toBe(0);
    expect(config.gridSettings.tablet).toBeUndefined();
    expect(config.gridSettings.monitor.sectionIds).toEqual(["placeholder"]);
    expect(config.gridSettings.mobile).toBeUndefined();
  });

  test("compressGridSettings drops entire gridSettings when devices emptied", () => {
    const config = {
      gridSettings: {
        tablet: null,
        mobile: undefined,
      },
    };

    compressGridSettings(config);
    expect(config.gridSettings).toBeUndefined();
  });

  test("cleanupLayoutConfig removes placeholder references from mixed layouts", () => {
    const config = {
      sectionIds: ["placeholder", "keep"],
      gridSettings: {
        desktop: ["placeholder", { sectionIds: ["placeholder", "keep"] }],
        monitor: {
          placeholder: { orphan: true },
          sections: { placeholder: { nested: true } },
          sectionIds: ["placeholder"],
        },
        mobile: "placeholder",
        kiosk: {
          placeholder: { ref: true },
        },
      },
    };

    cleanupLayoutConfig(config, "placeholder");
    expect(config.sectionIds).toEqual(["keep"]);
    expect(config.gridSettings.desktop.length).toBeGreaterThan(0);
    expect(config.gridSettings.monitor).toBeUndefined();
    expect(config.gridSettings.mobile).toBeUndefined();
    expect(config.gridSettings.kiosk).toBeUndefined();
  });

  test("pruneSectionById traverses nested sections and removes target", () => {
    const tree = {
      id: "root",
      sections: {
        child: {
          id: "child",
          sections: {
            leaf: { id: "leaf" },
          },
          sectionIds: ["leaf"],
        },
      },
      sectionIds: ["child"],
    };

    const removed = pruneSectionById(tree, "leaf");
    expect(removed).toBe(true);
    expect(tree.sections.child.sections).toBeUndefined();
    expect(tree.sections.child.sectionIds).toBeUndefined();
  });

  test("remapIdsInPlace updates both arrays and objects", () => {
    const obj = {
      oldId: "oldId",
      nested: { ref: "oldId" },
    };
    remapIdsInPlace(obj, "oldId", "newId");
    expect(obj.newId).toBe("newId");
    expect(obj.nested.ref).toBe("newId");

    const arr = ["oldId", { ref: "oldId" }];
    remapIdsInPlace(arr, "oldId", "newId");
    expect(arr[1].ref).toBe("newId");
  });

  test("replaceSlotWithChild logs unexpected positions without throwing", () => {
    const parent = {
      sectionIds: ["placeholder"],
      sections: { placeholder: { config: {} } },
      config: {},
    };
    const child = { id: "child", config: {} };

    replaceSlotWithChild({ parent, placeholderId: "placeholder", position: 5 }, child);
    expect(parent.sectionIds.includes("child")).toBe(true);
  });

  test("removeSlot covers missing metadata and success removal", () => {
    removeSlot({ parent: { sectionIds: null }, placeholderId: "placeholder", position: 0 });

    const parent = {
      sectionIds: ["placeholder", "keep"],
      sections: { placeholder: {}, keep: {} },
      config: {
        gridSettings: {
          desktop: ["placeholder", "keep"],
        },
      },
    };
    removeSlot({ parent, placeholderId: "placeholder", position: 0 });
    expect(parent.sectionIds).toEqual(["keep"]);
    expect(parent.sections.placeholder).toBeUndefined();
  });

  test("collectLayoutSlots recognises layout placeholders", () => {
    const root = {
      sectionIds: ["slot"],
      sections: {
        slot: {
          id: "slot",
          component: "layout-block",
          name: "{{ list.0 }}",
        },
      },
    };

    const slots = collectLayoutSlots(root);
    expect(slots.has(0)).toBe(true);
    const slot = slots.get(0);
    expect(slot.placeholderId).toBe("slot");
  });
});
