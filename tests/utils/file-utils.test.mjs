import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  findInvalidSourcePaths,
  getPathPrefix,
  isDirExcluded,
  isRemoteFile,
} from "../../utils/file-utils.mjs";

describe("isRemoteFile", () => {
  test("returns true for http:// URLs", () => {
    expect(isRemoteFile("http://example.com")).toBe(true);
    expect(isRemoteFile("http://example.com/path")).toBe(true);
    expect(isRemoteFile("http://example.com:8080")).toBe(true);
  });

  test("returns true for https:// URLs", () => {
    expect(isRemoteFile("https://example.com")).toBe(true);
    expect(isRemoteFile("https://example.com/path/to/resource")).toBe(true);
    expect(isRemoteFile("https://example.com:443")).toBe(true);
  });

  test("returns false for other protocols", () => {
    expect(isRemoteFile("file:///path/to/file")).toBe(false);
    expect(isRemoteFile("mailto:user@example.com")).toBe(false);
    expect(isRemoteFile("ftp://example.com")).toBe(false);
    expect(isRemoteFile("ssh://user@host")).toBe(false);
  });

  test("returns false for invalid URLs", () => {
    expect(isRemoteFile("not-a-url")).toBe(false);
    expect(isRemoteFile("://invalid")).toBe(false);
    expect(isRemoteFile("http://")).toBe(false);
  });

  test("returns false for non-string inputs", () => {
    expect(isRemoteFile(null)).toBe(false);
    expect(isRemoteFile(undefined)).toBe(false);
    expect(isRemoteFile(123)).toBe(false);
    expect(isRemoteFile({})).toBe(false);
    expect(isRemoteFile([])).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isRemoteFile("")).toBe(false);
  });
});

describe("getPathPrefix", () => {
  test("returns path prefix before first glob segment", () => {
    expect(getPathPrefix("src/**/*.js")).toBe("src");
    expect(getPathPrefix("src/components/**/*.tsx")).toBe("src/components");
    expect(getPathPrefix("docs/**/README.md")).toBe("docs");
  });

  test("returns '.' for path starting with glob", () => {
    expect(getPathPrefix("**/*.js")).toBe(".");
    expect(getPathPrefix("*.md")).toBe(".");
  });

  test("returns full path if no glob characters", () => {
    expect(getPathPrefix("src/components")).toBe("src/components");
    expect(getPathPrefix("docs/guide")).toBe("docs/guide");
    expect(getPathPrefix("single")).toBe("single");
  });

  test("handles glob patterns with brackets", () => {
    expect(getPathPrefix("src/[a-z]*.js")).toBe("src");
    expect(getPathPrefix("test/[!test]*.mjs")).toBe("test");
  });

  test("handles glob patterns with question marks", () => {
    expect(getPathPrefix("src/file?.js")).toBe("src");
    expect(getPathPrefix("docs/page?.md")).toBe("docs");
  });

  test("handles empty path", () => {
    expect(getPathPrefix("")).toBe(".");
  });

  test("handles path with multiple glob segments", () => {
    expect(getPathPrefix("src/**/components/*.js")).toBe("src");
    expect(getPathPrefix("a/b/**/c/*.ts")).toBe("a/b");
  });

  test("handles Windows-style paths", () => {
    // Windows paths use backslashes, but getPathPrefix splits by "/"
    // So "C:\\Users\\**\\*.js" treated as single segment with glob returns "."
    expect(getPathPrefix("C:\\Users\\**\\*.js")).toBe(".");
    // For forward slashes, it works as expected
    expect(getPathPrefix("src/components/**/*.ts")).toBe("src/components");
  });
});

describe("isDirExcluded", () => {
  test("returns true for matching exclude patterns", () => {
    expect(isDirExcluded("node_modules", ["node_modules/**"])).toBe(true);
    expect(isDirExcluded("test", ["test/**", "temp/**"])).toBe(true);
    expect(isDirExcluded("dist", ["dist/**"])).toBe(true);
  });

  test("returns false for non-matching exclude patterns", () => {
    expect(isDirExcluded("src", ["node_modules/**"])).toBe(false);
    expect(isDirExcluded("lib", ["test/**", "temp/**"])).toBe(false);
  });

  test("handles path normalization (backslashes)", () => {
    expect(isDirExcluded("node_modules\\sub", ["node_modules/**"])).toBe(true);
    expect(isDirExcluded("test\\unit", ["test/**"])).toBe(true);
  });

  test("handles path normalization (leading ./)", () => {
    expect(isDirExcluded("./node_modules", ["node_modules/**"])).toBe(true);
    expect(isDirExcluded("./test", ["test/**"])).toBe(true);
  });

  test("handles path with trailing slash", () => {
    expect(isDirExcluded("node_modules/", ["node_modules/**"])).toBe(true);
    expect(isDirExcluded("test/", ["test/**"])).toBe(true);
  });

  test("handles path without trailing slash", () => {
    expect(isDirExcluded("node_modules", ["node_modules/**"])).toBe(true);
    expect(isDirExcluded("test", ["test/**"])).toBe(true);
  });

  test("returns false for null or undefined input", () => {
    expect(isDirExcluded(null, ["test/**"])).toBe(false);
    expect(isDirExcluded(undefined, ["test/**"])).toBe(false);
  });

  test("returns false for non-string input", () => {
    expect(isDirExcluded(123, ["test/**"])).toBe(false);
    expect(isDirExcluded({}, ["test/**"])).toBe(false);
    expect(isDirExcluded([], ["test/**"])).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isDirExcluded("", ["test/**"])).toBe(false);
  });

  test("handles nested directory patterns", () => {
    expect(isDirExcluded("src/node_modules", ["**/node_modules/**"])).toBe(true);
    expect(isDirExcluded("project/test/unit", ["**/test/**"])).toBe(true);
  });

  test("handles multiple exclude patterns", () => {
    expect(isDirExcluded("node_modules", ["node_modules/**", "dist/**"])).toBe(true);
    expect(isDirExcluded("dist", ["node_modules/**", "dist/**"])).toBe(true);
    expect(isDirExcluded("src", ["node_modules/**", "dist/**"])).toBe(false);
  });

  test("handles dot files in patterns", () => {
    expect(isDirExcluded(".git", [".git/**"])).toBe(true);
    expect(isDirExcluded(".vscode", [".vscode/**"])).toBe(true);
  });
});

describe("findInvalidSourcePaths", () => {
  test("returns empty array for empty sourcePaths", async () => {
    expect(await findInvalidSourcePaths([], ["node_modules/**"])).toEqual([]);
  });

  test("returns empty array for non-array sourcePaths", async () => {
    expect(await findInvalidSourcePaths(null, ["node_modules/**"])).toEqual([]);
    expect(await findInvalidSourcePaths(undefined, ["node_modules/**"])).toEqual([]);
    expect(await findInvalidSourcePaths("string", ["node_modules/**"])).toEqual([]);
  });

  test("returns empty array for empty excludePatterns", async () => {
    expect(await findInvalidSourcePaths(["src/file.js"], [])).toEqual([]);
    expect(await findInvalidSourcePaths(["src/file.js"], null)).toEqual([]);
    expect(await findInvalidSourcePaths(["src/file.js"], undefined)).toEqual([]);
  });

  test("skips paths starting with !", async () => {
    const result = await findInvalidSourcePaths(
      ["!src/file.js", "!node_modules"],
      ["node_modules/**"],
    );
    expect(result).toEqual([]);
  });

  test("skips remote URLs", async () => {
    const result = await findInvalidSourcePaths(
      ["http://example.com", "https://example.com/file.js"],
      ["node_modules/**"],
    );
    expect(result).toEqual([]);
  });

  test("includes invalid glob patterns that match exclude patterns", async () => {
    const result = await findInvalidSourcePaths(["node_modules/**/*.js"], ["node_modules/**"]);
    expect(result).toContain("node_modules/**/*.js");
  });

  test("skips valid glob patterns that don't match exclude patterns", async () => {
    const result = await findInvalidSourcePaths(["src/**/*.js"], ["node_modules/**"]);
    expect(result).not.toContain("src/**/*.js");
  });

  test("skips files", async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "file-utils-test-"));
    const testFile = path.join(tempDir, "test.txt");
    writeFileSync(testFile, "content");

    try {
      const result = await findInvalidSourcePaths([testFile], ["test.txt"]);
      expect(result).not.toContain(testFile);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("includes directories that match exclude patterns", async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "file-utils-test-"));
    const excludedDir = path.join(tempDir, "node_modules");
    mkdirSync(excludedDir, { recursive: true });

    try {
      // For absolute paths, need to use **/ prefix in pattern to match anywhere
      const result = await findInvalidSourcePaths([excludedDir], ["**/node_modules/**"]);
      expect(result).toContain(excludedDir);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("skips directories that don't match exclude patterns", async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "file-utils-test-"));
    const validDir = path.join(tempDir, "src");
    mkdirSync(validDir, { recursive: true });

    try {
      const result = await findInvalidSourcePaths([validDir], ["node_modules/**"]);
      expect(result).not.toContain(validDir);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("includes non-existent paths", async () => {
    const nonExistent = path.join("/non/existent/path", "file.js");
    const result = await findInvalidSourcePaths([nonExistent], ["node_modules/**"]);
    expect(result).toContain(nonExistent);
  });

  test("skips invalid string inputs", async () => {
    const result = await findInvalidSourcePaths([null, undefined, "", 123], ["node_modules/**"]);
    expect(result).toEqual([]);
  });

  test("handles mixed valid and invalid paths", async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "file-utils-test-"));
    const validDir = path.join(tempDir, "src");
    const excludedDir = path.join(tempDir, "node_modules");
    const testFile = path.join(tempDir, "test.txt");
    const nonExistent = path.join(tempDir, "missing");

    mkdirSync(validDir, { recursive: true });
    mkdirSync(excludedDir, { recursive: true });
    writeFileSync(testFile, "content");

    try {
      // Use **/ prefix for absolute paths
      const result = await findInvalidSourcePaths(
        [
          validDir,
          excludedDir,
          testFile,
          nonExistent,
          "http://example.com",
          "!excluded",
          "node_modules/**/*.js",
        ],
        ["**/node_modules/**"],
      );

      expect(result).toContain(excludedDir);
      expect(result).toContain(nonExistent);
      expect(result).toContain("node_modules/**/*.js");
      expect(result).not.toContain(validDir);
      expect(result).not.toContain(testFile);
      expect(result).not.toContain("http://example.com");
      expect(result).not.toContain("!excluded");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("handles nested directory exclusion", async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "file-utils-test-"));
    const nestedExcluded = path.join(tempDir, "project", "node_modules");
    mkdirSync(nestedExcluded, { recursive: true });

    try {
      const result = await findInvalidSourcePaths([nestedExcluded], ["**/node_modules/**"]);
      expect(result).toContain(nestedExcluded);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test("handles glob patterns with path prefix heuristic", async () => {
    // getPathPrefix("node_modules/**/*.js") returns "node_modules"
    // So it should be excluded if "node_modules/**" is in exclude patterns
    const result1 = await findInvalidSourcePaths(["node_modules/**/*.js"], ["node_modules/**"]);
    expect(result1).toContain("node_modules/**/*.js");

    // getPathPrefix("src/**/*.js") returns "src"
    // So it should not be excluded if "node_modules/**" is in exclude patterns
    const result2 = await findInvalidSourcePaths(["src/**/*.js"], ["node_modules/**"]);
    expect(result2).not.toContain("src/**/*.js");
  });
});
