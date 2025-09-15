import crypto from "node:crypto";
import { basename, join } from "node:path";
import fs from "fs-extra";
import pMap from "p-map";
import { parse } from "yaml";

import { getAccessToken } from "../../utils/auth-utils.mjs";

import { TMP_DIR, TMP_PAGES_DIR } from "../../utils/constants.mjs";

import { getGithubRepoUrl, loadConfigFromFile, saveValueToConfig } from "../../utils/utils.mjs";

const DEFAULT_APP_URL = "https://websmith.aigne.io";

const publishPageFn = async ({
  projectData,
  appUrl,
  accessToken,
  force = true,
  pageTemplateData,
  routeData,
  dataSourceData,
}) => {
  // Build request headers
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  // Build request body - using /upload-data SDK interface format
  const requestBody = JSON.stringify({
    projectData,
    force,
    pageTemplateData,
    routeData,
    dataSourceData,
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: requestBody,
    redirect: "follow",
  };

  // Send request to Pages Kit API
  const response = await fetch(join(appUrl, "/api/sdk/upload-data"), requestOptions);

  // Handle response
  let result;
  const responseText = await response.text();

  try {
    result = JSON.parse(responseText);
  } catch {
    result = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Pages Kit upload failed: ${response.status} ${response.statusText} - ${responseText}`,
    );
  }

  return {
    success: true,
    result: result,
  };
};

export default async function publishWebsite(
  { appUrl, projectId, projectName, projectDesc, projectLogo, outputDir },
  options,
) {
  const pagesDir = join(".aigne", "web-smith", TMP_DIR, TMP_PAGES_DIR);
  await fs.rm(pagesDir, { recursive: true, force: true });
  await fs.mkdir(pagesDir, {
    recursive: true,
  });
  await fs.cp(outputDir, pagesDir, {
    recursive: true,
  });

  // ----------------- main publish process flow -----------------------------
  // Check if PAGES_KIT_URL is set in environment variables
  const envAppUrl = process.env.PAGES_KIT_URL;
  const useEnvAppUrl = !!envAppUrl;

  // Use environment variable if available, otherwise use the provided appUrl
  if (useEnvAppUrl) {
    appUrl = envAppUrl;
  }

  // Check if appUrl is default and not saved in config (only when not using env variable)
  const config = await loadConfigFromFile();
  const isDefaultAppUrl = appUrl === DEFAULT_APP_URL;
  const hasAppUrlInConfig = config?.appUrl;

  if (!useEnvAppUrl && isDefaultAppUrl && !hasAppUrlInConfig) {
    const choice = await options.prompts.select({
      message: "Select platform to publish your pages:",
      choices: [
        {
          name: "Publish to websmith.aigne.io - free, but your pages will be public accessible, recommended for open-source projects",
          value: "default",
        },
        {
          name: "Publish to your own website - you will need to run Pages Kit by yourself ",
          value: "custom",
        },
      ],
    });

    if (choice === "custom") {
      const userInput = await options.prompts.input({
        message: "Please enter your Pages Kit platform URL:",
        validate: (input) => {
          try {
            // Check if input contains protocol, if not, prepend https://
            const urlWithProtocol = input.includes("://") ? input : `https://${input}`;
            new URL(urlWithProtocol);
            return true;
          } catch {
            return "Please enter a valid URL";
          }
        },
      });
      // Ensure appUrl has protocol
      appUrl = userInput.includes("://") ? userInput : `https://${userInput}`;
    }
  }

  // Now handle projectId after appUrl is finalized
  const hasProjectIdInConfig = config?.projectId;

  // Use projectId from config if not provided as parameter
  if (!projectId && hasProjectIdInConfig) {
    projectId = config.projectId;
  }

  // Prompt for projectId if still not available
  if (!projectId) {
    projectId = crypto.randomUUID();
  }

  const accessToken = await getAccessToken(appUrl);

  process.env.PAGES_ROOT_DIR = pagesDir;

  const sidebarPath = join(pagesDir, "_sidebar.yaml");

  // Construct boardMeta object
  const boardMeta = {
    category: config?.pagePurpose || [],
    githubRepoUrl: getGithubRepoUrl(),
    commitSha: config?.lastGitHead || "",
    languages: [
      ...(config?.locale ? [config.locale] : []),
      ...(config?.translateLanguages || []),
    ].filter((lang, index, arr) => arr.indexOf(lang) === index), // Remove duplicates
  };

  let message;

  try {
    // Read sidebar content as page data (if exists)
    let sidebarContent = null;
    try {
      sidebarContent = await fs.readFile(sidebarPath, "utf-8");

      sidebarContent = parse(sidebarContent);
    } catch {
      // Ignore when sidebar file doesn't exist
    }

    // Recursive function to extract all paths from sidebar
    function extractAllPaths(sidebarItems) {
      const paths = [];
      if (!Array.isArray(sidebarItems)) return paths;

      sidebarItems.forEach((item) => {
        if (item.path) {
          // Remove leading slash as filenames don't need slashes
          const cleanPath = item.path.startsWith("/") ? item.path.slice(1) : item.path;
          paths.push({
            path: item.path,
            cleanPath,
            title: item.title,
          });
        }
        // Recursively process child items
        if (item.children && Array.isArray(item.children)) {
          paths.push(...extractAllPaths(item.children));
        }
      });

      return paths;
    }

    // Extract all sidebar paths
    const sidebarPaths = sidebarContent
      ? extractAllPaths(sidebarContent.sidebar || sidebarContent)
      : [];

    // Read all .yaml files in pagesDir
    const files = await fs.readdir(pagesDir);
    const yamlFiles = files.filter(
      (file) => (file.endsWith(".yaml") || file.endsWith(".yml")) && file !== "_sidebar.yaml",
    );

    // Use p-map to process page files concurrently, limit concurrency to 4
    const publishResults = await pMap(
      yamlFiles,
      async (file) => {
        const filePath = join(pagesDir, file);
        let pageContent = null;

        try {
          pageContent = await fs.readFile(filePath, "utf-8");
        } catch (error) {
          return {
            file,
            success: false,
            error: `Failed to read file: ${error.message}`,
          };
        }

        // Find corresponding sidebar path information
        const fileBaseName = basename(file, ".yaml");
        const matchingSidebarItem = sidebarPaths.find(
          (item) =>
            item.cleanPath === fileBaseName ||
            item.cleanPath.endsWith(`/${fileBaseName}`) ||
            item.cleanPath.replace(/\//g, "-") === fileBaseName,
        );

        const path = matchingSidebarItem ? matchingSidebarItem.path : `/${fileBaseName}`;

        // Construct template data for each page - directly use parsed YAML as complete template object
        const parsedPageContent = parse(pageContent);
        const pageTemplateData = {
          ...parsedPageContent,
          // Add project-related metadata
          slug: path,
          templateConfig: {
            isTemplate: true,
            ...boardMeta,
            sourceFile: file,
          },
        };

        // Construct route data
        const routeData = {
          path,
          displayName: path,
          meta: {
            ...boardMeta,
            sourceFile: file,
            sidebarTitle: matchingSidebarItem?.title,
            sidebarPath: matchingSidebarItem?.path,
          },
        };

        const projectData = {
          id: projectId,
          name: projectName,
          description: projectDesc,
          logo: projectLogo,
        };

        try {
          const {
            success: pageSuccess,
            result,
            projectId: newProjectId,
          } = await publishPageFn({
            projectData,
            appUrl,
            accessToken,
            force: true,
            pageTemplateData,
            routeData,
            // dataSourceData not needed for now, can be added later
          });

          return {
            file,
            success: pageSuccess,
            result,
            projectId: newProjectId,
          };
        } catch (error) {
          return {
            file,
            success: false,
            error: error.message,
          };
        }
      },
      { concurrency: 1 },
    );

    // Use overall results to determine success status
    const overallSuccess = publishResults.every((result) => result.success);
    const success = overallSuccess;
    const newProjectId = publishResults.find((r) => r.projectId)?.projectId || projectId;

    // Save values to config.yaml if publish was successful
    if (success) {
      // Save appUrl to config only when not using environment variable
      if (!useEnvAppUrl) {
        await saveValueToConfig("appUrl", appUrl);
      }

      // Save projectId to config if it was provided by user input or auto-created
      const shouldSaveProjectId = !hasProjectIdInConfig || projectId !== newProjectId;
      if (shouldSaveProjectId) {
        await saveValueToConfig("projectId", newProjectId || projectId);
      }

      const successCount = publishResults.filter((r) => r.success).length;
      const totalCount = publishResults.length;

      // Extract URLs from successful results
      const publishedUrls = publishResults
        .filter((result) => result.success && result.result?.data?.url)
        .map((result) => result.result.data.url);

      message = `## ✅ Pages Published Successfully!

Successfully published **${successCount}/${totalCount}** pages to your website.

### 🔗 Published URLs

${publishedUrls.map((url) => `- ${url}`).join("\n")}

### 🚀 Next Steps

1. Share your published website with your team
2. Update website as needed using \`aigne web update\`


---
`;
    }
  } catch (error) {
    message = `❌ Failed to publish pages: ${error.message}`;
  }
  // clean up tmp work dir
  await fs.rm(pagesDir, { recursive: true, force: true });
  return message ? { message } : {};
}

publishWebsite.input_schema = {
  type: "object",
  properties: {
    pagesDir: {
      type: "string",
      description: "The directory of the pages",
    },
    appUrl: {
      type: "string",
      description: "The url of the app",
      default: DEFAULT_APP_URL,
    },
    projectId: {
      type: "string",
      description:
        "The id of the project. If not provided, will prompt user or use value from config",
    },
    projectName: {
      type: "string",
      description: "The name of the project",
    },
    projectDesc: {
      type: "string",
      description: "The description of the project",
    },
    projectLogo: {
      type: "string",
      description: "The logo/icon of the project",
    },
  },
};

publishWebsite.taskTitle = "Publish the website to Pages Kit";
