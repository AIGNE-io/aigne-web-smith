<website_style_context>
Website Purpose: {{pagePurpose}}
Target Audience: {{targetAudience}}
Website Scale: {{websiteScale}}
Custom Rules: {{rules}}
Theme Name: {{name}}

</website_style_context>

{% if suggestion %}
<user_suggestion>

{{ suggestion }}

<suggestion_handling_rules>

- Implement all requested suggestions from <user_suggestion> as the highest priority
- Ensure the generated theme aligns with the user's vision while maintaining design best practices

</suggestion_handling_rules>

</user_suggestion>
{% endif %}
