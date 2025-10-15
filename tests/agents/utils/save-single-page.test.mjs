import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { parse as yamlParse, stringify as yamlStringify } from "yaml";
import saveSinglePage from "../../../agents/utils/save-single-page.mjs";
import * as utilsModule from "../../../utils/utils.mjs";

const validYaml = `
meta:
  title: "Test"
  description: "Desc"
sections:
  - sectionName: "Intro"
`;

describe("saveSinglePage", () => {
  let savePageWithTranslationsSpy;

  beforeEach(() => {
    savePageWithTranslationsSpy = spyOn(utilsModule, "savePageWithTranslations").mockResolvedValue(
      [],
    );
  });

  afterEach(() => {
    savePageWithTranslationsSpy?.mockRestore();
  });

  test("saves when page detail content passes validation", async () => {
    const result = await saveSinglePage({
      path: "/home",
      content: validYaml,
      pagesDir: "./pages",
      tmpDir: "./tmp",
      translates: [],
      locale: "en",
      title: "Test",
      description: "Desc",
      sourceIds: [],
      parentId: null,
    });

    expect(savePageWithTranslationsSpy).toHaveBeenCalledWith(
      expect.objectContaining({ content: validYaml }),
    );
    expect(result.content).toBe(validYaml);
  });

  test("extracts first array item when validation fails but array content provided", async () => {
    const arrayContent = `
- meta:
    title: "Array Title"
    description: "Array Desc"
  sections:
    - sectionName: "Intro"
`;
    const expectedContent = yamlStringify(yamlParse(arrayContent)[0]).trimEnd();

    const result = await saveSinglePage({
      path: "/array",
      content: arrayContent,
      pagesDir: "./pages",
      tmpDir: "./tmp",
      translates: [],
      locale: "en",
      title: "Array Title",
      description: "Array Desc",
      sourceIds: [],
      parentId: null,
      throwErrorIfInvalid: true,
    });

    expect(savePageWithTranslationsSpy).toHaveBeenCalledWith(
      expect.objectContaining({ content: expectedContent }),
    );
    expect(result.content).toBe(expectedContent);
  });

  test("throws when validation fails and cannot be recovered", async () => {
    await expect(
      saveSinglePage({
        path: "/invalid",
        content: "not valid",
        pagesDir: "./pages",
        tmpDir: "./tmp",
        translates: [],
        locale: "en",
        title: "Invalid",
        description: "Invalid",
        sourceIds: [],
        parentId: null,
        throwErrorIfInvalid: true,
      }),
    ).rejects.toThrow("Found");

    expect(savePageWithTranslationsSpy).not.toHaveBeenCalled();
  });
});
