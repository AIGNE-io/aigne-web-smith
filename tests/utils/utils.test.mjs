import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizePath, toRelativePath, validatePath, detectSystemLanguage } from "../../utils/utils.mjs";
import { generateSlug } from "../../utils/pages-kit-utils.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("WebSmith Utils", () => {
  let testDir;
  let originalCwd;

  beforeEach(async () => {
    // Create isolated test directory
    testDir = join(__dirname, "test-utils");
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
    test("should generate basic slug from title", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    test("should handle special characters", () => {
      expect(generateSlug("Hello, World! & More")).toBe("hello-world-more");
    });

    test("should handle Chinese characters", () => {
      expect(generateSlug("关于我们")).toBe(""); // Chinese chars are removed by current implementation
    });

    test("should handle mixed languages", () => {
      expect(generateSlug("About 关于")).toBe("about"); // Only English preserved
    });

    test("should handle numbers", () => {
      expect(generateSlug("Version 2.0 Release")).toBe("version-20-release"); // Dots removed
    });

    test("should handle empty string", () => {
      expect(generateSlug("")).toBe("");
    });
  });

  describe("normalizePath", () => {
    test("should normalize file paths", () => {
      const result = normalizePath("./test/path");
      expect(typeof result).toBe("string");
      expect(result).toContain("test/path");
    });
  });

  describe("toRelativePath", () => {
    test("should convert paths to relative format", () => {
      const result = toRelativePath("/absolute/path");
      expect(typeof result).toBe("string");
      expect(result).toContain("path");
    });
  });

  describe("validatePath", () => {
    test("should return validation result object", () => {
      const result = validatePath("/valid/path");
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("isValid");
      
      const emptyResult = validatePath("");
      expect(emptyResult.isValid).toBe(true); // Empty path is considered valid
    });
  });

  describe("detectSystemLanguage", () => {
    test("should detect system language", () => {
      const lang = detectSystemLanguage();
      expect(typeof lang).toBe("string");
      expect(lang.length).toBeGreaterThan(0);
    });
  });
});

describe("File System Utils", () => {
  let testDir;
  let tempDir;
  let originalCwd;

  beforeEach(async () => {
    // Create test directory structure
    testDir = join(__dirname, "test-filesystem");
    tempDir = join(testDir, "temp");
    
    await mkdir(testDir, { recursive: true });
    await mkdir(tempDir, { recursive: true });

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

  test("should handle directory creation and cleanup", async () => {
    const testPath = join(testDir, "nested", "deep", "path");
    await mkdir(testPath, { recursive: true });

    // Create a test file
    await writeFile(join(testPath, "test.txt"), "test content");

    // Clean up
    await rm(join(testDir, "nested"), { recursive: true, force: true });

    // Should handle non-existent paths gracefully
    await rm(join(testDir, "non-existent"), { recursive: true, force: true });
  });

  test("should handle file operations", async () => {
    const testFile = join(testDir, "test-file.txt");
    const content = "Hello, WebSmith!";

    // Write file
    await writeFile(testFile, content);

    // Read file back
    const fs = await import("node:fs/promises");
    const readContent = await fs.readFile(testFile, "utf8");
    expect(readContent).toBe(content);
  });
});