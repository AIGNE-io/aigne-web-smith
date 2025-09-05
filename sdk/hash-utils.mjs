import { createHash } from "node:crypto";

/**
 * 计算中间格式文件的 hash 值
 * @param {Array} middleFormatFiles - 中间格式文件数组
 * @returns {string} - MD5 hash 值
 */
export function calculateMiddleFormatHash(middleFormatFiles) {
  return createHash('md5')
    .update(JSON.stringify(middleFormatFiles, null, 0))
    .digest('hex');
}