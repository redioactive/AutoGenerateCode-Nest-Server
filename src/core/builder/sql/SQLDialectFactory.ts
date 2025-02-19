import {SQLDialect} from './SQLDialect';
import {MySQLDialect} from './MySQLDialect';

/**
 * SQL 方言工厂
 * 采用工厂 + 单例模式，降低开销
 *
 * @author https://github.com/liyupi
 */
export class SQLDialectFactory {
  /**
   * 方言实例映射 (className -> 实例)
   */
  private static readonly DIALECT_POOL: Map<string, SQLDialect> = new Map();

  private constructor() {}

  /**
   * 获取方言实例
   * @param dialectClass SQLDialect 子类的构造函数
   */
  static getDialect<T extends SQLDialect>(dialectClass:new () => T): T{
    const className = dialectClass.name;
    if (!this.DIALECT_POOL.has(className)) {
      this.DIALECT_POOL.set(className, new dialectClass());
    }
    return this.DIALECT_POOL.get(className) as T;
  }

  /**
   * 创建 SQL 方言实例
   * @param className 类名
   * @returns SQLDialect 实例
   */
  private static createDialect(className: string): SQLDialect {
    try {
      switch (className) {
        case 'MySQLDialect':
          return new MySQLDialect();
        default:
          throw new Error(`未找到 SQL 方言: ${className}`);
      }
    } catch (error) {
      throw new Error(`创建 SQL 方言失败: ${error}`);
    }
  }
}
