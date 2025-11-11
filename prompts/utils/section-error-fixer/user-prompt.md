Fix the following section to resolve all validation errors:

## Section Information
- Path: {{sectionPath}}
- Component: {{componentName}}
- Required Fields: {{requiredFields}}

## Current Section (with errors)
```yaml
{{sectionYaml}}
```

## Validation Errors
{% for error in errors %}
- **{{error.code}}**: {{error.message}}
{% else %}
- No errors
{% endfor %}

## Constraints
- Allowed Links: {% if allowedLinks %}{{allowedLinks}}{% else %}(none){% endif %}
- Allowed Media: {% if allowedMediaFiles %}{{allowedMediaFiles}}{% else %}(none){% endif %}

## Page Context
- Title: {{pageContext.meta.title}}
- Description: {{pageContext.meta.description}}

---

Please output ONLY the fixed section in YAML format. Remember:
1. Map existing fields to required fields when possible
2. Preserve original content meaning
3. Use only valid links and media from the allowed lists
4. Output raw YAML without code fences or explanations
