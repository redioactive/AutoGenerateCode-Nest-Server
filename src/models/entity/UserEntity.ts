import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  /**
   * id
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户昵称
   */
  @Column({ length: 255 })
  userName: string;

  /**
   * 账号
   */
  @Column({ unique: true, length: 255 })
  userAccount: string;

  /**
   * 用户头像
   */
  @Column({ nullable: true })
  userAvatar: string;

  /**
   * 性别
   */
  @Column({ type: 'int', nullable: true })
  gender: number;

  /**
   * 用户角色: user, admin
   */
  @Column({ length: 50 })
  userRole: string;

  /**
   * 密码
   */
  @Column()
  userPassword: string;

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
   * 软删除
   */
  @DeleteDateColumn()
  isDelete?: Date;
}
