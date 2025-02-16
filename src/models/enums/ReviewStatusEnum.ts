export enum ReviewStatusEnum {
  REVIEWING = 0, // 待审核
  PASS = 1, // 通过
  REJECT = 2, // 拒绝
}

/**
 * 获取所有枚举值
 * @returns number[]
 */
export const getReviewStatusValues = (): number[] => {
  return Object.values(ReviewStatusEnum).filter(value => typeof value === 'number') as number[];
};
