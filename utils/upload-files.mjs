import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import pLimit from "p-limit";
import pRetry from "p-retry";
import YAML from "yaml";

import { getComponentMountPoint } from "./blocklet.mjs";
import { MEDIA_KIT_DID, PAGES_KIT_DID } from "./constants.mjs";

// Type definitions removed for mjs format
// UploadFilesOptions: { appUrl, filePaths, concurrency?, accessToken, cacheFilePath? }
// UploadResult: { filePath, url }
// UploadFilesResult: { results: UploadResult[] }

// Global state for tracking ongoing uploads and their results
const ongoingUploads = new Map();
const cacheUpdateMutex = new Map();

function loadCache(cacheFilePath) {
  if (!fs.existsSync(cacheFilePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(cacheFilePath, "utf-8");
    if (!content.trim()) {
      return {};
    }

    const parsedData = YAML.parse(content);
    return parsedData || {};
  } catch (error) {
    console.warn(`Failed to load cache file: ${error}`);
    return {};
  }
}

function saveCache(cacheFilePath, cache) {
  try {
    const yamlContent = YAML.stringify(cache, {
      lineWidth: 0,
    });

    fs.writeFileSync(cacheFilePath, yamlContent, "utf-8");
  } catch (error) {
    console.warn(`Failed to save cache file: ${error}`);
  }
}

async function performSingleUpload(
  filePath,
  fileHash,
  uploadEndpoint,
  accessToken,
  _mountPoint,
  url,
) {
  const baseFilename = path.basename(filePath, path.extname(filePath));

  const fileBuffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const fileExt = path.extname(filePath).substring(1);
  const mimeType = getMimeType(filePath);

  const hashBasedFilename = `${fileHash.substring(0, 16)}.${fileExt}`;

  const uploaderId = "Uploader";
  const fileId = `${uploaderId}-${baseFilename.toLowerCase().replace(/[^a-z0-9]/g, "")}-${fileHash.substring(0, 16)}`;

  const tusMetadata = {
    uploaderId,
    relativePath: hashBasedFilename,
    name: hashBasedFilename,
    type: mimeType,
    filetype: mimeType,
    filename: hashBasedFilename,
  };

  const encodedMetadata = Object.entries(tusMetadata)
    .map(([key, value]) => `${key} ${Buffer.from(value).toString("base64")}`)
    .join(",");

  const uploadEndpointUrl = new URL(uploadEndpoint);
  const endpointPath = uploadEndpointUrl.pathname;

  const createResponse = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      "Tus-Resumable": "1.0.0",
      "Upload-Length": fileSize.toString(),
      "Upload-Metadata": encodedMetadata,
      Cookie: `login_token=${accessToken}`,
      "x-uploader-file-name": hashBasedFilename,
      "x-uploader-file-id": fileId,
      "x-uploader-file-ext": fileExt,
      "x-uploader-base-url": endpointPath,
      "x-uploader-endpoint-url": uploadEndpoint,
      "x-uploader-metadata": JSON.stringify({
        uploaderId,
        relativePath: hashBasedFilename,
        name: hashBasedFilename,
        type: mimeType,
      }),
      "x-component-did": PAGES_KIT_DID,
    },
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(
      `Failed to create upload: ${createResponse.status} ${createResponse.statusText}\n${errorText}`,
    );
  }

  const uploadUrl = createResponse.headers.get("Location");
  if (!uploadUrl) {
    throw new Error("No upload URL received from server");
  }
  const uploadResponse = await fetch(`${url.origin}${uploadUrl}`, {
    method: "PATCH",
    headers: {
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": "0",
      "Content-Type": "application/offset+octet-stream",
      Cookie: `login_token=${accessToken}`,
      "x-uploader-file-name": hashBasedFilename,
      "x-uploader-file-id": fileId,
      "x-uploader-file-ext": fileExt,
      "x-uploader-base-url": endpointPath,
      "x-uploader-endpoint-url": uploadEndpoint,
      "x-uploader-metadata": JSON.stringify({
        uploaderId,
        relativePath: hashBasedFilename,
        name: hashBasedFilename,
        type: mimeType,
      }),
      "x-component-did": PAGES_KIT_DID,
      "x-uploader-file-exist": "true",
    },
    body: fileBuffer,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(
      `Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}\n${errorText}`,
    );
  }

  const uploadResult = await uploadResponse.json();

  let uploadedFileUrl = uploadResult.url;
  if (!uploadedFileUrl && uploadResult?.size) {
    uploadedFileUrl = uploadResponse.url;
  }

  if (!uploadedFileUrl) {
    throw new Error("No URL found in the upload response");
  }

  return {
    filePath,
    url: uploadedFileUrl,
  };
}

async function updateCacheWithMutex(cacheFilePath, fileHash, filePath, uploadedUrl, siteOrigin) {
  // Wait for any ongoing cache updates for this file
  if (cacheUpdateMutex.has(cacheFilePath)) {
    await cacheUpdateMutex.get(cacheFilePath);
  }

  // Create a new mutex for this cache update
  const updatePromise = (async () => {
    const cache = loadCache(cacheFilePath);

    if (!cache[fileHash]) {
      cache[fileHash] = {
        local_path: path.relative(process.cwd(), filePath),
        sites: {},
      };
    }

    cache[fileHash].sites[siteOrigin] = {
      url: uploadedUrl,
      upload_time: new Date().toISOString(),
    };

    saveCache(cacheFilePath, cache);
  })();

  cacheUpdateMutex.set(cacheFilePath, updatePromise);

  try {
    await updatePromise;
  } finally {
    cacheUpdateMutex.delete(cacheFilePath);
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".txt": "text/plain",
    ".json": "application/json",
    ".xml": "application/xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".7z": "application/x-7z-compressed",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

export async function uploadFiles(options) {
  const { appUrl, filePaths, endpoint, concurrency = 5, accessToken, cacheFilePath } = options;

  if (filePaths.length === 0) {
    return { results: [] };
  }

  // Load initial cache
  let cache = {};
  if (cacheFilePath) {
    cache = loadCache(cacheFilePath);
  }

  const url = new URL(appUrl);
  const mountPoint = await getComponentMountPoint(appUrl, MEDIA_KIT_DID);

  // default upload to media kit endpoint
  const uploadEndpoint = endpoint || `${url.origin}${mountPoint}/api/uploads`;

  const limit = pLimit(concurrency);

  const uploadPromises = filePaths.map((filePath) =>
    limit(async () => {
      const filename = path.basename(filePath);

      try {
        const fileBuffer = fs.readFileSync(filePath);
        const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        // Check if this file is already being uploaded
        const existingUpload = ongoingUploads.get(fileHash);
        if (existingUpload) {
          const result = await existingUpload;
          // Return a new result with the correct filePath for this request
          return {
            filePath,
            url: result.url,
          };
        }

        // Check cache first
        if (cacheFilePath && cache[fileHash]) {
          const siteOrigin = url.origin;
          const cachedEntry = cache[fileHash];
          if (cachedEntry.sites[siteOrigin]) {
            return {
              filePath,
              url: cachedEntry.sites[siteOrigin].url,
            };
          }
        }

        // Create upload promise and cache it
        const uploadPromise = (async () => {
          try {
            const result = await pRetry(
              () =>
                performSingleUpload(
                  filePath,
                  fileHash,
                  uploadEndpoint,
                  accessToken,
                  mountPoint,
                  url,
                ),
              {
                retries: 3,
                onFailedAttempt: (error) => {
                  console.warn(
                    `File upload attempt ${error.attemptNumber} failed for "${filename}". Remaining retries: ${error.retriesLeft}`,
                  );
                  if (error.retriesLeft === 0) {
                    console.error(
                      `File upload failed - all retry attempts exhausted for "${filename}"`,
                    );
                  }
                },
              },
            );

            // Update cache asynchronously with mutex
            if (cacheFilePath) {
              updateCacheWithMutex(cacheFilePath, fileHash, filePath, result.url, url.origin).catch(
                (error) => console.warn(`Failed to update cache: ${error}`),
              );
            }

            return result;
          } catch (error) {
            console.error(
              `File upload failed - error uploading "${filename}" after all retries:`,
              error,
            );
            return {
              filePath,
              url: "",
            };
          }
        })();

        // Cache the upload promise
        ongoingUploads.set(fileHash, uploadPromise);

        try {
          const result = await uploadPromise;
          // Return result with correct filePath for this specific request
          return {
            filePath,
            url: result.url,
          };
        } finally {
          // Clean up the ongoing upload tracking
          ongoingUploads.delete(fileHash);
        }
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        return {
          filePath,
          url: "",
        };
      }
    }),
  );

  const uploadResults = await Promise.all(uploadPromises);

  return { results: uploadResults };
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
export async function batchUploadMediaFiles({
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
    if (media.mediaKitPath && media.path && allUsedMediaKitUrls.has(media.mediaKitPath)) {
      filesToUpload.push(media);
    }
  });

  // 如果没有需要上传的文件，返回空映射
  if (filesToUpload.length === 0) {
    return {};
  }

  try {
    // 批量上传文件
    const uploadFilePaths = filesToUpload.map((file) => path.resolve(rootDir, file.path));

    const uploadResults = await uploadFiles({
      appUrl,
      filePaths: uploadFilePaths,
      accessToken,
      concurrency: 3,
      cacheFilePath: path.join(outputDir, "_upload-cache.yaml"),
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
