<datasources>
{{ detailDataSources }}

{{ additionalInformation }}

<available_media_assets>
{{ assetsContent }}
</available_media_assets>

{% ifAsync websiteScale != "singlePage" %}
<available_internal_links>
{{ linksContent }}
</available_internal_links>
{% endif %}

<structure_plan>

This is the website structure. You can refer to it to understand where the current page fits within the website structure.

{{ websiteStructureYaml }}

</structure_plan>

</datasources>

{% if (feedback or detailFeedback) %}
<feedback_and_history>

<history>
{{content}}
</history>

<feedback>
{{feedback}}

{{ detailFeedback }}
</feedback>

<feedback_handling_rules>

- Implement all requested changes from <feedback> as the highest priority
- When applying feedback, preserve the existing content structure and tone unless explicitly requested to change
- Make minimal necessary adjustments to incorporate feedback while maintaining <history> content completeness

</feedback_handling_rules>

</feedback_and_history>
{% endif %}

{% include "../../common/rules/user-preferences-rule.md" %}
