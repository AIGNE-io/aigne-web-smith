import { describe, expect, test } from "bun:test";
import { validatePageDetail } from "../../utils/utils.mjs";

const sampleComponentLibrary = [
  {
    type: "composite",
    name: "Hero",
    fieldCombinations: ["heroTitle", "heroDescription"],
  },
  {
    type: "composite",
    name: "HeroWithCta",
    fieldCombinations: ["heroTitle", "heroDescription", "heroCta.text", "heroCta.url"],
  },
  {
    type: "composite",
    name: "ListSection",
    fieldCombinations: ["list.0", "list.1"],
  },
  {
    type: "composite",
    name: "FAQs",
    fieldCombinations: [
      "faqTitle",
      "faqList.0.question",
      "faqList.0.answer",
      "faqList.1.question",
      "faqList.1.answer",
      "faqList.2.question",
      "faqList.2.answer",
      "faqList.3.question",
      "faqList.3.answer",
      "faqList.4.question",
      "faqList.4.answer",
      "faqList.5.question",
      "faqList.5.answer",
      "faqList.6.question",
      "faqList.6.answer",
      "faqList.7.question",
      "faqList.7.answer",
      "faqList.8.question",
      "faqList.8.answer",
      "faqList.9.question",
      "faqList.9.answer",
    ],
  },
  {
    type: "composite",
    name: "ArcBlockArchitectHero",
    fieldCombinations: ["architectDescription", "architectList", "architectTitle", "moreText"],
  },
];

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
    expect(result.validationFeedback).toContain("Validation failed");
    expect(result.validationFeedback).toContain("2");
    expect(result.validationFeedback).toContain("issues");
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

  test("validates section fields against component library", () => {
    const yamlContent = `
meta:
  title: "Hero"
  description: "Page"
sections:
  - sectionName: "Hero"
    sectionSummary: "Main hero"
    heroTitle: "Welcome"
    heroDescription: "Discover more"
`;

    const result = validatePageDetail({
      pageDetailYaml: yamlContent,
      componentLibrary: sampleComponentLibrary,
    });

    expect(result.isValid).toBe(true);
  });

  test("allows shorter list instances when template provides superset indices", () => {
    const yamlContent = `
meta:
  title: "List"
  description: "Page"
sections:
  - sectionName: "Logos"
    sectionSummary: "Logo list"
    list:
      - sectionName: "LogoItem"
        sectionSummary: "Item"
`;

    const result = validatePageDetail({
      pageDetailYaml: yamlContent,
      componentLibrary: sampleComponentLibrary,
    });

    expect(result.isValid).toBe(true);
  });

  test("allows shorter indexed object arrays when template expects more entries", () => {
    const yamlContent = `
meta:
  title: "FAQ"
  description: "Questions"
sections:
  - sectionName: "FAQSection"
    sectionSummary: "FAQs"
    faqTitle: "Common Questions"
    faqList:
      - question: "What is A?"
        answer: "Answer A"
      - question: "What is B?"
        answer: "Answer B"
`;

    const result = validatePageDetail({
      pageDetailYaml: yamlContent,
      componentLibrary: sampleComponentLibrary,
    });

    expect(result.isValid).toBe(true);
  });

  test("reports error when section fields do not match component library", () => {
    const yamlContent = `
meta:
  title: "Hero"
  description: "Page"
sections:
  - sectionName: "Hero"
    sectionSummary: "Main hero"
    heroTitle: "Welcome"
    unknownField: "unsupported"
`;

    const result = validatePageDetail({
      pageDetailYaml: yamlContent,
      componentLibrary: sampleComponentLibrary,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.some((error) => error.code === "UNKNOWN_FIELD_COMBINATION")).toBe(true);
    expect(result.validationFeedback).toContain("Error Code: UNKNOWN_FIELD_COMBINATION");
    expect(result.validationFeedback).toContain("sections.0");
    expect(result.validationFeedback).toContain("Fix:");
  });

  test("accepts sections when list items expand beyond component base field", () => {
    const yamlContent = `
meta:
  title: "Architect"
  description: "ArcBlock"
sections:
  - sectionName: "ArcBlock Architect Hero"
    sectionSummary: "Team overview"
    architectTitle: "Our Architects"
    architectDescription: "Meet the builders"
    architectList:
      - name: "Alice"
        title: "Lead Architect"
        description: "Focuses on chain services"
        url: "https://example.com/alice"
        list:
          - "Chain"
          - "Node"
      - name: "Bob"
        title: "Co-Architect"
        url: "https://example.com/bob"
        list:
          - "DApp"
          - "Wallet"
    moreText: "See the full team"
`;

    const result = validatePageDetail({
      pageDetailYaml: yamlContent,
      componentLibrary: sampleComponentLibrary,
    });

    expect(result.isValid).toBe(true);
  });
});
