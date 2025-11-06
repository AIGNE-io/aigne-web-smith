import crypto from "node:crypto";
import { stat } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";
import { BrokerClient } from "@blocklet/payment-broker-client/node";
import AdmZip from "adm-zip";
import chalk from "chalk";
import fs from "fs-extra";
import slugify from "slugify";
import { joinURL, withoutTrailingSlash } from "ufo";
import { parse } from "yaml";
import { getAccessToken, getOfficialAccessToken } from "../../utils/auth-utils.mjs";

import { getBlockletMetaDid, getComponentMountPoint } from "../../utils/blocklet.mjs";

import {
  BUNDLE_FILENAME,
  CLOUD_SERVICE_URL_PROD,
  CLOUD_SERVICE_URL_STAGING,
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_SLUG,
  LINK_PROTOCOL,
  MEDIA_KIT_PROTOCOL,
  PAGES_KIT_DID,
  PAGES_KIT_STORE_URL,
  TMP_DIR,
  TMP_PAGES_DIR,
  WEB_SMITH_DIR,
} from "../../utils/constants.mjs";

import { deploy } from "../../utils/deploy.mjs";
import { getExtnameFromContentType } from "../../utils/file-utils.mjs";
import { scanForProtocolUrls } from "../../utils/protocol-utils.mjs";
import { batchUploadMediaFiles, uploadFiles } from "../../utils/upload-files.mjs";
import {
  formatRoutePath,
  getGithubRepoUrl,
  isHttp,
  loadConfigFromFile,
  normalizeAppUrl,
  saveValueToConfig,
} from "../../utils/utils.mjs";

const BASE_URL = process.env.WEB_SMITH_BASE_URL || CLOUD_SERVICE_URL_PROD;

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
        url.pathname = join(projectSlug || "", formatRoutePath(page.path));
        linkToPathMap[page.linkPath] = url.toString();
      }
    });
  }

  return linkToPathMap;
}

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

const validateProjectFn = async ({ appUrl, mountPoint, accessToken, projectData }) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);
  headers.append("Content-Type", "application/json");

  const response = await fetch(joinURL(appUrl, mountPoint || "/", "/api/sdk/project/validate"), {
    method: "POST",
    headers,
    body: JSON.stringify({ projectData }),
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

  return result;
};

export default async function publishWebsite(
  {
    appUrl,
    projectId,
    projectName,
    projectCover,
    projectDesc,
    projectLogo,
    projectSlug,
    outputDir,
    mediaFiles,
    websiteStructure,
    pagesDir: rootDir,
    locales,
    translatedMetadata,
    "with-branding": withBrandingOption,
    "with-navigations": withNavigationsOption,
    "with-locales": withLocalesOption,
  },
  options,
) {
  const originProjectId = projectId;
  const originProjectSlug = projectSlug;

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
  const useEnvAppUrl = !!appUrl;

  // Check if appUrl is default and not saved in config (only when not using env variable)
  const config = await loadConfigFromFile();
  appUrl = normalizeAppUrl(process.env.PAGES_KIT_URL || appUrl || config?.appUrl);
  const hasInputAppUrl = !!appUrl;

  let shouldSyncAll = void 0;
  let shouldWithLocales = withLocalesOption || false;
  let navigationType = withNavigationsOption || "";
  let shouldWithBranding = withBrandingOption || false;
  let publishToSelfHostedBlocklet = false;

  let token = "";
  let client = null;
  let authToken = null;
  let sessionId = null;

  if (!hasInputAppUrl) {
    authToken = await getOfficialAccessToken(BASE_URL, false);

    sessionId = "";
    let paymentLink = "";

    if (authToken) {
      client = new BrokerClient({ baseUrl: BASE_URL, authToken });

      const info = await client.checkCacheSession({
        needShortUrl: true,
        sessionId: config?.checkoutId,
      });
      sessionId = info.sessionId;
      paymentLink = info.paymentLink;
    }
    const choice = await options.prompts.select({
      message: "Select platform to publish your pages:",
      choices: [
        ...(sessionId
          ? [
              {
                name: `${chalk.yellow("Resume previous website setup")} - ${chalk.green("Already paid.")} Continue where you left off. Your payment has already been processed.`,
                value: "new-pages-kit-continue",
              },
            ]
          : []),
        {
          name: `${chalk.blue(`WebSmith Cloud (${CLOUD_SERVICE_URL_PROD})`)} – ${chalk.green("Free")} hosting. Your pages will be public accessible. Best for open-source projects or community sharing.`,
          value: "default",
        },
        {
          name: `${chalk.blue("Your existing website")} - Integrate and publish directly on your current site (setup required)`,
          value: "custom",
        },
        {
          name: `${chalk.blue("New dedicated website")} - ${chalk.yellow("Paid service.")} Create a new website with custom domain and hosting for professional use.`,
          value: "new-pages-kit",
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
          const message = "Please enter a valid URL";

          try {
            if (input) {
              normalizeAppUrl(input);
              return true;
            }
            return message;
          } catch {
            return message;
          }
        },
      });
      appUrl = normalizeAppUrl(userInput);
    } else if (["new-pages-kit", "new-pages-kit-continue"].includes(choice)) {
      publishToSelfHostedBlocklet = true;

      // upload to default project
      config.projectId = DEFAULT_PROJECT_ID;
      config.projectSlug = DEFAULT_PROJECT_SLUG;

      projectId = DEFAULT_PROJECT_ID;
      projectSlug = DEFAULT_PROJECT_SLUG;

      // resume previous website setup
      if (choice === "new-pages-kit-continue") {
        shouldSyncAll = config?.shouldSyncAll ?? void 0;
        if (shouldSyncAll !== void 0) {
          shouldWithLocales = shouldWithLocales ?? shouldSyncAll;
          shouldWithBranding = shouldWithBranding ?? shouldSyncAll;
          navigationType = navigationType ?? config?.navigationType;
        }
      }

      if (options?.prompts?.confirm) {
        if (shouldSyncAll === void 0) {
          shouldSyncAll = await options.prompts.confirm({
            message:
              "Publish pages to the new dedicated website with locales, navigations and branding?",
            default: true,
          });

          if (shouldSyncAll) {
            const choice = await options.prompts.select({
              message: "Select navigation type:",
              choices: [
                {
                  name: "Menu - Navigation with parent-child relationships",
                  value: "menu",
                },
                {
                  name: "Flat - Navigation without parent-child relationships",
                  value: "flat",
                },
                {
                  name: "None - No navigation",
                  value: "none",
                },
              ],
            });
            navigationType = choice === "none" ? "" : choice;
          }
          await saveValueToConfig("shouldSyncAll", shouldSyncAll, "Should sync all for website");
          await saveValueToConfig("navigationType", navigationType, "Navigation type for website");
          shouldWithLocales = shouldSyncAll;
          shouldWithBranding = shouldSyncAll;
        } else {
          console.log(
            `Publish pages to the new dedicated website with locales, navigations and branding? ${chalk.cyan(shouldSyncAll ? "Yes" : "No")}`,
          );
          if (navigationType === "") {
            console.log(`Select navigation type: ${chalk.cyan("None - No navigation")}`);
          } else if (navigationType === "flat") {
            console.log(
              `Select navigation type: ${chalk.cyan("Flat - Navigation with parent-child relationships")}`,
            );
          } else {
            console.log(
              `Select navigation type: ${chalk.cyan("Menu - Navigation without parent-child relationships")}`,
            );
          }
        }
      }
      try {
        let id = "";
        if (choice === "new-pages-kit-continue") {
          id = sessionId;
          console.log(`\nResuming your previous website setup...`);
        } else {
          console.log(`\nCreating new dedicated website for your pages...`);
        }
        const {
          appUrl: homeUrl,
          token: ltToken,
          sessionId: newSessionId,
        } = (await deploy(id, paymentLink)) || {};

        appUrl = homeUrl;
        token = ltToken;
        sessionId = newSessionId;
      } catch (error) {
        const errorMsg = error?.message || "Unknown error occurred";
        return { message: `${chalk.red("❌ Failed to create website:")} ${errorMsg}` };
      }
    }
  }

  appUrl = appUrl ?? CLOUD_SERVICE_URL_PROD;

  // Now handle projectId after appUrl is finalized
  const hasProjectIdInConfig = config?.projectId;
  const hasProjectSlugInConfig = config?.projectSlug;

  // Use projectId from config if not provided as parameter
  if (!projectId && hasProjectIdInConfig) {
    projectId = config.projectId;
  }

  if (!projectSlug && hasProjectSlugInConfig) {
    projectSlug = config.projectSlug;
  }

  if (!projectSlug) {
    const slugBase =
      projectName && typeof projectName === "string"
        ? slugify(projectName, { lower: true, strict: true })
        : "";
    projectSlug = slugBase || projectId;
  }

  // Prompt for projectId if still not available
  if (!projectId) {
    projectId = crypto.randomUUID();
  }

  const accessToken = await getAccessToken(appUrl, token || "");

  const mountPoint = await getComponentMountPoint(appUrl, PAGES_KIT_DID);

  // 向前兼容
  try {
    const preflightProjectData = {
      id: projectId,
      name: projectName || "Untitled Project",
      description: projectDesc || "",
      icon: projectLogo,
      slug: ["/", ""].includes(projectSlug) ? "/" : projectSlug,
    };

    const projectValidationResult = await validateProjectFn({
      appUrl,
      mountPoint,
      accessToken,
      projectData: preflightProjectData,
    });

    if (projectValidationResult?.projectId) {
      projectId = projectValidationResult.projectId;
    }

    if (projectValidationResult?.projectSlug && projectValidationResult.slugChanged) {
      console.log(
        `\n${chalk.yellow("🤖 Project slug adjusted before upload due to conflict:")} ${chalk.cyan(projectValidationResult.projectSlug)}`,
      );

      projectSlug = projectValidationResult.projectSlug || projectSlug;
    }
  } catch (_error) {
    // ignore error
  }

  const projectSlugForLinks = projectSlug || projectId;

  process.env.PAGES_ROOT_DIR = pagesDir;

  const sitemapPath = join(pagesDir, "_sitemap.yaml");

  // Construct meta object
  const meta = {
    category: config?.pagePurpose || [],
    githubRepoUrl: getGithubRepoUrl(),
    commitSha: config?.lastGitHead || "",
    languages: locales || [],
  };
  if (translatedMetadata) {
    meta.translation = translatedMetadata;
  }

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
    function extractAllPaths(sitemapItems, parentPath) {
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
            parentPath,
          });
        }
        // Recursively process child items
        if (item.children && Array.isArray(item.children)) {
          paths.push(...extractAllPaths(item.children, item.path));
        }
      });

      return paths;
    }

    // Extract all sitemap paths
    const sitemapPaths = sitemapContent
      ? extractAllPaths(sitemapContent.sitemap || sitemapContent)
      : [];

    let navigationEntries = [];
    if (navigationType && sitemapContent?.navigations) {
      if (navigationType === "flat") {
        sitemapContent.navigations.forEach((item) => {
          if (item.parent?.endsWith("-header")) {
            navigationEntries.push({
              ...item,
              parent: "",
            });
          } else if (!item.id?.endsWith("-header")) {
            navigationEntries.push(item);
          }
        });
      } else if (navigationType === "menu") {
        navigationEntries = sitemapContent.navigations;
      }
      navigationEntries = navigationEntries.map((item) => ({
        ...item,
        description: item.parent ? item.description : "",
      }));
    }

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
      projectSlug: projectSlugForLinks,
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
          sourceFile: file,
        },
      };

      const routePath = formatRoutePath(path);

      const routeData = {
        path: routePath,
        displayName: routePath,
        meta: {
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

    let remoteResults = [];
    let localProjectLogo = "";

    // handle project logo
    if (projectLogo) {
      // download project logo to temp dir
      if (isHttp(projectLogo)) {
        // remove query string to get file name
        const logoName = new URL(projectLogo).pathname.split("/").pop();

        let tempFilePath = join(pagesDir, logoName);

        let ext = extname(logoName);

        await fetch(projectLogo).then(async (response) => {
          const blob = await response.blob();

          const arrayBuffer = await blob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (!response.ok) {
            return;
          }

          const contentType = response.headers.get("content-type");
          const newExt = getExtnameFromContentType(contentType);

          if (!ext || newExt !== ext) {
            ext = newExt;
            tempFilePath = `${tempFilePath}.${ext}`;
          }

          fs.writeFileSync(tempFilePath, buffer);

          return blob;
        });

        // to relative path
        localProjectLogo = relative(join(process.cwd(), WEB_SMITH_DIR), tempFilePath);
      } else {
        localProjectLogo = projectLogo;
      }
    }

    if (manifestPages.length > 0) {
      if (
        shouldWithBranding &&
        ![CLOUD_SERVICE_URL_PROD, CLOUD_SERVICE_URL_STAGING].includes(new URL(appUrl).origin)
      ) {
        // update project logo to blocklet server
        if (localProjectLogo) {
          // check projectLogo is exist
          try {
            const projectLogoPath = resolve(process.cwd(), WEB_SMITH_DIR, localProjectLogo);

            const projectLogoStat = await stat(projectLogoPath);

            const blockletDID = await getBlockletMetaDid(appUrl);

            // projectLogo is file
            if (projectLogoStat.isFile()) {
              const url = new URL(appUrl);

              // upload projectLogo to blocklet server
              await uploadFiles({
                appUrl,
                filePaths: [projectLogoPath],
                accessToken,
                concurrency: 1,
                endpoint: joinURL(
                  url.origin,
                  "/.well-known/service/blocklet/logo/upload/square",
                  blockletDID,
                ),
              });
            }
          } catch (_error) {
            // skip error
          }
        }

        // append branding to meta, will be used to polish blocklet settings
        meta.branding = {
          appName: projectName,
          appDescription: projectDesc,
          // @Notice: appLogo will be auto-set by blocklet server, do not set it here
          // appLogo: brandingProjectLogo,
        };
      }

      if (shouldWithLocales && locales.length > 0) {
        // append locales to meta, will be used to polish blocklet settings
        meta.locales = locales;
      }

      if (navigationEntries.length > 0) {
        // append navigations to meta, will be used to polish blocklet settings
        meta.navigations = navigationEntries;
      }

      if (projectCover) {
        const { results: uploadResults } = await uploadFiles({
          appUrl,
          filePaths: [resolve(process.cwd(), projectCover)],
          accessToken,
          concurrency: 1,
        });
        meta.appCover = uploadResults?.[0]?.url || projectCover;
      }

      // upload project logo to media kit
      if (localProjectLogo) {
        const { results: uploadResults } = await uploadFiles({
          appUrl,
          filePaths: [resolve(process.cwd(), WEB_SMITH_DIR, localProjectLogo)],
          accessToken,
          concurrency: 1,
        });

        projectLogo = uploadResults?.[0]?.url || projectLogo;
      }

      const projectData = {
        id: projectId,
        name: projectName || "Untitled Project",
        description: projectDesc || "",
        icon: projectLogo,
        slug: ["/", ""].includes(projectSlug) ? "/" : projectSlug,
      };

      const manifest = {
        version: 1,
        meta,
        project: {
          projectData,
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
        projectSlug: entry?.projectSlug,
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

      const shouldSaveProjectId =
        !hasProjectIdInConfig || originProjectId !== projectId || publishToSelfHostedBlocklet;
      if (shouldSaveProjectId) {
        await saveValueToConfig("projectId", projectId);
      }

      const shouldSaveProjectSlug =
        !hasProjectSlugInConfig || originProjectSlug !== projectSlug || publishToSelfHostedBlocklet;
      if (shouldSaveProjectSlug) {
        await saveValueToConfig("projectSlug", projectSlug);
      }

      const publishedPaths = publishResults
        .filter((result) => result?.success && result?.data?.url)
        .map((result) => ({
          url: result.data.url,
          path: result.data.route?.path,
        }));
      const pathToIndexMap =
        websiteStructure?.reduce((map, page, index) => {
          const routePath = formatRoutePath(page.path);
          map[routePath] = index;
          return map;
        }, {}) || {};

      // Sort: first by websiteStructure order, then alphabetically for unmatched paths
      const publishedUrls = publishedPaths
        .sort((a, b) => {
          const aIndex = pathToIndexMap[a.path];
          const bIndex = pathToIndexMap[b.path];

          if (aIndex !== undefined && bIndex !== undefined) {
            return aIndex - bIndex;
          }

          if (aIndex !== undefined) return -1;
          if (bIndex !== undefined) return 1;

          return (a.path || "").localeCompare(b.path || "");
        })
        .map((v) => v.url);

      const uploadedMediaCount = Object.keys(mediaKitToUrlMap).length;

      const pageWord = successCount === 1 ? "page" : "pages";
      const assetWord = uploadedMediaCount === 1 ? "asset" : "assets";

      const timestamp = Date.now();
      message = `✅ Successfully published to ${appUrl}! (\`${successCount}/${totalCount}\` ${pageWord}${uploadedMediaCount > 0 ? `, \`${uploadedMediaCount}\` media ${assetWord}` : ""})

🔗 Live URLs:
${publishedUrls.map((url) => `   ${withoutTrailingSlash(url)}?t=${timestamp}`).join("\n")}

💡 Optional: Update specific pages (\`aigne web update\`) or refine website structure (\`aigne web generate\`)
`;
      await saveValueToConfig("checkoutId", "", "Checkout ID for website deployment service");
      await saveValueToConfig("navigationType", "", "Navigation type for website");
      await saveValueToConfig("shouldSyncAll", "", "Should sync all for website");
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

  // clean up tmp work dir
  await fs.rm(pagesDir, { recursive: true, force: true });
  return message ? { message } : {};
}

publishWebsite.input_schema = {
  type: "object",
  properties: {
    "with-branding": {
      type: "boolean",
      description: "Publish to website with branding",
    },
    "with-navigations": {
      type: "string",
      enum: ["flat", "menu"],
      default: "menu",
      description: "Publish to website with navigation (flat or menu, defaults to menu)",
    },
    "with-locales": {
      type: "boolean",
      description: "Publish to website with locales",
    },
    pagesDir: {
      type: "string",
      description: "The directory of the pages",
    },
    appUrl: {
      type: "string",
      description: "The url of the app",
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
