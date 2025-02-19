export enum MockParamsRandomTypeEnum {
  STRING = '字符串',
  NAME = '人名',
  CITY = '城市',
  URL = '网址',
  EMAIL = '邮箱',
  IP = 'IP',
  INTEGER = '整数',
  DECIMAL = '小数',
  UNIVERSITY = '大学',
  DATE = '日期',
  TIMESTAMP = '时间戳',
  PHONE = '手机号',
  NUMBER = '数字'
}

// 获取所有枚举值的列表
export function getMockParamsValues(): string[] {
  return Object.values(MockParamsRandomTypeEnum);
}

// 根据 value 获取相应的枚举类型
export function getEnumByValue(value: string | undefined): MockParamsRandomTypeEnum | null {
  if (!value) {
    return null;
  }
  const enumValue = Object.values(MockParamsRandomTypeEnum).find(
    (type) => type === value,
  );
  return enumValue || null;
}
