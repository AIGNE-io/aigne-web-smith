/**
 * Recursively scan for protocol values in an object
 * @param {any} obj - The object to scan
 * @param {Set} foundUrls - Set of found protocol URLs
 * @param {string} protocol - The protocol to scan for (e.g., MEDIA_KIT_PROTOCOL or LINK_PROTOCOL)
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
 * Validate internal links in page data against an allowed list
 * @param {any} pageData - Page data object
 * @param {Set<string>} allowedLinks - Set of allowed links
 * @param {string} protocol - The protocol to scan for (e.g., LINK_PROTOCOL)
 * @returns {Array<{path: string, message: string, code: string}>} List of validation errors
 */
export function validateInternalLinks(pageData, allowedLinks, protocol) {
  const errors = [];
  const foundLinks = new Set();

  // Scan all internal links in page data
  scanForProtocolUrls(pageData, foundLinks, protocol);

  // Validate each link against the allowed list
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
 * Validate media resources in page data against an allowed list
 * @param {any} pageData - Page data object
 * @param {Set<string>} allowedMediaFiles - Set of allowed media files
 * @param {string} protocol - The protocol to scan for (e.g., MEDIA_KIT_PROTOCOL)
 * @returns {Array<{path: string, message: string, code: string}>} List of validation errors
 */
export function validateMediaResources(pageData, allowedMediaFiles, protocol) {
  const errors = [];
  const foundMediaUrls = new Set();

  // Scan all media resources in page data
  scanForProtocolUrls(pageData, foundMediaUrls, protocol);

  // Validate each media resource against the allowed list
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
 * Build allowed links set from website structure
 * @param {Array} websiteStructure - Website structure array
 * @param {string} locale - Language code
 * @param {Function} getFileName - Function to get file name
 * @returns {Set<string>} Set of allowed links
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
 * Build allowed media files set from media files list
 * @param {Array} mediaFiles - Media files array
 * @returns {Set<string>} Set of allowed media files
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
