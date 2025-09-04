import { basename, join } from "node:path";

import chalk from "chalk";
import fs from "fs-extra";

import { getAccessToken } from "../utils/auth-utils.mjs";

import {
  PAGES_KIT_STORE_URL,
  TMP_DIR,
  TMP_PAGES_DIR,
  PAGES_OUTPUT_DIR,
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
  force = false,
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
  force = false,
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
  {
    pagesDir: rawPagesDir,
    appUrl,
    projectId,
    projectName,
    projectDesc,
    projectLogo,
  },
  options
) {
  const pagesDir = join(".aigne", "web-smith", TMP_DIR, TMP_PAGES_DIR);
  await fs.rm(pagesDir, { recursive: true, force: true });
  await fs.mkdir(pagesDir, {
    recursive: true,
  });
  await fs.cp(join(rawPagesDir, PAGES_OUTPUT_DIR), pagesDir, {
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
    } catch {
      // sidebar 文件不存在时忽略
    }

    // 构造页面模板数据
    const pageTemplateData = {
      name: projectInfo.name,
      description: projectInfo.description,
      icon: projectInfo.icon,
      sidebarContent,
      templateConfig: {
        isTemplate: true,
        ...boardMeta,
      },
    };

    // 构造路由数据（如果需要的话）
    const routeData = {
      path: "/",
      displayName: projectInfo.name,
      description: projectInfo.description,
      meta: boardMeta,
    };

    const { success, projectId: newProjectId } = await publishPagesFn({
      projectId,
      appUrl,
      accessToken,
      force: false, // 可以根据需要设置为 true
      pageTemplateData,
      routeData,
      // dataSourceData 暂时不需要，可以后续添加
    });

    // Save values to config.yaml if publish was successful
    if (success) {
      // Save appUrl to config only when not using environment variable
      if (!useEnvAppUrl) {
        await saveValueToConfig("appUrl", appUrl);
      }

      // Save projectId to config if it was auto-created
      if (projectId !== newProjectId) {
        await saveValueToConfig("projectId", newProjectId);
      }
      message = `✅ Pages Published Successfully!`;
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
      description: "The id of the project",
    },
  },
};

publishPages.description = "Publish the pages to Pages Kit";
