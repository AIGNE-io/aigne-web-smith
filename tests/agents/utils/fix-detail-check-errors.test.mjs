import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import * as checkDetailResultModule from "../../../agents/utils/check-detail-result.mjs";
import fixDetailCheckErrors from "../../../agents/utils/fix-detail-check-errors.mjs";
import * as sectionFixUtils from "../../../utils/section-fix-utils.mjs";

const sampleComponentLibrary = [
  {
    type: "composite",
    name: "hero",
    fieldCombinations: ["heroTitle", "heroDescription"],
  },
  {
    type: "composite",
    name: "heroCta",
    fieldCombinations: ["heroTitle", "heroDescription", "heroCta.text", "heroCta.link"],
  },
];

const validYaml = `meta:
  title: "Test Page"
  description: "Test Description"
sections:
  - componentName: hero
    heroTitle: "Welcome"
    heroDescription: "This is a hero section"`;

const yamlWithExtraField = `meta:
  title: "Test Page"
  description: "Test Description"
sections:
  - componentName: hero
    heroTitle: "Welcome"
    heroDescription: "This is a hero section"
    extraField: "Should be removed"`;

const yamlWithMissingField = `meta:
  title: "Test Page"
  description: "Test Description"
sections:
  - componentName: hero
    heroTitle: "Welcome"`;

describe("fixDetailCheckErrors", () => {
  let mockContext;
  let mockOptions;
  let checkDetailResultSpy;

  beforeEach(() => {
    // Mock context with agent invocation
    mockContext = {
      invoke: mock(async (_agent, _input) => {
        return {
          fixedSection: `componentName: hero
heroTitle: "Fixed Title"
heroDescription: "Fixed Description"`,
        };
      }),
      agents: {
        sectionErrorFixer: "sectionErrorFixer",
      },
    };

    mockOptions = {
      context: mockContext,
    };

    // Spy on checkDetailResult
    checkDetailResultSpy = spyOn(checkDetailResultModule, "default").mockResolvedValue({
      isApproved: true,
      detailFeedback: "",
      errors: [],
    });
  });

  afterEach(() => {
    checkDetailResultSpy?.mockRestore();
  });

  describe("Already approved scenarios", () => {
    test("returns immediately if already approved", async () => {
      const input = {
        websiteStructure: [],
        reviewContent: validYaml,
        isApproved: true,
        detailFeedback: "Looks good",
        errors: [],
        locale: "en",
        componentLibrary: sampleComponentLibrary,
      };

      const result = await fixDetailCheckErrors(input, mockOptions);

      expect(result.isApproved).toBe(true);
      expect(result.reviewContent).toBe(validYaml);
      expect(result.fixAttempts).toEqual([]);
      expect(result.unfixableErrors).toEqual([]);
      expect(result.remainingErrors).toEqual([]);
      expect(mockContext.invoke).not.toHaveBeenCalled();
    });
  });

  describe("YAML parsing errors", () => {
    test("returns YAML_SYNTAX_ERROR for invalid YAML", async () => {
      const invalidYaml = "this is: not: valid: yaml: [[[";

      const input = {
        websiteStructure: [],
        reviewContent: invalidYaml,
        isApproved: false,
        detailFeedback: "",
        errors: [{ code: "YAML_SYNTAX_ERROR", message: "Invalid YAML" }],
        locale: "en",
        componentLibrary: sampleComponentLibrary,
      };

      const result = await fixDetailCheckErrors(input, mockOptions);

      expect(result.isApproved).toBe(false);
      expect(result.reviewContent).toBe(invalidYaml);
      expect(result.fixAttempts).toEqual([]);
      expect(result.unfixableErrors).toHaveLength(1);
      expect(result.unfixableErrors[0].code).toBe("YAML_SYNTAX_ERROR");
      expect(mockContext.invoke).not.toHaveBeenCalled();
    });
  });

  describe("Unfixable errors", () => {
    test("classifies unfixable errors and does not attempt fix", async () => {
      const input = {
        websiteStructure: [],
        reviewContent: validYaml,
        isApproved: false,
        detailFeedback: "",
        errors: [
          { code: "YAML_SYNTAX_ERROR", message: "Syntax error" },
          { code: "INVALID_INPUT_TYPE", message: "Invalid input" },
          { code: "MISSING_META", message: "Missing meta" },
        ],
        locale: "en",
        componentLibrary: sampleComponentLibrary,
      };

      const result = await fixDetailCheckErrors(input, mockOptions);

      expect(result.isApproved).toBe(false);
      expect(result.fixAttempts).toEqual([]);
      expect(result.unfixableErrors).toHaveLength(3);
      expect(result.remainingErrors).toHaveLength(3);
      expect(mockContext.invoke).not.toHaveBeenCalled();
    });

    test("separates fixable from unfixable errors", async () => {
      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      const input = {
        websiteStructure: [],
        reviewContent: yamlWithExtraField,
        isApproved: false,
        detailFeedback: "",
        errors: [
          { code: "MISSING_META", message: "Missing meta", path: "meta" },
          {
            code: "UNKNOWN_FIELD_COMBINATION",
            message: "Extra field",
            path: "sections.0",
            details: { extraFields: ["extraField"], missingFields: [] },
          },
        ],
        locale: "en",
        componentLibrary: sampleComponentLibrary,
      };

      const result = await fixDetailCheckErrors(input, mockOptions);

      expect(result.unfixableErrors).toHaveLength(1);
      expect(result.unfixableErrors[0].code).toBe("MISSING_META");
      expect(result.fixAttempts.length).toBeGreaterThan(0);
    });
  });

  describe("Auto-fix scenarios", () => {
    test("auto-fixes section by removing extra fields", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Welcome",
          heroDescription: "This is a hero section",
        },
        action: "Removed extra fields: extraField",
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: yamlWithExtraField,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result.fixAttempts).toHaveLength(1);
        expect(result.fixAttempts[0].success).toBe(true);
        expect(result.fixAttempts[0].method).toBe("auto");
        expect(result.fixAttempts[0].sectionPath).toBe("sections.0");
        expect(mockContext.invoke).not.toHaveBeenCalled();
      } finally {
        tryAutoFixSpy.mockRestore();
      }
    });

    test("auto-fixes section by adding missing fields", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Welcome",
          heroDescription: "",
        },
        action: "Added missing fields: heroDescription",
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: yamlWithMissingField,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Missing field",
              path: "sections.0",
              details: { extraFields: [], missingFields: ["heroDescription"] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result.fixAttempts).toHaveLength(1);
        expect(result.fixAttempts[0].success).toBe(true);
        expect(result.fixAttempts[0].method).toBe("auto");
        expect(mockContext.invoke).not.toHaveBeenCalled();
      } finally {
        tryAutoFixSpy.mockRestore();
      }
    });
  });

  describe("AI agent fix scenarios", () => {
    test("calls AI agent when auto-fix cannot handle error", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue(null);
      const validateFixedSpy = spyOn(sectionFixUtils, "validateFixedSection").mockReturnValue({
        isValid: true,
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "INVALID_INTERNAL_LINK",
              message: "Invalid link",
              path: "sections.0",
              details: { invalidLink: "link://bad" },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(mockContext.invoke).toHaveBeenCalledWith(
          mockContext.agents.sectionErrorFixer,
          expect.objectContaining({
            sectionPath: "sections.0",
            sectionIndex: 0,
            componentName: "hero",
          }),
        );
        expect(result.fixAttempts).toHaveLength(1);
        expect(result.fixAttempts[0].success).toBe(true);
        expect(result.fixAttempts[0].method).toBe("ai");
      } finally {
        tryAutoFixSpy.mockRestore();
        validateFixedSpy.mockRestore();
      }
    });

    test("handles AI agent fix validation failure", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue(null);
      const validateFixedSpy = spyOn(sectionFixUtils, "validateFixedSection").mockReturnValue({
        isValid: false,
        validationFeedback: "Still has errors",
        errors: [{ code: "INVALID_FIELD", message: "Invalid field" }],
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "Validation failed",
        errors: [{ code: "INVALID_FIELD", message: "Invalid field" }],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "INVALID_INTERNAL_LINK",
              message: "Invalid link",
              path: "sections.0",
              details: { invalidLink: "link://bad" },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result.fixAttempts).toHaveLength(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toContain("Validation failed after fix");
        expect(result.fixAttempts[0].newErrors).toHaveLength(1);
      } finally {
        tryAutoFixSpy.mockRestore();
        validateFixedSpy.mockRestore();
      }
    });

    test("handles AI agent invocation error", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue(null);

      mockContext.invoke = mock(async () => {
        throw new Error("AI Agent failed");
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "Agent failed",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "INVALID_INTERNAL_LINK",
              message: "Invalid link",
              path: "sections.0",
              details: { invalidLink: "link://bad" },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // Should retry up to MAX_RETRIES (3) times, so expect 3 attempts
        expect(result.fixAttempts.length).toBeGreaterThanOrEqual(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toContain("AI Agent error - AI Agent failed");
      } finally {
        tryAutoFixSpy.mockRestore();
      }
    });
  });

  describe("Section not found scenarios", () => {
    test("handles section not found error", async () => {
      const getSectionSpy = spyOn(sectionFixUtils, "getSectionByPath").mockReturnValue(null);

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.10",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // May retry, so check first attempt
        expect(result.fixAttempts.length).toBeGreaterThanOrEqual(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toBe("Failed: Section not found");
      } finally {
        getSectionSpy.mockRestore();
      }
    });

    test("handles cannot determine componentName", async () => {
      const extractComponentSpy = spyOn(sectionFixUtils, "extractComponentName").mockReturnValue(
        null,
      );

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // May retry, so check first attempt
        expect(result.fixAttempts.length).toBeGreaterThanOrEqual(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toBe("Failed: Cannot determine componentName");
      } finally {
        extractComponentSpy.mockRestore();
      }
    });

    test("handles component not found in library", async () => {
      const getRequiredFieldsSpy = spyOn(
        sectionFixUtils,
        "getRequiredFieldsByComponentName",
      ).mockReturnValue(null);

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // May retry, so check first attempt
        expect(result.fixAttempts.length).toBeGreaterThanOrEqual(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toContain("Component");
        expect(result.fixAttempts[0].result).toContain("not found in library");
      } finally {
        getRequiredFieldsSpy.mockRestore();
      }
    });
  });

  describe("Retry logic", () => {
    test("does not retry when validation fails (not added to failedSections)", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue(null);

      const validateFixedSpy = spyOn(sectionFixUtils, "validateFixedSection").mockReturnValue({
        isValid: false,
        validationFeedback: "Validation failed",
        errors: [{ code: "VALIDATION_ERROR" }],
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "Still has errors",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "INVALID_INTERNAL_LINK",
              message: "Invalid link",
              path: "sections.0",
              details: { invalidLink: "link://bad" },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // Validation failure does not retry, only records failure once
        expect(result.fixAttempts.length).toBe(1);
        expect(result.fixAttempts[0].retry).toBe(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[0].result).toContain("Validation failed after fix");
        // AI agent should have been called only once
        expect(mockContext.invoke).toHaveBeenCalledTimes(1);
      } finally {
        tryAutoFixSpy.mockRestore();
        validateFixedSpy.mockRestore();
      }
    });

    test("retries when AI agent throws error", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue(null);

      let aiCallCount = 0;
      mockContext.invoke = mock(async () => {
        aiCallCount++;
        if (aiCallCount < 3) {
          throw new Error("AI Agent error");
        }
        return {
          fixedSection: `componentName: hero
heroTitle: "Fixed"
heroDescription: "Fixed Description"`,
        };
      });

      const validateFixedSpy = spyOn(sectionFixUtils, "validateFixedSection").mockReturnValue({
        isValid: true,
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: validYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "INVALID_INTERNAL_LINK",
              message: "Invalid link",
              path: "sections.0",
              details: { invalidLink: "link://bad" },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        // Should retry on AI agent error (3 attempts total)
        expect(result.fixAttempts.length).toBe(3);
        expect(result.fixAttempts[0].retry).toBe(1);
        expect(result.fixAttempts[0].success).toBe(false);
        expect(result.fixAttempts[1].retry).toBe(2);
        expect(result.fixAttempts[1].success).toBe(false);
        expect(result.fixAttempts[2].retry).toBe(3);
        expect(result.fixAttempts[2].success).toBe(true);
        // AI agent should have been called 3 times
        expect(mockContext.invoke).toHaveBeenCalledTimes(3);
      } finally {
        tryAutoFixSpy.mockRestore();
        validateFixedSpy.mockRestore();
      }
    });
  });

  describe("Multiple sections with errors", () => {
    test("fixes multiple sections with different errors", async () => {
      const multiSectionYaml = `meta:
  title: "Test Page"
  description: "Test Description"
sections:
  - componentName: hero
    heroTitle: "Section 1"
    heroDescription: "Description 1"
    extraField1: "Remove"
  - componentName: hero
    heroTitle: "Section 2"
    heroDescription: "Description 2"
    extraField2: "Remove"`;

      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Fixed",
          heroDescription: "Fixed",
        },
        action: "Removed extra fields",
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: multiSectionYaml,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField1"], missingFields: [] },
            },
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.1",
              details: { extraFields: ["extraField2"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result.fixAttempts).toHaveLength(2);
        expect(result.fixAttempts[0].sectionPath).toBe("sections.0");
        expect(result.fixAttempts[1].sectionPath).toBe("sections.1");
        expect(result.fixAttempts[0].success).toBe(true);
        expect(result.fixAttempts[1].success).toBe(true);
      } finally {
        tryAutoFixSpy.mockRestore();
      }
    });
  });

  describe("Final validation", () => {
    test("performs final validation after fixes", async () => {
      // Import the actual checkDetailResult to spy on it properly
      const checkDetailResultModule = await import("../../../agents/utils/check-detail-result.mjs");
      const finalCheckSpy = spyOn(checkDetailResultModule, "default").mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Fixed",
          heroDescription: "Fixed",
        },
        action: "Removed extra fields",
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: yamlWithExtraField,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(finalCheckSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            reviewContent: expect.any(String),
            componentLibrary: sampleComponentLibrary,
            locale: "en",
          }),
          mockOptions,
        );
        expect(result.isApproved).toBe(true);
      } finally {
        tryAutoFixSpy.mockRestore();
        finalCheckSpy.mockRestore();
      }
    });

    test("includes global errors in remaining errors", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Fixed",
          heroDescription: "Fixed",
        },
        action: "Removed extra fields",
      });

      const groupErrorsSpy = spyOn(sectionFixUtils, "groupErrorsBySection").mockReturnValue({
        grouped: new Map([
          [
            "sections.0",
            [
              {
                code: "UNKNOWN_FIELD_COMBINATION",
                path: "sections.0",
                details: { extraFields: ["extraField"], missingFields: [] },
              },
            ],
          ],
        ]),
        globalErrors: [{ code: "GLOBAL_ERROR", message: "Global error", path: "title" }],
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: false,
        detailFeedback: "Has global errors",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: yamlWithExtraField,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
            { code: "GLOBAL_ERROR", message: "Global error", path: "title" },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result.remainingErrors.some((e) => e.code === "GLOBAL_ERROR")).toBe(true);
      } finally {
        tryAutoFixSpy.mockRestore();
        groupErrorsSpy.mockRestore();
      }
    });
  });

  describe("Output format", () => {
    test("returns correct output structure with all fields", async () => {
      const input = {
        websiteStructure: [],
        reviewContent: validYaml,
        isApproved: true,
        detailFeedback: "Approved",
        errors: [],
        locale: "en",
        componentLibrary: sampleComponentLibrary,
      };

      const result = await fixDetailCheckErrors(input, mockOptions);

      expect(result).toHaveProperty("isApproved");
      expect(result).toHaveProperty("reviewContent");
      expect(result).toHaveProperty("fixAttempts");
      expect(result).toHaveProperty("unfixableErrors");
      expect(result).toHaveProperty("remainingErrors");
      expect(result).toHaveProperty("detailFeedback");
    });

    test("includes content field in output after fixing", async () => {
      const tryAutoFixSpy = spyOn(sectionFixUtils, "tryAutoFixSection").mockReturnValue({
        fixed: true,
        section: {
          componentName: "hero",
          heroTitle: "Fixed",
          heroDescription: "Fixed",
        },
        action: "Removed extra fields",
      });

      checkDetailResultSpy.mockResolvedValue({
        isApproved: true,
        detailFeedback: "",
        errors: [],
      });

      try {
        const input = {
          websiteStructure: [],
          reviewContent: yamlWithExtraField,
          isApproved: false,
          detailFeedback: "",
          errors: [
            {
              code: "UNKNOWN_FIELD_COMBINATION",
              message: "Extra field",
              path: "sections.0",
              details: { extraFields: ["extraField"], missingFields: [] },
            },
          ],
          locale: "en",
          componentLibrary: sampleComponentLibrary,
        };

        const result = await fixDetailCheckErrors(input, mockOptions);

        expect(result).toHaveProperty("content");
        expect(result.content).toBeDefined();
        expect(typeof result.content).toBe("string");
      } finally {
        tryAutoFixSpy.mockRestore();
      }
    });
  });
});
