import { describe, expect, test } from "bun:test";
import {
  calculateMiddleFormatHash,
  extractContentFields,
  findBestComponentMatch,
  generateFieldConstraints,
  normalizeFieldList,
} from "../../utils/generate-helper.mjs";

describe("generate-helper coverage", () => {
  test("extractContentFields handles nested objects and list indices", () => {
    const section = {
      sectionName: "Example",
      title: "Primary title",
      details: {
        intro: "Intro text",
      },
      list: [
        {
          sectionName: "Child A",
          feature: "A",
        },
        {
          sectionName: "Child B",
          feature: "B",
          extra: {
            label: "Nested value",
          },
        },
      ],
    };

    const fields = extractContentFields(section).sort();
    expect(fields).toEqual(["details.intro", "list.0", "list.1", "title"]);
  });

  test("normalizeFieldList deduplicates and sorts values", () => {
    const result = normalizeFieldList(["b", "a", "b", "", null, "c"]);
    expect(result).toEqual(["a", "b", "c"]);
  });

  test("findBestComponentMatch prefers exact matches over supersets", () => {
    const components = [
      {
        type: "composite",
        name: "Exact",
        fieldCombinations: ["subtitle", "title"],
      },
      {
        type: "composite",
        name: "Superset",
        fieldCombinations: ["title", "subtitle", "extra"],
      },
    ];
    const result = findBestComponentMatch(["title", "subtitle"], components);
    expect(result?.component.name).toBe("Exact");
    expect(result?.type).toBe("exact");
  });

  test("findBestComponentMatch falls back to superset when exact match missing", () => {
    const components = [
      {
        type: "composite",
        name: "SupersetOnly",
        fieldCombinations: ["title", "subtitle", "extra"],
      },
    ];
    const result = findBestComponentMatch(["title", "subtitle"], components);
    expect(result?.component.name).toBe("SupersetOnly");
    expect(result?.type).toBe("superset");
    expect(result?.penalty).toBe(1);
  });

  test("calculateMiddleFormatHash changes with different field combinations", () => {
    const baseFiles = [
      {
        content: {
          sections: [
            { sectionName: "Hero", title: "A", description: "B" },
            { sectionName: "CTA", button: "Join" },
          ],
        },
      },
    ];
    const modifiedFiles = [
      {
        content: {
          sections: [
            { sectionName: "Hero", title: "A", description: "B", badge: "New" },
            { sectionName: "CTA", button: "Join" },
          ],
        },
      },
    ];

    const baseHash = calculateMiddleFormatHash(baseFiles);
    const modifiedHash = calculateMiddleFormatHash(modifiedFiles);
    expect(baseHash).not.toBe(modifiedHash);
  });

  test("generateFieldConstraints renders atomic and composite sections", () => {
    const constraints = generateFieldConstraints([
      {
        type: "atomic",
        name: "Media",
        summary: "Display media asset",
      },
      {
        type: "composite",
        name: "Hero",
        summary: "Hero block",
        fieldCombinations: ["title", "subtitle"],
      },
    ]);

    expect(constraints).toContain("<allowed_field_combinations>");
    expect(constraints).toContain('fieldCombinations: \'["title","subtitle"]\'');
    expect(constraints).toContain("List Misuse");
  });
});
