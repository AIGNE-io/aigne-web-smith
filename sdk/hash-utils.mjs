import { createHash } from "node:crypto";
import { getAllFieldCombinations } from "../agents/pages-format/sdk.mjs";

/**
 * 计算中间格式文件的 hash 值
 * 基于字段组合模式而不是文件内容，避免不相关的变化导致重新生成
 * @param {Array} middleFormatFiles - 中间格式文件数组
 * @returns {string} - MD5 hash 值
 */
export function calculateMiddleFormatHash(middleFormatFiles) {
  // 获取所有字段组合模式
  const fieldCombinations = getAllFieldCombinations(middleFormatFiles);
  
  // 基于字段组合计算哈希
  return createHash('md5')
    .update(JSON.stringify(fieldCombinations, null, 0))
    .digest('hex');
}