<website_style_context>
Website Purpose: {{pagePurpose}}
Target Audience: {{targetAudience}}
Website Scale: {{websiteScale}}
Custom Rules: {{rules}}
Theme Name: {{name}}

</website_style_context>

{% if feedback %}
<feedback>

{{ feedback }}

<feedback_handling_rules>

- Implement all requested changes from <feedback> as the highest priority
- When applying feedback, preserve the existing theme structure and color relationships unless explicitly requested to change
- Make minimal necessary adjustments to incorporate feedback while maintaining theme consistency

</feedback_handling_rules>

</feedback>
{% endif %}

{% include "../common/rules/user-preferences-rule.md" %}
