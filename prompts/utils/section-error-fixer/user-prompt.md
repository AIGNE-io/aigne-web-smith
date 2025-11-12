<datasources>
{{ detailDataSources }}

{{ additionalInformation }}

<allowed_media_files>
{{ assetsContent }}
</allowed_media_files>

{% ifAsync websiteScale != "singlePage" %}
<allowed_links>
{{ linksContent }}
</allowed_links>
{% endif %}

<structure_plan>

This is the website structure. You can refer to it to understand where the current page fits within the website structure.

{{ websiteStructureYaml }}

</structure_plan>

</datasources>

<output_constraints>
{% include "../../common/rules/page-detail/content-organization-rules.md" %}

{% include "../../common/rules/page-detail/resources-references-rules.md" %}

** Sections Constraints（VERY IMPORTANT）:**

{{ fieldConstraints }}
</output_constraints>
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

## Page Context
- Title: {{pageContext.meta.title}}
- Description: {{pageContext.meta.description}}

---

Please output ONLY the fixed section in YAML format. Remember:
1. Map existing fields to required fields when possible
2. Preserve original content meaning
3. Use only valid links and media from the allowed lists
4. Output raw YAML without code fences or explanations
