import crypto from "node:crypto";
import { basename, join } from "node:path";
import AdmZip from "adm-zip";
import chalk from "chalk";
import fs from "fs-extra";
import { withoutTrailingSlash } from "ufo";
import { parse } from "yaml";

import { getAccessToken } from "../../utils/auth-utils.mjs";

import { getComponentMountPoint } from "../../utils/blocklet.mjs";

import {
  DEFAULT_APP_URL,
  LINK_PROTOCOL,
  MEDIA_KIT_PROTOCOL,
  PAGES_KIT_DID,
  PAGES_KIT_STORE_URL,
  TMP_DIR,
  TMP_PAGES_DIR,
} from "../../utils/constants.mjs";
import { deploy } from "../../utils/deploy.mjs";
import { batchUploadMediaFiles } from "../../utils/upload-files.mjs";

import { getGithubRepoUrl, loadConfigFromFile, saveValueToConfig } from "../../utils/utils.mjs";

const formatRoutePath = (path) => {
  if (path === "/home") {
    return "/";
  }
  return path;
};

/**
 * 递归扫描对象中的指定协议值
 * @param {any} obj - 要扫描的对象
 * @param {Set} foundUrls - 找到的协议 URL 集合
 * @param {string} protocol - 要扫描的协议 (如 MEDIA_KIT_PROTOCOL 或 LINK_PROTOCOL)
 */
function scanForProtocolUrls(obj, foundUrls, protocol) {
  if (typeof obj === "string") {
    if (obj.startsWith(protocol)) {
      foundUrls.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => scanForProtocolUrls(item, foundUrls, protocol));
  } else if (obj && typeof obj === "object") {
    Object.values(obj).forEach((value) => scanForProtocolUrls(value, foundUrls, protocol));
  }
}

/**
 * 使用全局URL映射替换页面数据中的指定协议
 * @param {Object} pageData - 页面数据对象
 * @param {Object} protocolToUrlMap - 协议到 URL 的映射
 * @param {string} protocol - 要替换的协议
 * @returns {Object} 处理后的页面数据对象
 */
function replacePageProtocolUrls(
  pageData,
  protocolToUrlMap,
  protocol,
  // default format function: only use pathname as value
  formatFn = (value) => {
    try {
      const url = new URL(value);
      return url.pathname;
    } catch {
      return value;
    }
  },
) {
  function replaceUrls(obj) {
    if (typeof obj === "string") {
      if (obj.startsWith(protocol)) {
        const value = protocolToUrlMap[obj];
        if (!value) {
          return obj;
        }

        return formatFn(value);
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

/**
 * 创建链接协议到实际路径的映射
 * @param {Array} websiteStructure - 网站结构数组
 * @returns {Object} link:// 到实际路径的映射
 */
function createLinkProtocolMap({ websiteStructure, projectSlug, appUrl }) {
  const linkToPathMap = {};

  if (websiteStructure && Array.isArray(websiteStructure)) {
    websiteStructure.forEach((page) => {
      if (page.path && page.linkPath) {
        const url = new URL(appUrl);
        url.pathname = join(projectSlug, formatRoutePath(page.path));
        linkToPathMap[page.linkPath] = url.toString();
      }
    });
  }

  return linkToPathMap;
}

const BUNDLE_FILENAME = "publish-bundle.json";

const publishBundleFn = async ({ bundleBuffer, appUrl, mountPoint, accessToken }) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  headers.append("Content-Type", "application/zip");

  const response = await fetch(join(appUrl, mountPoint || "/", "/api/sdk/upload-data"), {
    method: "POST",
    headers,
    body: bundleBuffer,
    redirect: "follow",
  });

  let result;
  const responseText = await response.text();

  try {
    result = JSON.parse(responseText);
  } catch {
    result = responseText;
  }

  if (!response.ok) {
    throw new Error(result?.message || result?.error || result);
  }

  return {
    success: true,
    result,
  };
};

export default async function publishWebsite(
  {
    appUrl,
    projectId,
    projectName,
    projectDesc,
    projectLogo,
    projectSlug,
    outputDir,
    mediaFiles,
    websiteStructure,
    pagesDir: rootDir,
  },
  options,
) {
  const pagesDir = join(".aigne", "web-smith", TMP_DIR, TMP_PAGES_DIR);
  await fs.rm(pagesDir, { recursive: true, force: true });
  await fs.mkdir(pagesDir, {
    recursive: true,
  });

  // check outputDir is exist
  if (!fs.existsSync(outputDir)) {
    return {
      message:
        "It seems that the pages does not generated. \nPlease generate the pages as needed using \`aigne web generate\`\n",
    };
  }

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

  let token = "";

  if (!useEnvAppUrl && isDefaultAppUrl && !hasAppUrlInConfig) {
    const hasCachedCheckoutId = !!config?.checkoutId;
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
        ...(hasCachedCheckoutId
          ? [
              {
                name: `${chalk.yellow("Resume previous website setup")} - ${chalk.green("Already paid.")} Continue where you left off. Your payment has already been processed.`,
                value: "new-pagekit-continue",
              },
            ]
          : []),
        {
          name: `${chalk.blue("New dedicated website")} - ${chalk.yellow("Paid service.")} Create a new website with custom domain and hosting for professional use.`,
          value: "new-pagekit",
        },
      ],
    });

    if (choice === "custom") {
      console.log(
        `${chalk.bold("\n💡 Tips")}\n\n` +
          `Start here to set up your own website:\n${chalk.cyan(PAGES_KIT_STORE_URL)}\n`,
      );
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
    } else if (["new-pagekit", "new-pagekit-continue"].includes(choice)) {
      // Deploy a new Pages Kit service
      try {
        let id = "";
        let paymentUrl = "";
        if (choice === "new-pagekit-continue") {
          id = config?.checkoutId;
          paymentUrl = config?.paymentUrl;
          console.log(`\nResuming your previous website setup...`);
        } else {
          console.log(`\nCreating new dedicated website for your pages...`);
        }
        const { appUrl: homeUrl, token: ltToken } = (await deploy(id, paymentUrl)) || {};

        appUrl = homeUrl;
        token = ltToken;
      } catch (error) {
        const errorMsg = error?.message || "Unknown error occurred";
        return { message: `${chalk.red("❌ Failed to create website:")} ${errorMsg}` };
      }
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

  const accessToken = await getAccessToken(appUrl, token);

  const mountPoint = await getComponentMountPoint(appUrl, PAGES_KIT_DID);

  process.env.PAGES_ROOT_DIR = pagesDir;

  const sitemapPath = join(pagesDir, "_sitemap.yaml");

  // Construct meta object
  const meta = {
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
      (file) => (file.endsWith(".yaml") || file.endsWith(".yml")) && !file.startsWith("_"),
    );

    // Step 1: 扫描所有页面，收集需要处理的协议 URLs
    const allUsedMediaKitUrls = new Set();
    const pageContents = new Map();

    for (const file of yamlFiles) {
      try {
        const filePath = join(pagesDir, file);
        const pageContent = await fs.readFile(filePath, "utf-8");
        const parsedPageContent = parse(pageContent);

        pageContents.set(file, parsedPageContent);

        // 扫描这个页面中的 mediakit:// URL
        scanForProtocolUrls(parsedPageContent, allUsedMediaKitUrls, MEDIA_KIT_PROTOCOL);
      } catch (error) {
        console.warn(`Failed to read file ${file}: ${error.message}`);
      }
    }

    // Step 2: 批量上传所有需要的媒体文件
    const mediaKitToUrlMap = await batchUploadMediaFiles({
      allUsedMediaKitUrls,
      mediaFiles,
      appUrl,
      accessToken,
      rootDir,
      outputDir,
    });

    // Step 2.5: 创建链接协议到实际路径的映射
    const linkToPathMap = createLinkProtocolMap({
      websiteStructure,
      projectSlug: projectSlug || projectId,
      appUrl,
    });

    const manifestPages = [];
    const localFailures = [];

    for (const file of yamlFiles) {
      const parsedPageContent = pageContents.get(file);
      if (!parsedPageContent) {
        localFailures.push({
          file,
          success: false,
          error: "Failed to parse page content",
          scope: "page",
          code: "PAGE_PARSE_ERROR",
        });
        continue;
      }

      const fileBaseName = basename(file, ".yaml");
      const matchingSitemapItem = sitemapPaths.find(
        (item) =>
          item.cleanPath === fileBaseName ||
          item.cleanPath.endsWith(`/${fileBaseName}`) ||
          item.cleanPath.replace(/\//g, "-") === fileBaseName,
      );

      const path = matchingSitemapItem ? matchingSitemapItem.path : `/${fileBaseName}`;

      let processedPageContent = replacePageProtocolUrls(
        parsedPageContent,
        mediaKitToUrlMap,
        MEDIA_KIT_PROTOCOL,
        (value) => {
          // get hashName and compact with /uploads/, remove mediaKit prefix
          const hashName = value.split("/").pop();
          return join("/uploads", hashName);
        },
      );

      processedPageContent = replacePageProtocolUrls(
        processedPageContent,
        linkToPathMap,
        LINK_PROTOCOL,
      );

      const pageTemplateData = {
        ...processedPageContent,
        slug: path,
        templateConfig: {
          isTemplate: true,
          ...meta,
          sourceFile: file,
        },
      };

      const routePath = formatRoutePath(path);

      const routeData = {
        path: routePath,
        displayName: routePath,
        meta: {
          ...meta,
          sourceFile: file,
          sitemapTitle: matchingSitemapItem?.title,
          sitemapPath: matchingSitemapItem?.path,
        },
      };

      manifestPages.push({
        sourceFile: file,
        pageTemplateData,
        routeData,
      });
    }

    const projectData = {
      id: projectId,
      name: projectName,
      description: projectDesc,
      logo: projectLogo,
      slug: projectSlug,
    };

    let remoteResults = [];
    let newProjectId = projectId;

    if (manifestPages.length > 0) {
      const manifest = {
        version: 1,
        meta,
        project: {
          projectData,
          resetProject: true,
          force: true,
        },
        pages: manifestPages,
      };

      const bundleZip = new AdmZip();
      bundleZip.addFile(BUNDLE_FILENAME, Buffer.from(JSON.stringify(manifest), "utf-8"));

      const bundleBuffer = bundleZip.toBuffer();

      try {
        const { result } = await publishBundleFn({
          bundleBuffer,
          appUrl,
          mountPoint,
          accessToken,
        });

        remoteResults = Array.isArray(result?.pages) ? result.pages : [];
        newProjectId = result?.projectId || projectId;
      } catch (error) {
        localFailures.push({
          file: "bundle",
          success: false,
          error: error.message,
        });
      }
    }

    const publishResults = [
      ...localFailures,
      ...remoteResults.map((entry) => ({
        file: entry?.sourceFile,
        success: entry?.success,
        error: entry?.error || entry?.message,
        data: entry?.data,
        projectId: entry?.projectId,
        scope: entry?.scope || (entry?.sourceFile ? "page" : "project"),
        code: entry?.code,
      })),
    ];

    const totalCount = publishResults.length;
    const successCount = publishResults.filter((result) => result?.success).length;
    const overallSuccess = totalCount > 0 && successCount === totalCount;
    const success = overallSuccess;

    // Save values to config.yaml if publish was successful
    if (success) {
      if (!useEnvAppUrl) {
        await saveValueToConfig("appUrl", appUrl);
      }

      const shouldSaveProjectId = !hasProjectIdInConfig || projectId !== newProjectId;
      if (shouldSaveProjectId) {
        await saveValueToConfig("projectId", newProjectId || projectId);
      }

      const publishedUrls = publishResults
        .filter((result) => result?.success && result?.data?.url)
        .map((result) => result.data.url);

      const uploadedMediaCount = Object.keys(mediaKitToUrlMap).length;

      const pageWord = successCount === 1 ? "page" : "pages";
      const assetWord = uploadedMediaCount === 1 ? "asset" : "assets";

      message = `✅ Pages published successfully! (\`${successCount}/${totalCount}\` ${pageWord}${uploadedMediaCount > 0 ? `, \`${uploadedMediaCount}\` media ${assetWord}` : ""})

🔗 Live URLs:
${publishedUrls.map((url) => `   ${withoutTrailingSlash(url)}`).join("\n")}

💡 Optional: Update specific pages (\`aigne web update\`) or refine website structure (\`aigne web generate\`)
`;
    } else if (totalCount === 0) {
      message = "❌ Failed to publish pages: No page definitions were found to publish.";
    } else {
      const failedEntries = publishResults.filter((r) => !r?.success);
      const seenGlobalErrors = new Set();
      const formattedFailures = [];

      failedEntries.forEach((entry) => {
        const scope = entry?.scope;

        // only show global error once
        if (scope && scope !== "page") {
          const key = `${scope}:${entry?.code || entry?.error}`;
          if (seenGlobalErrors.has(key)) {
            return;
          }
          seenGlobalErrors.add(key);
        }

        const label = entry?.file ? `${entry.file}: ` : "";
        const detail =
          typeof entry?.error === "string" ? entry.error : JSON.stringify(entry?.error || entry);
        formattedFailures.push(`${label}${detail}`);
      });

      if (formattedFailures.length === 1) {
        message = `❌ Failed to publish pages: ${formattedFailures[0]}`;
      } else {
        message = `❌ Failed to publish pages: \n${formattedFailures.map((item) => `- ${item}`).join("\n")}`;
      }
    }
  } catch (error) {
    message = `❌ Failed to publish pages: ${typeof error === "string" ? error : JSON.stringify(error?.message || error)}`;
  }

  await saveValueToConfig("checkoutId", "", "Checkout ID for website deployment service");

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
