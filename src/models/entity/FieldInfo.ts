import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 字段信息实体
 * @TableName field_info
 */
@Entity('field_info')
export class FieldInfo {

  /**
   * id
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 名称
   */
  @Column()
  name: string;

  /**
   * 字段名称
   */
  @Column()
  fieldName: string;

  /**
   * 内容
   */
  @Column()
  content: string;

  /**
   * 状态（0-待审核, 1-通过, 2-拒绝）
   */
  @Column({ type: 'int' })
  reviewStatus: number;

  /**
   * 审核信息
   */
  @Column({ nullable: true })
  reviewMessage: string;

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
   * 是否删除
   */
  @Column({ default: 0 }) // Assuming 0 means not deleted
  isDelete: number;

}
