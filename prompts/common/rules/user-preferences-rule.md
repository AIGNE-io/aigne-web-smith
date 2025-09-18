{% if userPreferences %}
<user_preferences>
{{userPreferences}}

<user_preferences_handling_rules>

- User preferences come from previous feedback: consider them to avoid repeating past issues
- Current <feedback_and_history> always overrides preferences(if provided): prioritize the latest feedback

</user_preferences_handling_rules>
</user_preferences>
{% endif %}
