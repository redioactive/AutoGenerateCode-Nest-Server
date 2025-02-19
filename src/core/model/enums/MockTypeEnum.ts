export enum MockTypeEnum {
  NONE = '不模拟',
  INCREASE = '递增',
  FIXED = '固定',
  RANDOM = '随机',
  RULE = '规则',
  DICT = '词库',
}

export class MockTypeEnumUtil {
  /**
   * 获取所有值列表
   * @returns string[]
   */
  static getValues(): string[] {
    return Object.values(MockTypeEnum);
  }

  /**
   * 根据值获取枚举键
   * @param value 枚举的字符串值
   * @returns MockTypeEnum | null
   */
  static getEnumByValue(value: string): MockTypeEnum | null {
    if (!value?.trim()) {
      return null;
    }
    return (
      Object.keys(MockTypeEnum)
        .find((key) => MockTypeEnum[key as keyof typeof MockTypeEnum] === value) as MockTypeEnum
    ) || null;
  }
}
