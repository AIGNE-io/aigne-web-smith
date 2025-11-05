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
