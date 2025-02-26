import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 词库实体
 */
@Entity('dict')
export class Dict {
  /**
   * id（自动递增）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 词库名称
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * 词库内容
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * 状态（0-待审核, 1-通过, 2-拒绝）
   */
  @Column({ type: 'int', default: 0 })
  reviewStatus: number;

  /**
   * 审核信息
   */
  @Column({ type: 'text', nullable: true })
  reviewMessage?: string;

  /**
   * 词库值
   * */
  @Column({ type: 'varchar', length: 255 })
  value:string;
  /**
   * 创建用户 id
   */
  @Column({ type: 'bigint',name:'user_id' })
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
   * 是否删除（软删除标识）
   */
  @Column({ type: 'boolean', default: false })
  isDelete: boolean;
}
