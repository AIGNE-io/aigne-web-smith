import { describe, expect, test } from "bun:test";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { PAGE_FILE_EXTENSION } from "../../utils/constants.mjs";
import {
  clearDirExcept,
  ensureDir,
  generateDeterministicId,
  generateNavigationId,
  getContentHash,
  isGlobPattern,
  normalizeAppUrl,
  normalizePath,
  processContent,
  resolveToAbsolute,
  sanitizeNavigationId,
  toDisplayPath,
  toKebabCase,
  toRelativePath,
  validateWebsiteStructure,
} from "../../utils/utils.mjs";

describe("core utils coverage", () => {
  test("normalizePath and toRelativePath round-trip paths", () => {
    const relativePath = path.join("tests", "fixtures", "sample.txt");
    const absolutePath = normalizePath(relativePath);
    expect(path.isAbsolute(absolutePath)).toBe(true);
    expect(absolutePath.endsWith(path.join("tests", "fixtures", "sample.txt"))).toBe(true);

    const roundTrip = toRelativePath(absolutePath);
    expect(roundTrip).toBe(path.join("tests", "fixtures", "sample.txt"));
  });

  test("isGlobPattern detects wildcard expressions", () => {
    expect(isGlobPattern("**/*.md")).toBe(true);
    expect(isGlobPattern("plain-file.txt")).toBe(false);
    expect(isGlobPattern(null)).toBe(false);
  });

  test("resolveToAbsolute and toDisplayPath normalize paths correctly", () => {
    const relativeValue = path.join("docs", "guide.md");
    const resolved = resolveToAbsolute(relativeValue);
    expect(resolved).toBe(path.resolve(process.cwd(), relativeValue));

    const alreadyAbsolute = path.resolve(process.cwd(), "README.md");
    expect(resolveToAbsolute(alreadyAbsolute)).toBe(alreadyAbsolute);
    expect(resolveToAbsolute(null)).toBeUndefined();

    expect(toDisplayPath(alreadyAbsolute)).toBe("README.md");
    const outside = path.resolve(process.cwd(), "..", "sibling");
    expect(toDisplayPath(outside)).toBe(outside);
    expect(toDisplayPath(process.cwd())).toBe(".");
  });

  test("processContent rewrites relative markdown links", () => {
    const input =
      "See [Guide](docs/intro) and [Anchor](docs/intro#setup) plus [External](https://example.com) and [Mail](mailto:hi@example.com).";
    const output = processContent({ content: input });
    const expectedLink = `[Guide](./docs-intro${PAGE_FILE_EXTENSION})`;
    const expectedAnchor = `[Anchor](./docs-intro${PAGE_FILE_EXTENSION}#setup)`;

    expect(output).toContain(expectedLink);
    expect(output).toContain(expectedAnchor);
    expect(output).toContain("[External](https://example.com)");
    expect(output).toContain("[Mail](mailto:hi@example.com)");
  });

  test("generateDeterministicId produces stable md5 substrings", () => {
    const first = generateDeterministicId("deterministic");
    const second = generateDeterministicId("deterministic");
    const different = generateDeterministicId("different");

    expect(first).toHaveLength(16);
    expect(first).toBe(second);
    expect(first).not.toBe(different);
  });

  test("sanitizeNavigationId guards edge cases", () => {
    expect(sanitizeNavigationId("/docs/get-started")).toBe("docs-get-started");
    expect(sanitizeNavigationId("/")).toBe("home");
    expect(sanitizeNavigationId("")).toBe("unknown-nav");
  });

  test("generateNavigationId deduplicates using deterministic suffix", () => {
    const used = new Set(["about"]);
    const id = generateNavigationId("about", used);
    expect(id).toBe(generateDeterministicId("about-1"));
    expect(used.has("about")).toBe(true);
    expect(used.has(id)).toBe(true);

    const repeated = generateNavigationId("about", used);
    expect(repeated).toBe(generateDeterministicId("about-1"));
    expect(used.size).toBe(2); // "about" seed + hashed candidate
  });

  test("validateWebsiteStructure flags entries without navigation", () => {
    const structure = [{ path: "/present", navigation: { en: [] } }, { path: "/missing" }];
    const locales = ["en", "zh"];
    const result = validateWebsiteStructure(structure, locales);

    expect(result.isValid).toBe(false);
    expect(result.missingLocales).toEqual([{ path: "/missing", missing: ["en", "zh"] }]);
    expect(result.message).toContain("/missing");
  });

  test("ensureDir and clearDirExcept keep whitelisted entries only", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "core-utils-"));
    const keepFile = path.join(tempDir, "keep.txt");
    const dropFile = path.join(tempDir, "drop.txt");
    const nestedDir = path.join(tempDir, "nested");

    ensureDir(tempDir);
    writeFileSync(keepFile, "keep");
    writeFileSync(dropFile, "drop");
    ensureDir(nestedDir);
    writeFileSync(path.join(nestedDir, "nested.txt"), "nested");

    clearDirExcept(tempDir, [keepFile]);

    const remaining = readdirSync(tempDir);
    expect(remaining).toEqual(["keep.txt"]);

    rmSync(tempDir, { recursive: true, force: true });
  });

  test("toKebabCase and getContentHash transform input predictably", () => {
    expect(toKebabCase("HelloWorld Value")).toBe("hello-world-value");
    expect(toKebabCase("")).toBe("");
    expect(getContentHash("hash-me")).toHaveLength(64);
    expect(getContentHash("hash-me")).toBe(getContentHash("hash-me"));
    expect(getContentHash("hash-me")).not.toBe(getContentHash("different"));
  });

  test("normalizeAppUrl normalizes URLs correctly", () => {
    // Empty or falsy values return empty string
    expect(normalizeAppUrl("")).toBe("");
    expect(normalizeAppUrl(null)).toBe("");
    expect(normalizeAppUrl(undefined)).toBe("");

    // URLs with https:// protocol
    expect(normalizeAppUrl("https://example.com")).toBe("https://example.com");
    expect(normalizeAppUrl("https://example.com/path/to/page")).toBe("https://example.com");
    expect(normalizeAppUrl("https://example.com/path?query=value#hash")).toBe(
      "https://example.com",
    );

    // URLs with http:// protocol (preserved)
    expect(normalizeAppUrl("http://example.com")).toBe("http://example.com");
    expect(normalizeAppUrl("http://example.com/path")).toBe("http://example.com");

    // URLs without protocol (auto-add https://)
    expect(normalizeAppUrl("example.com")).toBe("https://example.com");
    expect(normalizeAppUrl("example.com/path/to/page")).toBe("https://example.com");
    expect(normalizeAppUrl("subdomain.example.com")).toBe("https://subdomain.example.com");

    // URLs with whitespace (trimmed)
    expect(normalizeAppUrl("  https://example.com  ")).toBe("https://example.com");
    expect(normalizeAppUrl("  example.com  ")).toBe("https://example.com");

    // Invalid URLs throw error
    expect(() => normalizeAppUrl("not a valid url")).toThrow("Invalid appUrl");
    expect(() => normalizeAppUrl("://invalid")).toThrow("Invalid appUrl");
    expect(() => normalizeAppUrl("http://")).toThrow("Invalid appUrl");
  });
});
