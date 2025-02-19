export enum StatusEnum {
  DEFAULT = 0, //未处理
  HANDLER = 1, //已处理
}
/**
 * 获取所有枚举值
 * @returns number[]
 * */
export const ReportStatusEnum = {
  // return Object.values(StatusEnum).filter(value => typeof value === 'number') as number[];
  values:():number[] => {
    return Object.values(StatusEnum).filter(value => typeof value === 'number') as number[];
  },
  DEFAULT:():number => {
    return StatusEnum.DEFAULT;
  }
}