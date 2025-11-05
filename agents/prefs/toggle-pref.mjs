import { readPreferences, writePreferences } from '../../utils/preferences-utils.mjs'

/**
 * Toggle preferences active status by IDs or interactive selection
 * @param {string[]} id - Array of preference IDs to toggle
 * @param {Object} options - Options with prompts interface
 * @returns {Object} Result with success message
 */
export default async function togglePreferences({ id }, options) {
  const preferences = readPreferences()
  let targetIds = id

  if (!targetIds || targetIds.length === 0) {
    // Interactive selection
    if (preferences.rules.length === 0) {
      return { message: 'No preferences found to toggle.' }
    }

    const choices = preferences.rules.map((rule) => ({
      name: `${rule.active ? '🟢' : '⚪'} [${rule.scope}] ${rule.rule.substring(0, 60)}${
        rule.rule.length > 60 ? '...' : ''
      }`,
      value: rule.id,
      description: `ID: ${rule.id}`,
    }))

    targetIds = await options.prompts.checkbox({
      message: 'Select preferences to toggle active status:',
      choices,
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Please select at least one preference to toggle'
        }
        return true
      },
    })

    if (!targetIds || targetIds.length === 0) {
      return { message: 'No preferences selected for toggling.' }
    }
  }

  // Process the target IDs
  const results = []
  const prefs = readPreferences()

  for (const ruleId of targetIds) {
    const rule = prefs.rules.find((r) => r.id === ruleId)
    if (rule) {
      rule.active = !rule.active
      results.push({ id: ruleId, success: true, newStatus: rule.active })
    } else {
      results.push({ id: ruleId, success: false, error: 'Rule not found' })
    }
  }

  writePreferences(prefs)

  const successCount = results.filter((r) => r.success).length
  const failedCount = targetIds.length - successCount
  const message =
    failedCount > 0
      ? `Successfully toggled ${successCount} preferences, ${failedCount} failed.`
      : `Successfully toggled ${successCount} preferences.`

  return { message }
}

togglePreferences.input_schema = {
  type: 'object',
  properties: {
    id: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Preference IDs to toggle',
    },
  },
}

togglePreferences.description = 'Toggle the active state of user preferences'
