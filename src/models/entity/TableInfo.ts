import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * 表信息
 * @TableName table_info
 */
@Entity('table_info')
export class TableInfo {

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
  @Column()
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
   * 是否删除（逻辑删除）
   */
  @DeleteDateColumn()
  isDelete: Date;

}
