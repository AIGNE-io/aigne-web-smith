import crypto from "node:crypto";
import { basename, join } from "node:path";
import chalk from "chalk";
import fs from "fs-extra";
import pMap from "p-map";
import { parse } from "yaml";

import { getAccessToken } from "../../utils/auth-utils.mjs";
import {
  DEFAULT_APP_URL,
  MEDIA_KIT_PROTOCOL,
  TMP_DIR,
  TMP_PAGES_DIR,
} from "../../utils/constants.mjs";
import { uploadFiles } from "../../utils/upload-files.mjs";

import { getGithubRepoUrl, loadConfigFromFile, saveValueToConfig } from "../../utils/utils.mjs";

/**
 * 递归扫描对象中的 mediakit:// 协议值
 * @param {any} obj - 要扫描的对象
 * @param {Set} foundUrls - 找到的 mediakit:// URL 集合
 */
function scanForMediaKitUrls(obj, foundUrls) {
  if (typeof obj === "string") {
    if (obj.startsWith(MEDIA_KIT_PROTOCOL)) {
      foundUrls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => scanForMediaKitUrls(item, foundUrls));
  } else if (obj && typeof obj === "object") {
    Object.values(obj).forEach((value) => scanForMediaKitUrls(value, foundUrls));
  }
}

/**
 * 批量上传所有需要的媒体文件
 * @param {Object} input - 输入参数对象
 * @param {Array} input.allUsedMediaKitUrls - 所有页面使用的 mediakit:// URL
 * @param {Array} input.mediaFiles - 媒体文件映射数组
 * @param {string} input.appUrl - 应用 URL
 * @param {string} input.accessToken - 访问令牌
 * @param {string} input.rootDir - 根目录
 * @param {string} input.outputDir - 输出目录
 * @returns {Promise<Object>} URL 映射对象
 */
async function batchUploadMediaFiles({
  allUsedMediaKitUrls,
  mediaFiles = [],
  appUrl,
  accessToken,
  rootDir,
  outputDir,
}) {
  // 如果没有需要上传的URL，返回空映射
  if (allUsedMediaKitUrls.size === 0) {
    return {};
  }

  // 根据使用的 URL 找到对应的文件路径
  const filesToUpload = [];

  mediaFiles.forEach((media) => {
    if (
      media.mediaKitPath &&
      media.path &&
      media.type === "image" &&
      allUsedMediaKitUrls.has(media.mediaKitPath)
    ) {
      filesToUpload.push(media);
    }
  });

  // 如果没有需要上传的文件，返回空映射
  if (filesToUpload.length === 0) {
    return {};
  }

  try {
    // 批量上传文件
    const uploadFilePaths = filesToUpload.map((file) => join(rootDir, file.path));

    const uploadResults = await uploadFiles({
      appUrl,
      filePaths: uploadFilePaths,
      accessToken,
      concurrency: 3,
      cacheFilePath: join(outputDir, "_upload-cache.yaml"),
    });

    // 创建 mediaKitPath 到上传URL的映射
    const mediaKitToUrlMap = {};
    uploadResults.results.forEach((result, index) => {
      if (result.url) {
        const mediaFile = filesToUpload[index];
        mediaKitToUrlMap[mediaFile.mediaKitPath] = result.url;
      }
    });

    return mediaKitToUrlMap;
  } catch (error) {
    console.warn(`Failed to batch upload media files: ${error.message}`);
    return {};
  }
}

/**
 * 使用全局URL映射替换页面数据中的 mediakit:// 协议
 * @param {Object} pageData - 页面数据对象
 * @param {Object} mediaKitToUrlMap - mediakit:// 到 URL 的映射
 * @returns {Object} 处理后的页面数据对象
 */
function replacePageMediaKitUrls(pageData, mediaKitToUrlMap) {
  function replaceUrls(obj) {
    if (typeof obj === "string") {
      if (obj.startsWith(MEDIA_KIT_PROTOCOL)) {
        const mappedUrl = mediaKitToUrlMap[obj];
        if (mappedUrl) {
          // hashFileName
          return basename(mappedUrl);
        } else {
          return obj;
        }
      }
      return obj;
    } else if (Array.isArray(obj)) {
      return obj.map((item) => replaceUrls(item));
    } else if (obj && typeof obj === "object") {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = replaceUrls(value);
      }
      return result;
    }
    return obj;
  }

  return replaceUrls(pageData);
}

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
      `Page upload failed: ${response.status} ${response.statusText} - ${responseText}`,
    );
  }

  return {
    success: true,
    result: result,
  };
};

export default async function publishWebsite(
  {
    appUrl,
    projectId,
    projectName,
    projectDesc,
    projectLogo,
    outputDir,
    mediaFiles,
    pagesDir: rootDir,
  },
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
          name: `${chalk.blue(`WebSmith Cloud (${DEFAULT_APP_URL})`)} – ${chalk.green("Free")} hosting. Your pages will be public accessible. Best for open-source projects or community sharing.`,
          value: "default",
        },
        {
          name: `${chalk.blue("Your existing website")} - Integrate and publish directly on your current site (setup required)`,
          value: "custom",
        },
      ],
    });

    if (choice === "custom") {
      const userInput = await options.prompts.input({
        message: "Please enter your website URL:",
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

  const sitemapPath = join(pagesDir, "_sitemap.yaml");

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
    // Read sitemap content as page data (if exists)
    let sitemapContent = null;
    try {
      sitemapContent = await fs.readFile(sitemapPath, "utf-8");

      sitemapContent = parse(sitemapContent);
    } catch {
      // Ignore when sitemap file doesn't exist
    }

    // Recursive function to extract all paths from sitemap
    function extractAllPaths(sitemapItems) {
      const paths = [];
      if (!Array.isArray(sitemapItems)) return paths;

      sitemapItems.forEach((item) => {
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

    // Extract all sitemap paths
    const sitemapPaths = sitemapContent
      ? extractAllPaths(sitemapContent.sitemap || sitemapContent)
      : [];

    // Read all .yaml files in pagesDir
    const files = await fs.readdir(pagesDir);
    const yamlFiles = files.filter(
      (file) => (file.endsWith(".yaml") || file.endsWith(".yml")) && file !== "_sitemap.yaml",
    );

    // Step 1: 扫描所有页面，收集需要上传的 mediakit:// URL
    const allUsedMediaKitUrls = new Set();
    const pageContents = new Map();

    for (const file of yamlFiles) {
      try {
        const filePath = join(pagesDir, file);
        const pageContent = await fs.readFile(filePath, "utf-8");
        const parsedPageContent = parse(pageContent);

        pageContents.set(file, parsedPageContent);

        // 扫描这个页面中的 mediakit:// URL
        scanForMediaKitUrls(parsedPageContent, allUsedMediaKitUrls);
      } catch (error) {
        console.warn(`Failed to read file ${file}: ${error.message}`);
      }
    }

    // Step 2: 批量上传所有需要的文件
    const mediaKitToUrlMap = await batchUploadMediaFiles({
      allUsedMediaKitUrls,
      mediaFiles,
      appUrl,
      accessToken,
      rootDir,
      outputDir,
    });

    // Step 3: 处理每个页面，使用全局URL映射替换
    const publishResults = await pMap(
      yamlFiles,
      async (file) => {
        const parsedPageContent = pageContents.get(file);
        if (!parsedPageContent) {
          return {
            file,
            success: false,
            error: "Failed to parse page content",
          };
        }

        // Find corresponding sitemap path information
        const fileBaseName = basename(file, ".yaml");
        const matchingSitemapItem = sitemapPaths.find(
          (item) =>
            item.cleanPath === fileBaseName ||
            item.cleanPath.endsWith(`/${fileBaseName}`) ||
            item.cleanPath.replace(/\//g, "-") === fileBaseName,
        );

        const path = matchingSitemapItem ? matchingSitemapItem.path : `/${fileBaseName}`;

        // Replace mediakit:// URLs with uploaded URLs
        const processedPageContent = replacePageMediaKitUrls(parsedPageContent, mediaKitToUrlMap);

        const pageTemplateData = {
          ...processedPageContent,
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
            sitemapTitle: matchingSitemapItem?.title,
            sitemapPath: matchingSitemapItem?.path,
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
    const overallSuccess = publishResults.every((result) => result?.success);
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

      const successCount = publishResults.filter((r) => r?.success).length;
      const totalCount = publishResults.length;

      // Extract URLs from successful results
      const publishedUrls = publishResults
        .filter((result) => result?.success && result?.result?.data?.url)
        .map((result) => result.result.data.url);

      const uploadedMediaCount = Object.keys(mediaKitToUrlMap).length;

      message = `✅ Pages Published Successfully!

Successfully published **${successCount}/${totalCount}** pages to your website.
${uploadedMediaCount > 0 ? `📁 Uploaded **${uploadedMediaCount}** media assets to website.` : ""}

🔗 Published URLs

${publishedUrls.map((url) => `- ${url}`).join("\n")}

🚀 Next Steps

1. Share your published website with your team
2. Update website as needed using \`aigne web update\`

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

publishWebsite.taskTitle = "Publish the pages to website";
