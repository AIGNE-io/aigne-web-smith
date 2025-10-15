import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import * as fsPromises from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import savePagesData from "../../../../agents/generate/page-data/save-pages-data.mjs";

describe("savePagesData", () => {
  let tempDirs;

  const registerTempDir = (dir) => {
    tempDirs.push(dir);
    return dir;
  };

  beforeEach(() => {
    tempDirs = [];
  });

  afterEach(() => {
    tempDirs.forEach((dir) => {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    });
  });

  test("writes pages kit yaml to disk and returns enriched payload", async () => {
    const baseDir = registerTempDir(mkdtempSync(join(tmpdir(), "save-pages-data-success-")));
    const outputDir = join(baseDir, "nested");
    const yamlContent = "meta:\n  title: Landing\n";

    const input = {
      path: "/landing/page",
      pagesKitYaml: yamlContent,
      outputDir,
    };

    const result = await savePagesData(input);

    const expectedFileName = join(outputDir, "landing-page.yaml");
    expect(result.pagesKitFilePath).toBe(expectedFileName);
    expect(result.path).toBe(input.path);
    expect(readFileSync(expectedFileName, "utf8")).toBe(yamlContent);
  });

  test("throws descriptive error when writing fails", async () => {
    const writeSpy = spyOn(fsPromises, "writeFile").mockImplementation(() =>
      Promise.reject(new Error("Disk full")),
    );

    try {
      const baseDir = registerTempDir(mkdtempSync(join(tmpdir(), "save-pages-data-error-")));
      const outputDir = join(baseDir, "nested");

      await expect(
        savePagesData({
          path: "/broken/page",
          pagesKitYaml: "content",
          outputDir,
        }),
      ).rejects.toThrow(/Failed to save pages data at .*broken-page\.yaml: Disk full/);
    } finally {
      writeSpy.mockRestore();
    }
  });
});
