import {Injectable} from '@nestjs/common';
import { getEnumByValue, MockParamsRandomTypeEnum } from '../../model/enums/MockParamsRandom';
import {faker} from '@faker-js/faker';
import {Field} from '../../schema/TableSchema';

// 生成随机数据的工具类
class FakerUtils {
  static getRandomValue(type: MockParamsRandomTypeEnum): string {
    switch (type) {
      case MockParamsRandomTypeEnum.STRING:
        return faker.word.sample();  // 使用 faker.lorem 生成字符串
      case MockParamsRandomTypeEnum.NAME:
        return faker.person.fullName();  // 使用 faker.name 生成人名
      case MockParamsRandomTypeEnum.CITY:
        return faker.location.city();  // 使用 faker.address 生成城市
      case MockParamsRandomTypeEnum.URL:
        return faker.internet.url();  // 使用 faker.internet 生成网址
      case MockParamsRandomTypeEnum.EMAIL:
        return faker.internet.email();  // 使用 faker.internet 生成邮箱
      case MockParamsRandomTypeEnum.IP:
        return faker.internet.ip();  // 使用 faker.internet 生成 IP
      case MockParamsRandomTypeEnum.INTEGER:
        return faker.number.int().toString();  // 使用 faker.datatype 生成整数
      case MockParamsRandomTypeEnum.DECIMAL:
        return faker.number.float().toString();  // 使用 faker.datatype 生成小数
      case MockParamsRandomTypeEnum.UNIVERSITY:
        return faker.location.city();  // 使用 faker.address 生成大学名（使用城市名称代替）
      case MockParamsRandomTypeEnum.DATE:
        return faker.date.past().toISOString();  // 使用 faker.date 生成日期
      case MockParamsRandomTypeEnum.TIMESTAMP:
        return faker.date.recent().getTime().toString();  // 使用 faker.date 生成时间戳
      case MockParamsRandomTypeEnum.PHONE:
        return faker.phone.number();  // 使用 faker.phone 生成手机号
      case MockParamsRandomTypeEnum.NUMBER:
        return faker.number.int().toString()  // 使用 faker.datatype 生成数字
      default:
        return faker.lorem.word();  // 默认生成字符串
    }
  }
}

@Injectable()
export class RandomDataGenerator {
  doGenerate(field:Field,rowNum:number):Promise<string[]> {
    const mockParams = field.mockParams;
    const list:string[] = [];

    for(let i = 0; i< rowNum; i++) {
      //根据字段的mockParams 值获取随机类型
      const randomTypeEnum = getEnumByValue(mockParams) || MockParamsRandomTypeEnum.STRING; //默认是字符串

      //根据类型生成随机值
      const randomString = FakerUtils.getRandomValue(randomTypeEnum);
      list.push(randomString)
    }
    return Promise.resolve(list);
  }
}