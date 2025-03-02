import {customFaker} from './CustomFaker';
import {MockParamsRandomTypeEnum} from '../model/enums/MockParamsRandom';

export class FakerUtils {
  private static readonly DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

  /**
   * 获取随机值
   * @param randomTypeEnum
   * @returns 随机值
   */
  static getRandomValue(randomTypeEnum?: MockParamsRandomTypeEnum): string {
    const defaultValue = customFaker.string.alphanumeric({ length: { min: 2, max: 6 } });
    if (!randomTypeEnum) {
      return defaultValue;
    }
    switch (randomTypeEnum) {
      case MockParamsRandomTypeEnum.NAME:
        return customFaker.person.fullName();
      case MockParamsRandomTypeEnum.CITY:
        return customFaker.location.city();
      case MockParamsRandomTypeEnum.EMAIL:
        return customFaker.internet.email();
      case MockParamsRandomTypeEnum.URL:
        return customFaker.internet.url();
      case MockParamsRandomTypeEnum.IP:
        return customFaker.internet.ip();
      case MockParamsRandomTypeEnum.INTEGER:
        return customFaker.number.int().toString();
      case MockParamsRandomTypeEnum.DECIMAL:
        return customFaker.number.float({ min: 0, max: 100000 }).toString();
      case MockParamsRandomTypeEnum.UNIVERSITY:
        return customFaker.company.name();
      case MockParamsRandomTypeEnum.DATE:
        return customFaker.date
          .between({ from: '2022-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' })
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19);
      case MockParamsRandomTypeEnum.TIMESTAMP:
        return customFaker.date
          .between({ from: '2022-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' })
          .getTime()
          .toString();
      case MockParamsRandomTypeEnum.PHONE:
        return customFaker.phone.number();
      default:
        return defaultValue;
    }
  }
}

// 测试代码
console.log(FakerUtils.getRandomValue(MockParamsRandomTypeEnum.NAME));