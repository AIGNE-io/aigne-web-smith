import { readPreferences } from "../../utils/preferences-utils.mjs";

/**
 * List all user preferences with formatted display
 * @returns {Object} Result with formatted message
 */
export default function listPreferences() {
  const preferences = readPreferences();

  if (preferences.rules.length === 0) {
    return { message: "No preferences found." };
  }

  let message = "# User Preferences\n\n";

  // Add format explanation
  message += "**Format explanation:**\n";
  message += "- 🟢 = Active preference, ⚪ = Inactive preference\n";
  message += "- [scope] = Preference scope (global, structure, page, translation)\n";
  message += "- ID = Unique preference identifier\n";
  message += "- Paths = Specific file paths (if applicable)\n\n";

  preferences.rules.forEach((rule) => {
    const status = rule.active ? "🟢" : "⚪";
    const pathsInfo = rule.paths ? ` | Paths: ${rule.paths.join(", ")}` : "";

    // First line: status, scope, ID and paths info
    message += `${status} [${rule.scope}] ${rule.id}${pathsInfo}\n`;

    // Second line: rule content (truncated if too long)
    const maxRuleLength = 120;
    const ruleText =
      rule.rule.length > maxRuleLength ? `${rule.rule.substring(0, maxRuleLength)}...` : rule.rule;
    message += `   ${ruleText}\n `;

    // Add blank line after each record
    message += `\n`;
  });

  return { message };
}

listPreferences.description = "List all user preferences";
