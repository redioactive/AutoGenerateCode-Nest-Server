import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * 举报实体
 * @TableName report
 */
@Entity('report')
export class Report {

  /**
   * id
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 内容
   */
  @Column()
  content: string;

  /**
   * 举报实体类型（0-词库）
   */
  @Column({ type: 'int' })
  type: number;

  /**
   * 被举报对象 id
   */
  @Column()
  reportedId: number;

  /**
   * 被举报用户 id
   */
  @Column()
  reportedUserId: number;

  /**
   * 状态（0-未处理, 1-已处理）
   */
  @Column({ type: 'int' })
  status: number;

  /**
   * 创建用户 id
   */
  @Column()
  userId: number;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updateTime: Date;

  /**
   * 是否删除（逻辑删除）
   */
  @DeleteDateColumn()
  isDelete: Date;

}
