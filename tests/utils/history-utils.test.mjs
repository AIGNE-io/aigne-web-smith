import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { WEB_SMITH_DIR } from "../../utils/constants.mjs";
import { getHistory, recordUpdate } from "../../utils/history-utils.mjs";

const TEST_DIR = join(process.cwd(), `${WEB_SMITH_DIR}-test`);
const ORIGINAL_CWD = process.cwd();

describe("History Utils", () => {
  let execSyncMock;

  beforeEach(async () => {
    // Clean up test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });

    // Change to test directory
    process.chdir(TEST_DIR);

    // Get the mocked execSync
    execSyncMock = spyOn(await import("node:child_process"), "execSync");
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

  test("git not available - write to YAML only", () => {
    // Mock git as not available
    execSyncMock.mockImplementation((command) => {
      if (command === "git --version") {
        throw new Error("git: command not found");
      }
      throw new Error("Unknown command");
    });

    // Record update
    recordUpdate({
      operation: "page_update",
      feedback: "Test feedback",
      pagePath: "/test",
    });

    // Verify YAML record was created
    const history = getHistory();
    console.log("history123123123", history);
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].feedback).toBe("Test feedback");
    expect(history.entries[0].operation).toBe("page_update");
    expect(history.entries[0].page).toBe("/test");
    expect(history.entries[0].timestamp).toBeDefined();

    // Verify no git repository was created
    const gitDir = join(process.cwd(), WEB_SMITH_DIR, ".git");
    expect(existsSync(gitDir)).toBe(false);
  });

  test("current directory is git repo - skip git integration", () => {
    // Mock git as available and in repo
    execSyncMock.mockImplementation((command) => {
      if (command === "git --version") {
        return "git version 2.30.0";
      }
      if (command === "git rev-parse --is-inside-work-tree") {
        return "true";
      }
      throw new Error("Unknown command");
    });

    // Record update
    recordUpdate({
      operation: "structure_update",
      feedback: "Structure update",
    });

    // Verify YAML record was created
    const history = getHistory();
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].feedback).toBe("Structure update");

    // Verify no new git repository was created (since we're already in a git repo)
    const gitDir = join(process.cwd(), WEB_SMITH_DIR, ".git");
    expect(existsSync(gitDir)).toBe(false);
  });

  test("write YAML records and commit to git", () => {
    // Ensure the WEB_SMITH_DIR exists
    const webSmithDir = join(process.cwd(), WEB_SMITH_DIR);
    mkdirSync(webSmithDir, { recursive: true });

    // Mock git as available but not in repo
    execSyncMock.mockImplementation((command) => {
      if (command === "git --version") {
        return "git version 2.30.0";
      }
      if (command === "git rev-parse --is-inside-work-tree") {
        throw new Error("not a git repository");
      }
      if (command === "git init") {
        return "Initialized empty Git repository";
      }
      if (command === 'git add .gitignore && git commit -m "Initialize web-smith history"') {
        return "Initial commit";
      }
      if (command === "git add pages/ config.yaml preferences.yml history.yaml") {
        return "Files added";
      }
      if (command === "git diff --cached --quiet") {
        throw new Error("Has changes");
      }
      if (command === 'git commit -m "First update"') {
        return "Commit successful";
      }
      if (command === 'git commit -m "Second update"') {
        return "Commit successful";
      }
      throw new Error("Unknown command: ", command);
    });

    // Record multiple updates - this should trigger git repo creation and commits
    recordUpdate({
      operation: "page_update",
      feedback: "First update",
      pagePath: "/first",
    });

    recordUpdate({
      operation: "page_update",
      feedback: "Second update",
      pagePath: "/second",
    });

    // Verify YAML records
    const history = getHistory();
    expect(history.entries.length).toBe(2);
    expect(history.entries[0].feedback).toBe("Second update"); // Newest first
    expect(history.entries[1].feedback).toBe("First update");

    // Verify git commands were called
    expect(execSyncMock).toHaveBeenCalledWith("git --version", { stdio: "ignore" });
    expect(execSyncMock).toHaveBeenCalledWith("git rev-parse --is-inside-work-tree", {
      cwd: process.cwd(),
      stdio: "pipe",
      encoding: "utf8",
    });
    expect(execSyncMock).toHaveBeenCalledWith("git init", {
      cwd: join(process.cwd(), WEB_SMITH_DIR),
      stdio: "ignore",
    });
  });

  test("query history.yaml - handle various scenarios", () => {
    // Test empty history
    let history = getHistory();
    expect(history.entries).toBeDefined();
    expect(history.entries.length).toBe(0);

    // Test corrupted YAML file
    const historyPath = join(process.cwd(), WEB_SMITH_DIR, "history.yaml");
    mkdirSync(join(process.cwd(), WEB_SMITH_DIR), { recursive: true });
    writeFileSync(historyPath, "invalid: yaml: content: 「「「", "utf8");

    history = getHistory();
    expect(history.entries).toBeDefined();
    expect(history.entries.length).toBe(0);

    // Test valid history
    const validHistory = {
      entries: [
        {
          timestamp: "2023-01-01T00:00:00.000Z",
          operation: "page_update",
          feedback: "Valid entry",
        },
      ],
    };
    writeFileSync(historyPath, JSON.stringify(validHistory), "utf8");

    history = getHistory();
    expect(history.entries.length).toBe(1);
    expect(history.entries[0].feedback).toBe("Valid entry");
  });
});
