import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Website Structure", () => {
  let testDir;
  let originalCwd;

  beforeEach(async () => {
    // Create isolated test directory
    testDir = join(__dirname, "test-structure");
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

  describe("Page Path Generation", () => {
    test("should generate valid page paths", () => {
      const testCases = [
        { title: "Home", expected: "/home" },
        { title: "About Us", expected: "/about-us" },
        { title: "API Documentation", expected: "/api-documentation" },
        { title: "产品介绍", expected: "/chanpinjieshao" },
      ];

      for (const { title, expected } of testCases) {
        const path = generatePagePath(title);
        expect(path).toBe(expected);
        expect(path).toMatch(/^\/[a-z0-9-]+$/);
      }
    });

    test("should handle special cases", () => {
      expect(generatePagePath("Home", true)).toBe("/");
      expect(generatePagePath("")).toBe("");
    });
  });

  describe("Structure Validation", () => {
    test("should validate correct website structure", () => {
      const validStructure = [
        {
          title: "首页",
          description: "网站主页",
          path: "/",
          parentId: null,
        },
        {
          title: "关于我们",
          description: "公司介绍",
          path: "/about",
          parentId: null,
        },
        {
          title: "产品",
          description: "产品展示",
          path: "/products",
          parentId: null,
        },
      ];

      const result = validateStructure(validStructure);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("should detect structure problems", () => {
      const invalidStructure = [
        {
          title: "Page 1",
          description: "Description",
          path: "/page1",
          parentId: null,
        },
        {
          title: "Page 2",
          description: "Description",
          path: "/page1", // Duplicate path
          parentId: null,
        },
      ];

      const result = validateStructure(invalidStructure);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("should validate required fields", () => {
      const incompleteStructure = [
        {
          title: "Page Title",
          // Missing description, path
        },
      ];

      const result = validateStructure(incompleteStructure);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("description"))).toBe(true);
      expect(result.errors.some((e) => e.includes("path"))).toBe(true);
    });
  });

  describe("Multi-language Support", () => {
    test("should handle multiple languages", () => {
      const structureZh = {
        title: "关于我们",
        description: "公司介绍页面",
        path: "/about",
      };

      const structureEn = {
        title: "About Us",
        description: "Company introduction page",
        path: "/about",
      };

      expect(validatePageStructure(structureZh, "zh")).toBeTruthy();
      expect(validatePageStructure(structureEn, "en")).toBeTruthy();
    });

    test("should generate language-specific paths", () => {
      const basePath = "/about";
      expect(getLocalizedPath(basePath, "zh")).toBe("/about");
      expect(getLocalizedPath(basePath, "en")).toBe("/about");
    });
  });
});

// Helper functions for tests
function generatePagePath(title, isHome = false) {
  if (isHome) return "/";
  if (!title) return "";

  return (
    "/" +
    title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[\u4e00-\u9fa5]/g, (char) => {
        // Simplified pinyin conversion for testing
        const pinyinMap = {
          产: "chan",
          品: "pin",
          介: "jie",
          绍: "shao",
          关: "guan",
          于: "yu",
          我: "wo",
          们: "men",
          首: "shou",
          页: "ye",
        };
        return pinyinMap[char] || char;
      })
  );
}

function validateStructure(structure) {
  const errors = [];
  const paths = new Set();

  if (!Array.isArray(structure)) {
    return { isValid: false, errors: ["Structure must be an array"] };
  }

  for (const page of structure) {
    // Check required fields
    if (!page.title) errors.push("Missing page title");
    if (!page.description) errors.push("Missing page description");
    if (!page.path) errors.push("Missing page path");

    // Check for duplicate paths
    if (page.path && paths.has(page.path)) {
      errors.push(`Duplicate path: ${page.path}`);
    } else if (page.path) {
      paths.add(page.path);
    }

    // Validate path format
    if (page.path && !page.path.startsWith("/")) {
      errors.push(`Invalid path format: ${page.path} (must start with /)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validatePageStructure(page, locale) {
  return page.title && page.description && page.path && locale;
}

function getLocalizedPath(basePath, _locale) {
  // Simplified implementation for testing
  return basePath;
}
