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

<user_feedback>
{{ feedback }}

<feedback_analysis_guidelines>

Analyze the user feedback to determine the intended operation:

**Update Meta Operations:**

- Keywords: "change title", "update description", "modify SEO", "meta information"
- Required information: the meta field to update and new value
- Example: "Change the page title to 'About Our Company'"

**Add Section Operations:**

- Keywords: "add section", "create section", "new section", "insert"
- Required information: section content and optional position
- Example: "Add a testimonials section after the features section"

**Delete Section Operations:**

- Keywords: "remove section", "delete section", "eliminate"
- Required information: section name to delete
- Example: "Remove the old pricing section"

**Update Section Operations:**

- Keywords: "update section", "modify section", "change section", "edit"
- Required information: section name and properties to update
- Example: "Update the hero section title to 'Welcome to Innovation'"

**Move Section Operations:**

- Keywords: "move section", "reorder", "relocate", "reorganize"
- Required information: section name and new position
- Example: "Move the contact section to the top of the page"

</feedback_analysis_guidelines>
</user_feedback>

<page_detail>
{{ pageDetail }}

<detail_context>
Current page detail contains the following structure:

- Meta information: title, description, seoTitle, seoDescription
- Sections: Array of content sections with properties like name, summary, title, description
  Each section represents a distinct content block with its own purpose and information.
  </detail_context>

</page_detail>

{% include "../../common/rules/user-preferences-rule.md" %}
