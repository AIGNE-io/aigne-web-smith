import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { WEB_SMITH_DIR } from "../../utils/constants.mjs";
import { getHistory, isGitAvailable, recordUpdate } from "../../utils/history-utils.mjs";

const TEST_DIR = join(process.cwd(), `${WEB_SMITH_DIR}-test`);
const ORIGINAL_CWD = process.cwd();

describe("History Utils - Unified", () => {
  beforeEach(() => {
    // Clean up test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });

    // Change to test directory
    process.chdir(TEST_DIR);
  });

  afterEach(() => {
    // Restore original directory
    process.chdir(ORIGINAL_CWD);

    // Clean up
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  test("detects git availability", () => {
    const hasGit = isGitAvailable();
    expect(typeof hasGit).toBe("boolean");
  });

  test("skips recording on empty feedback", () => {
    recordUpdate({ operation: "page_update", feedback: "" });
    const history = getHistory();
    expect(history.entries.length).toBe(0);
  });

  test("skips recording on whitespace-only feedback", () => {
    recordUpdate({ operation: "page_update", feedback: "   " });
    const history = getHistory();
    expect(history.entries.length).toBe(0);
  });

  test("records update in YAML", () => {
    recordUpdate({
      operation: "structure_update",
      feedback: "Test feedback",
    });

    const history = getHistory();
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].feedback).toBe("Test feedback");
    expect(history.entries[0].operation).toBe("structure_update");
    expect(history.entries[0].timestamp).toBeDefined();
  });

  test("records page path when provided", () => {
    recordUpdate({
      operation: "page_update",
      feedback: "Update page",
      pagePath: "/about",
    });

    const history = getHistory();
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].page).toBe("/about");
  });

  test("does not include page field when pagePath is null", () => {
    recordUpdate({
      operation: "structure_update",
      feedback: "Update structure",
      pagePath: null,
    });

    const history = getHistory();
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].page).toBeUndefined();
  });

  test("maintains chronological order (newest first)", () => {
    recordUpdate({ operation: "structure_update", feedback: "First" });
    // Small delay to ensure different timestamps
    const now = Date.now();
    while (Date.now() === now) {
      // Wait for next millisecond
    }
    recordUpdate({ operation: "page_update", feedback: "Second" });

    const history = getHistory();
    expect(history.entries.length).toBe(2);
    expect(history.entries[0].feedback).toBe("Second");
    expect(history.entries[1].feedback).toBe("First");
  });

  test("handles multiple updates", () => {
    recordUpdate({ operation: "structure_update", feedback: "Update 1" });
    recordUpdate({ operation: "page_update", feedback: "Update 2", pagePath: "/home" });
    recordUpdate({ operation: "page_update", feedback: "Update 3", pagePath: "/about" });

    const history = getHistory();
    expect(history.entries.length).toBe(3);
    expect(history.entries[0].feedback).toBe("Update 3");
    expect(history.entries[1].feedback).toBe("Update 2");
    expect(history.entries[2].feedback).toBe("Update 1");
  });

  test("returns empty history when file does not exist", () => {
    const history = getHistory();
    expect(history.entries).toBeDefined();
    expect(history.entries.length).toBe(0);
  });

  test("handles corrupted history file gracefully", () => {
    // Create corrupted YAML file
    const historyPath = join(process.cwd(), WEB_SMITH_DIR, "history.yaml");
    mkdirSync(join(process.cwd(), WEB_SMITH_DIR), { recursive: true });
    writeFileSync(historyPath, "invalid: yaml: content: [[[", "utf8");

    const history = getHistory();
    expect(history.entries).toBeDefined();
    expect(history.entries.length).toBe(0);
  });

  test(`creates ${WEB_SMITH_DIR} directory if not exists`, () => {
    recordUpdate({
      operation: "page_update",
      feedback: "Test",
    });

    const webSmithDir = join(process.cwd(), WEB_SMITH_DIR);
    expect(existsSync(webSmithDir)).toBe(true);
  });

  test("timestamp is in ISO 8601 format", () => {
    recordUpdate({
      operation: "structure_update",
      feedback: "Test timestamp",
    });

    const history = getHistory();
    const timestamp = history.entries[0].timestamp;

    // Validate ISO 8601 format
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Validate it's a valid date
    const date = new Date(timestamp);
    expect(date.toISOString()).toBe(timestamp);
  });
});
