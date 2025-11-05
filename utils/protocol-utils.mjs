/**
 * 递归扫描对象中的指定协议值
 * @param {any} obj - 要扫描的对象
 * @param {Set} foundUrls - 找到的协议 URL 集合
 * @param {string} protocol - 要扫描的协议 (如 MEDIA_KIT_PROTOCOL 或 LINK_PROTOCOL)
 */
export function scanForProtocolUrls(obj, foundUrls, protocol) {
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
 * 验证页面数据中的内部跳转链接是否在允许列表中
 * @param {any} pageData - 页面数据对象
 * @param {Set<string>} allowedLinks - 允许的链接集合
 * @param {string} protocol - 要扫描的协议 (如 LINK_PROTOCOL)
 * @returns {Array<{path: string, message: string, code: string}>} 验证错误列表
 */
export function validateInternalLinks(pageData, allowedLinks, protocol) {
  const errors = [];
  const foundLinks = new Set();

  // 扫描页面数据中的所有内部链接
  scanForProtocolUrls(pageData, foundLinks, protocol);

  // 验证每个链接是否在允许列表中
  for (const link of foundLinks) {
    if (!allowedLinks.has(link)) {
      errors.push({
        path: "internal_links",
        message: `Invalid internal link: ${link}. This link is not in the allowed links list.`,
        code: "INVALID_INTERNAL_LINK",
      });
    }
  }

  return errors;
}

/**
 * 验证页面数据中的媒体资源是否在允许列表中
 * @param {any} pageData - 页面数据对象
 * @param {Set<string>} allowedMediaFiles - 允许的媒体文件集合
 * @param {string} protocol - 要扫描的协议 (如 MEDIA_KIT_PROTOCOL)
 * @returns {Array<{path: string, message: string, code: string}>} 验证错误列表
 */
export function validateMediaResources(pageData, allowedMediaFiles, protocol) {
  const errors = [];
  const foundMediaUrls = new Set();

  // 扫描页面数据中的所有媒体资源
  scanForProtocolUrls(pageData, foundMediaUrls, protocol);

  // 验证每个媒体资源是否在允许列表中
  for (const mediaUrl of foundMediaUrls) {
    if (!allowedMediaFiles.has(mediaUrl)) {
      errors.push({
        path: "media_resources",
        message: `Invalid media resource: ${mediaUrl}. This media file is not in the allowed media files list.`,
        code: "INVALID_MEDIA_RESOURCE",
      });
    }
  }

  return errors;
}

/**
 * 从网站结构构建允许的链接集合
 * @param {Array} websiteStructure - 网站结构数组
 * @param {string} locale - 语言代码
 * @param {Function} getFileName - 获取文件名的函数
 * @returns {Set<string>} 允许的链接集合
 */
export function buildAllowedLinksFromStructure(websiteStructure, locale, getFileName) {
  const allowedLinks = new Set();

  if (!websiteStructure || !Array.isArray(websiteStructure)) {
    return allowedLinks;
  }

  websiteStructure.forEach((item) => {
    // Add link protocol format
    if (item.linkPath) {
      allowedLinks.add(item.linkPath);
    }

    // Add original path
    if (item.path) {
      allowedLinks.add(item.path);
    }

    // Add processed page path (same logic as processContent in utils.mjs)
    if (item.path) {
      let processedPath = item.path;
      if (processedPath.startsWith(".")) {
        processedPath = processedPath.replace(/^\./, "");
      }
      let flatPath = processedPath.replace(/^\//, "").replace(/\//g, "-");
      flatPath = getFileName({ locale: locale || "en", fileName: flatPath });
      allowedLinks.add(flatPath);
    }
  });

  return allowedLinks;
}

/**
 * 从媒体文件数组构建允许的媒体资源集合
 * @param {Array} mediaFiles - 媒体文件数组
 * @returns {Set<string>} 允许的媒体资源集合
 */
export function buildAllowedMediaFilesFromList(mediaFiles) {
  const allowedMediaFiles = new Set();

  if (!mediaFiles || !Array.isArray(mediaFiles)) {
    return allowedMediaFiles;
  }

  mediaFiles.forEach((mediaFile) => {
    // Add mediakit protocol format
    if (mediaFile.mediaKitPath) {
      allowedMediaFiles.add(mediaFile.mediaKitPath);
    }
  });

  return allowedMediaFiles;
}
