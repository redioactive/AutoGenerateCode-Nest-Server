import { Injectable } from '@nestjs/common';
import { MockTypeEnum } from '../../model/enums/MockTypeEnum';
import { DataGenerator,DefaultDataGenerator,FixedDataGenerator,RandomDataGenerator,DictDataGenerator,IncreaseDataGenerator } from '../MainGenerator';

@Injectable()
export class DataGeneratorFactory {
  private readonly mockTypeDataGeneratorMap: Map<MockTypeEnum, DataGenerator>;

  constructor(
    private readonly defaultDataGenerator: DefaultDataGenerator,
    private readonly fixedDataGenerator: FixedDataGenerator,
    private readonly randomDataGenerator: RandomDataGenerator,
    private readonly dictDataGenerator: DictDataGenerator,
    private readonly increaseDataGenerator: IncreaseDataGenerator
  ) {
    this.mockTypeDataGeneratorMap = new Map<MockTypeEnum, DataGenerator>([
      [MockTypeEnum.NONE, this.defaultDataGenerator],
      [MockTypeEnum.FIXED, this.fixedDataGenerator],
      [MockTypeEnum.RANDOM, this.randomDataGenerator],
      [MockTypeEnum.DICT, this.dictDataGenerator],
      [MockTypeEnum.INCREASE, this.increaseDataGenerator]
    ]);
  }

  public async getGenerator(mockTypeEnum: MockTypeEnum): Promise<DataGenerator> {
    return this.mockTypeDataGeneratorMap.get(mockTypeEnum) ?? this.mockTypeDataGeneratorMap.get(MockTypeEnum.NONE)!;
  }
}