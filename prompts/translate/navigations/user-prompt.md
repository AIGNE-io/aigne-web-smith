<content>
{{content}}
</content>

<mainLocale>
{{mainLocale}}
</mainLocale>

<missingLanguages>
{{missingLanguages}}
</missingLanguages>

{% if (feedback or detailFeedback) %}
<feedback>

{{ feedback }}

{{ detailFeedback }}

<feedback_handling_rules>

- Implement all requested changes from <feedback> as the highest priority
- When applying feedback, preserve the existing content structure and tone unless explicitly requested to change
- Make minimal necessary adjustments to incorporate feedback while maintaining <history> content completeness

</feedback_handling_rules>

</feedback>
{% endif %}

{% include "../../common/rules/user-preferences-rule.md" %}
