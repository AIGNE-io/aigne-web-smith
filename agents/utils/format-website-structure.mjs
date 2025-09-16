import { stringify } from "yaml";

export default async function formatWebsiteStructure({ websiteStructure }) {
  // Extract required fields from each item in websiteStructure
  const formattedData = websiteStructure.map((item) => ({
    title: item.title,
    path: item.path,
    parentId: item.parentId,
    description: item.description,
  }));

  // Convert to YAML string
  const yamlString = stringify(formattedData, {
    indent: 2,
    lineWidth: 120,
    minContentWidth: 20,
  });

  return {
    websiteStructureYaml: yamlString,
    websiteStructure,
  };
}

formatWebsiteStructure.task_render_mode = "hide";
