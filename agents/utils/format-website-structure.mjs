import { stringify } from "yaml";
import { LINK_PROTOCOL } from "../../utils/constants.mjs";

// Generate links content from website structure data
function generateLinksContent(websiteStructure) {
  if (!websiteStructure || websiteStructure.length === 0) {
    return "# Available Page Links\n\nNo page links available.\n";
  }

  // Generate markdown formatted linksContent similar to assetsContent
  let linksContent = "# Available Page Links for Navigation\n\n";

  linksContent += "```yaml\n";
  linksContent += "links:\n";

  websiteStructure.forEach((page) => {
    linksContent += `  - title: "${page.title}"\n`;
    linksContent += `    path: "${page.path}"\n`;
    linksContent += `    linkPath: "${page.linkPath}"\n`;
    linksContent += `    parentId: "${page.parentId}"\n`;
    linksContent += `    description: "${page.description}"\n`;
  });

  linksContent += "```\n";

  return linksContent;
}

export default async function formatWebsiteStructure({
  websiteStructure,
  originalWebsiteStructure,
}) {
  if (!websiteStructure && !originalWebsiteStructure) {
    return {
      websiteStructureYaml: "",
      websiteStructure: [],
      linksContent: "",
    };
  }

  // Extract required fields from each item in websiteStructure
  const formattedData = (websiteStructure || originalWebsiteStructure).map((item) => ({
    title: item.title,
    path: item.path,
    parentId: item.parentId,
    description: item.description,
    linkPath: `${LINK_PROTOCOL}${item.path}`,
  }));

  // Convert to YAML string
  const yamlString = stringify(formattedData, {
    indent: 2,
    lineWidth: 120,
    minContentWidth: 20,
  });

  // Generate links content for navigation
  const linksContent = generateLinksContent(formattedData);

  return {
    websiteStructureYaml: yamlString,
    websiteStructure: formattedData,
    linksContent,
  };
}

formatWebsiteStructure.task_render_mode = "hide";
