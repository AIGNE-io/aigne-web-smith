<datasources>
{{ datasources }}

{% include "../common/rules/website-structure/datasources-handling-rule.md" %}

</datasources>

{% if (feedback or validateStructureFeedback) %}

<feedback_and_history>

<history>
{{originalWebsiteStructure}}
</history>

<feedback>
{{ feedback }}

{{ validateStructureFeedback }}

<feedback_handling_rules>

- Implement all requested changes from <feedback> as the highest priority
- When applying feedback, preserve existing content structure and tone unless explicitly requested to change
- Make minimal adjustments to incorporate feedback while maintaining <history> content completeness
- Keep unrelated nodes stable:
  - Immutable: path, sourceIds
  - Stable unless required: title, description

</feedback_handling_rules>

</feedback>

</feedback_and_history>

{% endif %}

{% include "../common/rules/user-preferences-rule.md" %}
