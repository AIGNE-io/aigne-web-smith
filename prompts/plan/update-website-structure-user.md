<user_feedback>
{{ feedback }}
</user_feedback>

Initial Website Structure:
<initial_website_structure>
{{ websiteStructure }}

<structure_context>
Initial website structure contains {{ websiteStructure.length }} pages.
Each page has the following properties:
- title: Page title
- description: Page description
- path: URL path (must start with /, no language prefix, homepage uses /home)
- parentId: Parent page path (use the string "null" for top-level pages)
- sourceIds: Associated sourceIds from datasources (cannot be empty)
</structure_context>

</initial_website_structure>
