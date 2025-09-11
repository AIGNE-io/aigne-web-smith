import { basename, join } from "node:path";

import chalk from "chalk";
import fs from "fs-extra";
import pMap from "p-map";
import { parse } from "yaml";

import { getAccessToken } from "../utils/auth-utils.mjs";

import {
  PAGES_KIT_STORE_URL,
  TMP_DIR,
  TMP_PAGES_DIR,
} from "../utils/constants.mjs";

import {
  getGithubRepoUrl,
  loadConfigFromFile,
  saveValueToConfig,
} from "../utils/utils.mjs";

const DEFAULT_APP_URL = "https://websmith.aigne.io";

const publishPagesFn = async ({
  projectId,
  appUrl,
  accessToken,
  force = true,
  pageTemplateData,
  routeData,
  dataSourceData,
}) => {
  // 构建请求头
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  // 构建请求体 - 使用 /upload-data SDK 接口格式
  const requestBody = JSON.stringify({
    projectId,
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

  // 发送请求到 Pages Kit 接口
  const response = await fetch(
    join(appUrl, "/api/sdk/upload-data"),
    requestOptions
  );

  // 处理响应
  let result;
  const responseText = await response.text();

  try {
    result = JSON.parse(responseText);
  } catch {
    result = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Pages Kit upload failed: ${response.status} ${response.statusText} - ${responseText}`
    );
  }

  return {
    success: true,
    result: result,
  };
};
// New function specifically for Pages Kit YAML upload
export async function uploadPagesKitYaml({
  pagesKitYaml,
  locale = "en",
  projectId,
  appUrl,
  force = true,
}) {
  try {
    // 使用现有的鉴权逻辑获取访问令牌
    const accessToken = await getAccessToken(appUrl);

    // 将 pagesKitYaml 转换为 SDK 格式
    // 这里需要根据 pagesKitYaml 的结构来构造 pageTemplateData
    const pageTemplateData = {
      // 将 YAML 内容作为模板数据
      content: pagesKitYaml,
      locale,
      templateConfig: {
        isTemplate: true,
      },
    };

    const result = await publishPagesFn({
      projectId,
      appUrl,
      accessToken,
      force,
      pageTemplateData,
      // routeData 和 dataSourceData 可以根据需要添加
    });

    return {
      uploadResult: result.result,
      uploadStatus: "success",
      $message: `Successfully uploaded to Pages Kit: ${JSON.stringify(
        result.result
      )}`,
    };
  } catch (error) {
    return {
      uploadResult: null,
      uploadStatus: "failed",
      uploadError: error.message,
      $message: `Failed to upload to Pages Kit: ${error.message}`,
    };
  }
}

export default async function publishPages(
  { appUrl, projectId, projectName, projectDesc, projectLogo, outputDir },
  options
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
      console.log(
        `${chalk.bold("\n💡 Tips")}\n\n` +
          `Start here to run your own website:\n${chalk.cyan(
            PAGES_KIT_STORE_URL
          )}\n`
      );
      const userInput = await options.prompts.input({
        message: "Please enter your Pages Kit platform URL:",
        validate: (input) => {
          try {
            // Check if input contains protocol, if not, prepend https://
            const urlWithProtocol = input.includes("://")
              ? input
              : `https://${input}`;
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
    projectId = await options.prompts.input({
      message: "Please enter your Pages Kit project ID:",
      validate: (input) => {
        if (!input || input.trim() === "") {
          return "Project ID is required";
        }
        return true;
      },
    });
  }

  const accessToken = await getAccessToken(appUrl);

  process.env.PAGES_ROOT_DIR = pagesDir;

  const sidebarPath = join(pagesDir, "_sidebar.yaml");

  // Get project info from config
  const projectInfo = {
    name: projectName || config?.projectName || basename(process.cwd()),
    description: projectDesc || config?.projectDesc || "",
    icon: projectLogo || config?.projectLogo || "",
  };

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
    // 读取 sidebar 内容作为页面数据（如果存在）
    let sidebarContent = null;
    try {
      sidebarContent = await fs.readFile(sidebarPath, "utf-8");

      sidebarContent = parse(sidebarContent);
    } catch {
      // sidebar 文件不存在时忽略
    }

    // 从 sidebar 中提取所有路径的递归函数
    function extractAllPaths(sidebarItems) {
      const paths = [];
      if (!Array.isArray(sidebarItems)) return paths;

      sidebarItems.forEach((item) => {
        if (item.path) {
          // 移除前导斜杠，因为文件名不需要斜杠
          const cleanPath = item.path.startsWith("/")
            ? item.path.slice(1)
            : item.path;
          paths.push({
            path: item.path,
            cleanPath,
            title: item.title,
          });
        }
        // 递归处理子项
        if (item.children && Array.isArray(item.children)) {
          paths.push(...extractAllPaths(item.children));
        }
      });

      return paths;
    }

    // 提取所有 sidebar 路径
    const sidebarPaths = sidebarContent
      ? extractAllPaths(sidebarContent.sidebar || sidebarContent)
      : [];
    console.log(`📋 从 sidebar 中提取到 ${sidebarPaths.length} 个路径`);
    sidebarPaths.forEach(({ path, title }) => {
      console.log(`  - ${path} (${title})`);
    });

    // 读取 pagesDir 中的所有 .yaml 文件
    const files = await fs.readdir(pagesDir);
    const yamlFiles = files.filter(
      (file) =>
        (file.endsWith(".yaml") || file.endsWith(".yml")) &&
        file !== "_sidebar.yaml"
    );

    // 使用 p-map 并发处理页面文件，限制并发数为4
    const publishResults = await pMap(
      yamlFiles,
      async (file) => {
        const filePath = join(pagesDir, file);
        let pageContent = null;

        try {
          pageContent = await fs.readFile(filePath, "utf-8");
        } catch (error) {
          console.warn(`Failed to read file ${file}: ${error.message}`);
          return {
            file,
            success: false,
            error: `Failed to read file: ${error.message}`,
          };
        }

        // 查找对应的 sidebar 路径信息
        const fileBaseName = basename(file, ".yaml");
        const matchingSidebarItem = sidebarPaths.find(
          (item) =>
            item.cleanPath === fileBaseName ||
            item.cleanPath.endsWith(`/${fileBaseName}`) ||
            item.cleanPath.replace(/\//g, "-") === fileBaseName
        );

        const path = matchingSidebarItem
          ? matchingSidebarItem.path
          : `/${fileBaseName}`;

        // 构造每个页面的模板数据 - 直接使用解析后的 YAML 作为完整模板对象
        const parsedPageContent = parse(pageContent);
        const pageTemplateData = {
          ...parsedPageContent,
          // 添加项目相关的元信息
          slug: path,
          templateConfig: {
            isTemplate: true,
            ...boardMeta,
            sourceFile: file,
          },
        };

        // 构造路由数据
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

        try {
          const {
            success: pageSuccess,
            result,
            projectId: newProjectId,
          } = await publishPagesFn({
            projectId,
            appUrl,
            accessToken,
            force: true,
            pageTemplateData,
            routeData,
            // dataSourceData 暂时不需要，可以后续添加
          });

          console.log(`✅ Successfully published: ${file}`);
          return {
            file,
            success: pageSuccess,
            result,
            projectId: newProjectId,
          };
        } catch (error) {
          console.error(`❌ Failed to publish ${file}: ${error.message}`);
          return {
            file,
            success: false,
            error: error.message,
          };
        }
      },
      { concurrency: 3 }
    );

    // 使用整体结果判断成功状态
    const overallSuccess = publishResults.every((result) => result.success);
    const success = overallSuccess;
    const newProjectId =
      publishResults.find((r) => r.projectId)?.projectId || projectId;

    // Save values to config.yaml if publish was successful
    if (success) {
      // Save appUrl to config only when not using environment variable
      if (!useEnvAppUrl) {
        await saveValueToConfig("appUrl", appUrl);
      }

      // Save projectId to config if it was provided by user input or auto-created
      const shouldSaveProjectId =
        !hasProjectIdInConfig || projectId !== newProjectId;
      if (shouldSaveProjectId) {
        await saveValueToConfig("projectId", newProjectId || projectId);
      }

      const successCount = publishResults.filter((r) => r.success).length;
      const totalCount = publishResults.length;
      message = `✅ Pages Published Successfully! (${successCount}/${totalCount} pages)`;
    }
  } catch (error) {
    message = `❌ Failed to publish pages: ${error.message}`;
  }
  // clean up tmp work dir
  await fs.rm(pagesDir, { recursive: true, force: true });
  return message ? { message } : {};
}

publishPages.input_schema = {
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

publishPages.description = "Publish the pages to Pages Kit";
