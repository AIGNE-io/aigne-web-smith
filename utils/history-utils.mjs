import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse, stringify } from "yaml";

const WEB_SMITH_DIR = ".aigne/web-smith";
const HISTORY_FILE = "history.yaml";

/**
 * Check if git is available in the system
 */
export function isGitAvailable() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure .aigne/web-smith directory exists
 */
function ensureWebSmithDir() {
  const dir = join(process.cwd(), WEB_SMITH_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Initialize git repo in .aigne/web-smith if not exists
 */
export function ensureGitRepo() {
  if (!isGitAvailable()) return false;

  const gitDir = join(process.cwd(), WEB_SMITH_DIR, ".git");

  if (!existsSync(gitDir)) {
    try {
      const cwd = join(process.cwd(), WEB_SMITH_DIR);

      execSync("git init", { cwd, stdio: "ignore" });

      // Create .gitignore to exclude temporary files
      const gitignore = "*.tmp\n";
      writeFileSync(join(cwd, ".gitignore"), gitignore);

      // Initial commit
      execSync('git add .gitignore && git commit -m "Initialize web-smith history"', {
        cwd,
        stdio: "ignore",
      });

      console.log("✔ Git history tracking initialized");
      return true;
    } catch (error) {
      console.warn("Failed to initialize git history:", error.message);
      return false;
    }
  }

  return true;
}

/**
 * Record update using git commit (if available)
 */
function recordUpdateGit({ operation, feedback, pagePath = null }) {
  try {
    const cwd = join(process.cwd(), WEB_SMITH_DIR);

    // Stage changed files (only if they exist)
    const filesToAdd = ["pages/", "config.yaml", "preferences.yml", "history.yaml"]
      .filter((file) => existsSync(join(cwd, file)))
      .join(" ");

    if (filesToAdd) {
      execSync(`git add ${filesToAdd}`, {
        cwd,
        stdio: "ignore",
      });
    }

    // Check if there are changes to commit
    try {
      execSync("git diff --cached --quiet", { cwd, stdio: "ignore" });
      console.log("✔ No update history changes to commit");
      return; // No changes
    } catch {
      // Has changes, continue
    }

    // Build commit message (only user feedback)
    const message = feedback;

    // Commit
    execSync(`git commit -m ${JSON.stringify(message)}`, {
      cwd,
      stdio: "ignore",
    });
    console.log("✔ Update history committed successfully");
  } catch (error) {
    console.warn("Update history commit failed:", error.message);
  }
}

/**
 * Record update in YAML file (always)
 */
function recordUpdateYaml({ operation, feedback, pagePath = null }) {
  try {
    ensureWebSmithDir();
    const historyPath = join(process.cwd(), WEB_SMITH_DIR, HISTORY_FILE);

    // Read existing history
    let history = { entries: [] };
    if (existsSync(historyPath)) {
      try {
        const content = readFileSync(historyPath, "utf8");
        history = parse(content) || { entries: [] };
      } catch (error) {
        console.warn("Failed to read history file:", error.message);
      }
    }

    // Create new entry
    const entry = {
      timestamp: new Date().toISOString(),
      operation,
      feedback,
    };

    // Add page path if provided
    if (pagePath) {
      entry.page = pagePath;
    }

    // Add to beginning (newest first)
    history.entries = history.entries || [];
    history.entries.unshift(entry);

    // Write back
    const yamlContent = stringify(history, {
      indent: 2,
      lineWidth: 100,
    });

    writeFileSync(historyPath, yamlContent, "utf8");
  } catch (error) {
    console.warn("YAML history tracking failed:", error.message);
  }
}

/**
 * Record an update after user feedback
 * - Always writes to YAML
 * - Also commits to git if available
 */
export function recordUpdate({ operation, feedback, pagePath = null }) {
  // Skip if no feedback
  if (!feedback?.trim()) return;

  // Always record in YAML
  recordUpdateYaml({ operation, feedback, pagePath });

  // Also record in git if available
  if (isGitAvailable()) {
    // Initialize git repo on first update if not exists
    ensureGitRepo();
    recordUpdateGit({ operation, feedback, pagePath });
  } else {
    console.warn("Git is not available, skipping git based update history");
  }
}

/**
 * Get history entries from YAML
 */
export function getHistory() {
  const historyPath = join(process.cwd(), WEB_SMITH_DIR, HISTORY_FILE);

  if (!existsSync(historyPath)) {
    return { entries: [] };
  }

  try {
    const content = readFileSync(historyPath, "utf8");
    return parse(content) || { entries: [] };
  } catch (error) {
    console.warn("Failed to read history:", error.message);
    return { entries: [] };
  }
}
