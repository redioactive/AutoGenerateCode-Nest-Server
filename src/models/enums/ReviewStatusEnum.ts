// export enum ReviewStatusEnum {
//   REVIEWING = 0, // 待审核
//   PASS = 1, // 通过
//   REJECT = 2, // 拒绝
// }
//
// /**
//  * 获取所有枚举值
//  * @returns number[]
//  */
// export const getReviewStatusValues = (): number[] => {
//   return Object.values(ReviewStatusEnum).filter(value => typeof value === 'number') as number[];
// };


export enum ReviewStatusEnum {
  REVIEWING = 0, // 待审核
  PASS = 1,      // 通过
  REJECT = 2,    // 拒绝
}

export const ReviewStatusEnumText = {
  [ReviewStatusEnum.REVIEWING]: '待审核',
  [ReviewStatusEnum.PASS]: '通过',
  [ReviewStatusEnum.REJECT]: '拒绝',
};

export namespace ReviewStatusEnum {
  // Returns an array of the numeric values from the enum
  export function getValues(): number[] {
    return Object.values(ReviewStatusEnum)
      .filter((value): value is number => typeof value === 'number');
  }

  // Returns an array of text descriptions corresponding to the enum values
  export function getTexts(): string[] {
    return getValues().map(value => ReviewStatusEnumText[value]);
  }

  // Returns the text description for a specific enum value
  export function getText(value: number): string {
    return ReviewStatusEnumText[value];
  }
}