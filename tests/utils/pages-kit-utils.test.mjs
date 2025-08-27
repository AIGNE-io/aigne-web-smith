import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateDefaultComponentData,
  generateSlug,
  optimizeMetaData,
  validateComponentData,
  validatePageYaml,
} from "../../utils/pages-kit-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Pages Kit Utils", () => {
  let testDir;
  let originalCwd;

  beforeEach(async () => {
    // Create isolated test directory
    testDir = join(__dirname, "test-pages-kit");
    await mkdir(testDir, { recursive: true });

    // Change to test directory
    originalCwd = process.cwd();
    process.chdir(testDir);
  });

  afterEach(async () => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  describe("generateSlug", () => {
    test("should generate SEO-friendly slugs", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("API Documentation")).toBe("api-documentation");
      expect(generateSlug("Getting Started Guide")).toBe("getting-started-guide");
    });

    test("should handle special characters", () => {
      expect(generateSlug("React & Vue Comparison")).toBe("react-vue-comparison");
      expect(generateSlug("FAQ: Common Questions")).toBe("faq-common-questions");
      expect(generateSlug("v2.0 Release Notes")).toBe("v20-release-notes");
    });

    test("should handle Chinese characters", () => {
      expect(generateSlug("产品介绍")).toBe(""); // Chinese removed by current implementation
      expect(generateSlug("关于我们")).toBe(""); // Chinese removed by current implementation
    });

    test("should handle edge cases", () => {
      expect(generateSlug("")).toBe("");
      expect(generateSlug("   ")).toBe("");
      expect(generateSlug("!!!@@@###")).toBe("");
    });
  });

  describe("optimizeMetaData", () => {
    test("should optimize basic meta data", () => {
      const input = {
        title: "My Page Title",
        description: "This is a page description",
      };

      const result = optimizeMetaData(input);
      expect(result.title).toBe("My Page Title");
      expect(result.description).toBe("This is a page description");
    });

    test("should truncate long titles", () => {
      const longTitle = "A".repeat(70);
      const input = { title: longTitle };

      const result = optimizeMetaData(input);
      expect(result.title.length).toBeLessThanOrEqual(60);
      expect(result.title).toContain("...");
    });

    test("should truncate long descriptions", () => {
      const longDesc = "A".repeat(200);
      const input = { description: longDesc };

      const result = optimizeMetaData(input);
      expect(result.description.length).toBeLessThanOrEqual(160);
      expect(result.description).toContain("...");
    });

    test("should handle missing data gracefully", () => {
      const result = optimizeMetaData({});
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });
  });

  describe("validatePageYaml", () => {
    test("should return validation result", () => {
      const result = validatePageYaml({ title: "Test" });
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe("boolean");
    });

    test("should handle empty input", () => {
      const result = validatePageYaml(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateComponentData", () => {
    test("should return validation result", () => {
      const result = validateComponentData("test", {}, {});
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe("boolean");
    });
  });

  describe("generateDefaultComponentData", () => {
    test("should return object", () => {
      const result = generateDefaultComponentData("test", { properties: [] });
      expect(typeof result).toBe("object");
    });

    test("should handle null input", () => {
      expect(generateDefaultComponentData("test", null)).toEqual({});
    });
  });
});
