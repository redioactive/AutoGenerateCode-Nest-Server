/**
 * 工具函数 - 字符串处理
 */

/**
 * 将字符串转换为驼峰命名法 (camelCase)
 * @param str 需要转换的字符串
 * @param capitalizeFirst 是否首字母大写（默认 false）
 * @returns 转换后的字符串
 */
export function toCamelCase(str: string, capitalizeFirst: boolean = false): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')) // 处理 - _ 和空格
    .replace(/^\w/, (first) => (capitalizeFirst ? first.toUpperCase() : first.toLowerCase())); // 控制首字母大小写
}
