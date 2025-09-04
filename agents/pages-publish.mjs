import { basename, join } from "node:path";

import chalk from "chalk";
import fs from "fs-extra";

import { getAccessToken } from "../utils/auth-utils.mjs";
import { PAGES_KIT_STORE_URL, TMP_DIR, TMP_PAGES_DIR } from "../utils/constants.mjs";

import { getGithubRepoUrl, loadConfigFromFile, saveValueToConfig } from "../utils/utils.mjs";

const DEFAULT_APP_URL = "https://websmith.aigne.io";

const publishPagesFn = async ({ pagesKitYaml, locale, projectId, appUrl, accessToken }) => {
  // 构建请求头
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${accessToken}`);

  // 构建请求体 - 使用 Pages Kit SDK 接口格式
  const requestBody = JSON.stringify({
    projectId,
    lang: locale,
    pageYaml: pagesKitYaml,
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: requestBody,
    redirect: "follow",
  };

  // 发送请求到 Pages Kit 接口
  const response = await fetch(
    "https://bbqawfllzdt3pahkdsrsone6p3wpxcwp62vlabtawfu.did.abtnet.io/pages-kit/api/sdk/upload-page",
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
    throw new Error(`Pages Kit upload failed: ${response.status} ${response.statusText} - ${responseText}`);
  }

  return {
    success: true,
    result: result,
  };
};
// New function specifically for Pages Kit YAML upload
export async function uploadPagesKitYaml({ pagesKitYaml, locale = "zh", projectId, appUrl }) {
  try {
    // 使用现有的鉴权逻辑获取访问令牌
    const accessToken = await getAccessToken(appUrl);

    const result = await publishPagesFn({
      pagesKitYaml,
      locale,
      projectId,
      appUrl,
      accessToken,
    });

    return {
      uploadResult: result.result,
      uploadStatus: "success",
      $message: `Successfully uploaded to Pages Kit: ${JSON.stringify(result.result)}`,
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
  { pagesDir: rawPagesDir, appUrl, boardId, projectName, projectDesc, projectLogo },
  options,
) {
  const pagesDir = join(".aigne", "web-smith", TMP_DIR, TMP_PAGES_DIR);
  await fs.rm(pagesDir, { recursive: true, force: true });
  await fs.mkdir(pagesDir, {
    recursive: true,
  });
  await fs.cp(rawPagesDir, pagesDir, { recursive: true });

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
          `Start here to run your own website:\n${chalk.cyan(PAGES_KIT_STORE_URL)}\n`,
      );
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
    const { success, boardId: newBoardId } = await publishPagesFn({
      sidebarPath,
      accessToken,
      appUrl,
      boardId,
      autoCreateBoard: true,
      // Pass additional project information if available
      boardName: projectInfo.name,
      boardDesc: projectInfo.description,
      boardCover: projectInfo.icon,
      mediaFolder: rawPagesDir,
      cacheFilePath: join(".aigne", "web-smith", "upload-cache.yaml"),
      boardMeta,
    });

    // Save values to config.yaml if publish was successful
    if (success) {
      // Save appUrl to config only when not using environment variable
      if (!useEnvAppUrl) {
        await saveValueToConfig("appUrl", appUrl);
      }

      // Save boardId to config if it was auto-created
      if (boardId !== newBoardId) {
        await saveValueToConfig("boardId", newBoardId);
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
    boardId: {
      type: "string",
      description: "The id of the board",
    },
  },
};

publishPages.description = "Publish the pages to Pages Kit";
