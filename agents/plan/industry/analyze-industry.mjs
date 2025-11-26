import { INDUSTRY_STYLES } from "../../../utils/constants.mjs";
import { saveValueToConfig } from "../../../utils/utils.mjs";

export default async function analyzeIndustry(
  { industry, websiteStructure, projectName, projectDesc },
  options,
) {
  // If industry is already configured and valid, return directly
  if (industry && INDUSTRY_STYLES[industry]) {
    const config = INDUSTRY_STYLES[industry];
    return {
      industry,
      industryName: config.name,
      industryStyle: config.style,
      cached: true,
    };
  }

  // Invoke detect-industry.yaml to analyze the industry
  const result = await options.context.invoke(options.context.agents["detectIndustry"], {
    projectName: projectName || "",
    projectDesc: projectDesc || "",
    websiteStructure: JSON.stringify(websiteStructure, null, 2),
  });

  // Save the detected industry to config.yaml with available options comment
  await saveValueToConfig(
    "industry",
    result.industry,
    "Industry classification (auto-detected, can be manually overridden). Available options: technology | gaming | artistic | health",
  );

  // Get the corresponding style configuration
  const config = INDUSTRY_STYLES[result.industry] || INDUSTRY_STYLES.technology;

  return {
    industry: result.industry,
    industryName: config.name,
    industryStyle: config.style,
    cached: false,
    confidence: result.confidence,
    reason: result.reason,
  };
}

analyzeIndustry.taskTitle = "Analyze project industry";
analyzeIndustry.task_render_mode = "hide";
