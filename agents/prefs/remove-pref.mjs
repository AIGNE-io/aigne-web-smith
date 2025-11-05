import { readPreferences, removeRule } from "../../utils/preferences-utils.mjs";

/**
 * Remove preferences by IDs or interactive selection
 * @param {string[]} id - Array of preference IDs to remove
 * @param {Object} options - Options with prompts interface
 * @returns {Object} Result with success message
 */
export default async function removePreferences({ id }, options) {
  const preferences = readPreferences();
  let targetIds = id;

  if (!targetIds || targetIds.length === 0) {
    // Interactive selection
    if (preferences.rules.length === 0) {
      return { message: "No preferences found to remove." };
    }

    const choices = preferences.rules.map((rule) => ({
      name: `${rule.active ? "🟢" : "⚪"} [${rule.scope}] ${rule.rule.substring(0, 60)}${
        rule.rule.length > 60 ? "..." : ""
      }`,
      value: rule.id,
      description: `ID: ${rule.id}`,
    }));

    targetIds = await options.prompts.checkbox({
      message: "Select preferences to remove:",
      choices,
      validate: (answer) => {
        if (answer.length === 0) {
          return "Please select at least one preference to remove";
        }
        return true;
      },
    });

    if (!targetIds || targetIds.length === 0) {
      return { message: "No preferences selected for removal." };
    }
  }

  // Process the target IDs
  const results = [];
  for (const ruleId of targetIds) {
    const success = removeRule(ruleId);
    results.push({ id: ruleId, success });
  }

  const successCount = results.filter((r) => r.success).length;
  const failedCount = targetIds.length - successCount;
  const message =
    failedCount > 0
      ? `Successfully removed ${successCount} preferences, ${failedCount} failed.`
      : `Successfully removed ${successCount} preferences.`;

  return { message };
}

removePreferences.input_schema = {
  type: "object",
  properties: {
    id: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Preference IDs to remove",
    },
  },
};

removePreferences.description = "Remove user preferences";
