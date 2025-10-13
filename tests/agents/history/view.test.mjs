import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import viewHistory from "../../../agents/history/view.mjs";
import { WEB_SMITH_DIR } from "../../../utils/constants.mjs";

const TEST_DIR = join(process.cwd(), `${WEB_SMITH_DIR}-test`);
const ORIGINAL_CWD = process.cwd();

describe("History View", () => {
  let consoleLogMock;

  beforeEach(async () => {
    // Clean up test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });

    // Change to test directory
    process.chdir(TEST_DIR);

    // Spy on console.log
    consoleLogMock = spyOn(console, "log");
  });

  afterEach(() => {
    // Restore original directory
    process.chdir(ORIGINAL_CWD);

    // Clean up
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }

    mock.restore();
  });

  test("should display message when no history exists", () => {
    // No history file exists
    const result = viewHistory();

    expect(result).toEqual({});
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("No update history found"));
  });

  test("should display formatted history entries", async () => {
    // Create history file with sample data
    const historyPath = join(process.cwd(), WEB_SMITH_DIR, "history.yaml");
    mkdirSync(join(process.cwd(), WEB_SMITH_DIR), { recursive: true });

    const historyData = {
      entries: [
        {
          timestamp: "2023-01-01T00:00:00.000Z",
          operation: "page_update",
          feedback: "Updated documentation",
          page: "about",
        },
        {
          timestamp: "2023-01-02T00:00:00.000Z",
          operation: "structure_update",
          feedback: "Reorganized sections",
        },
      ],
    };

    // Use YAML format instead of JSON
    const { stringify } = await import("yaml");
    writeFileSync(historyPath, stringify(historyData), "utf8");

    const result = viewHistory();

    expect(result).toEqual({});
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("📜 Update History"));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("page_update"));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("structure_update"));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("Updated documentation"));
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("Reorganized sections"));
  });

  test("should handle empty history entries", async () => {
    // Create history file with empty entries
    const historyPath = join(process.cwd(), WEB_SMITH_DIR, "history.yaml");
    mkdirSync(join(process.cwd(), WEB_SMITH_DIR), { recursive: true });

    const historyData = { entries: [] };
    // Use YAML format instead of JSON
    const { stringify } = await import("yaml");
    writeFileSync(historyPath, stringify(historyData), "utf8");

    const result = viewHistory();

    expect(result).toEqual({});
    expect(consoleLogMock).toHaveBeenCalledWith(expect.stringContaining("No update history found"));
  });
});
