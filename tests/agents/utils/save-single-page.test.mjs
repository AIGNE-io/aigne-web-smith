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

  test("logs validation feedback and still saves when throwErrorIfInvalid is false", async () => {
    const errorSpy = spyOn(console, "error").mockImplementation(() => {});
    const validationSpy = spyOn(utilsModule, "validatePageDetail").mockReturnValue({
      isValid: false,
      validationFeedback: "Missing meta",
      errors: [{ field: "meta" }],
    });

    try {
      const content = "invalid yaml";
      const result = await saveSinglePage({
        path: "/invalid-but-allowed",
        content,
        pagesDir: "./pages",
        tmpDir: "./tmp",
        translates: [],
        locale: "en",
        title: "Invalid Allowed",
        description: "Invalid Allowed",
        sourceIds: [],
        parentId: null,
        throwErrorIfInvalid: false,
      });

      expect(errorSpy).toHaveBeenCalledWith("⚠️ Page Detail Validation Failed: Missing meta");
      expect(savePageWithTranslationsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ content }),
      );
      expect(result.path).toBe("/invalid-but-allowed");
    } finally {
      validationSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  test("returns success message when isShowMessage is enabled for main locale", async () => {
    const validationSpy = spyOn(utilsModule, "validatePageDetail").mockReturnValue({
      isValid: true,
    });

    try {
      const result = await saveSinglePage({
        path: "/message",
        content: validYaml,
        pagesDir: "./pages",
        tmpDir: "./tmp",
        translates: [],
        locale: "en",
        title: "Message",
        description: "Message",
        sourceIds: [],
        parentId: null,
        isShowMessage: true,
      });

      expect(savePageWithTranslationsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ path: "/message" }),
      );
      expect(result).toEqual({ message: "✅ Page updated successfully" });
    } finally {
      validationSpy.mockRestore();
    }
  });

  test("returns translation completion message for translation saves", async () => {
    const validationSpy = spyOn(utilsModule, "validatePageDetail").mockReturnValue({
      isValid: true,
    });

    try {
      const result = await saveSinglePage({
        path: "/message-translation",
        content: validYaml,
        pagesDir: "./pages",
        tmpDir: "./tmp",
        translates: [],
        locale: "en",
        title: "Message Translation",
        description: "Message Translation",
        sourceIds: [],
        parentId: null,
        isShowMessage: true,
        isTranslate: true,
      });

      expect(savePageWithTranslationsSpy).toHaveBeenCalledWith(
        expect.objectContaining({ path: "/message-translation" }),
      );
      expect(result).toEqual({ message: "✅ Translation completed successfully" });
    } finally {
      validationSpy.mockRestore();
    }
  });
});
