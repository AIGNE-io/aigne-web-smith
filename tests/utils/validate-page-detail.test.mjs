import { describe, expect, test } from "bun:test";
import { validatePageDetail } from "../../utils/utils.mjs";

describe("validatePageDetail", () => {
  test("accepts valid YAML input", () => {
    const yamlContent = `
meta:
  title: "Test Title"
  description: "Test Description"
sections:
  - sectionName: "Intro"
    sectionSummary: "Overview"
`;

    const result = validatePageDetail({ pageDetailYaml: yamlContent });

    expect(result.isValid).toBe(true);
    expect(result.parsedData.meta.title).toBe("Test Title");
    expect(result.parsedData.sections[0].sectionName).toBe("Intro");
  });

  test("accepts valid JSON input", () => {
    const jsonContent = JSON.stringify({
      meta: {
        title: "JSON Title",
        description: "JSON Description",
      },
      sections: [
        {
          sectionName: "Section from JSON",
          sectionSummary: "JSON summary",
        },
      ],
    });

    const result = validatePageDetail({ pageDetailYaml: jsonContent });

    expect(result.isValid).toBe(true);
    expect(result.parsedData.meta.description).toBe("JSON Description");
  });

  test("collects structural errors for missing meta and invalid sections", () => {
    const invalidContent = `
sections: invalid
`;

    const result = validatePageDetail({ pageDetailYaml: invalidContent });

    expect(result.isValid).toBe(false);
    expect(result.errorCount).toBe(2);
    const errorCodes = result.errors.map((error) => error.code);
    expect(errorCodes).toContain("MISSING_META");
    expect(errorCodes).toContain("INVALID_SECTIONS_TYPE");
    expect(result.validationFeedback).toContain("Found 2 validation errors");
  });

  test("reports field-level issues from schema validation", () => {
    const invalidContent = `
meta: {}
sections:
  - {}
`;

    const result = validatePageDetail({ pageDetailYaml: invalidContent });

    expect(result.isValid).toBe(false);
    const errorPaths = result.errors.map((error) => error.path);
    expect(errorPaths).toContain("meta.title");
    expect(errorPaths).toContain("meta.description");
    expect(errorPaths).toContain("sections.0.sectionName");
    expect(result.errorCount).toBe(3);
  });

  test("rejects top-level arrays by default", () => {
    const arrayContent = `
- meta:
    title: "Array Title"
    description: "Array Desc"
  sections:
    - sectionName: "Intro"
`;

    const result = validatePageDetail({ pageDetailYaml: arrayContent });

    expect(result.isValid).toBe(false);
    expect(result.errors[0].code).toBe("ARRAY_ROOT_NOT_ALLOWED");
  });

  test("accepts top-level arrays when allowArrayFallback is true", () => {
    const arrayContent = `
- meta:
    title: "Array Title"
    description: "Array Desc"
  sections:
    - sectionName: "Intro"
`;

    const result = validatePageDetail({
      pageDetailYaml: arrayContent,
      allowArrayFallback: true,
    });

    expect(result.isValid).toBe(true);
    expect(result.parsedData.meta.title).toBe("Array Title");
    expect(result.normalizedFromArray).toBe(true);
    expect(result.normalizedContent).toContain("meta:");
  });

  test("fails when array first element is invalid", () => {
    const arrayContent = `
- {}
`;

    const result = validatePageDetail({
      pageDetailYaml: arrayContent,
      allowArrayFallback: true,
    });

    expect(result.isValid).toBe(false);
    const codes = result.errors.map((error) => error.code);
    expect(codes).toContain("MISSING_META");
    expect(codes).toContain("MISSING_SECTIONS");
  });
});
