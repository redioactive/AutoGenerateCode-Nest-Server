import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 用户姓名
  @Column({ nullable: false })
  name: string;

  // 用户账号，唯一索引
  @Column({ unique: true, nullable: false })
  userAccount: string;

  // 用户邮箱，唯一索引
  @Column({ unique: true, nullable: false })
  email: string;

  // 用户密码（用于登录认证），请确保在保存前加密处理
  @Column({ nullable: false })
  userPassword: string;

  // 用户角色描述（例如：普通用户、VIP用户等，可以根据业务需要使用）
  @Column({ nullable: true })
  userRole: string;

  // 用户权限角色（例如：admin、user 等，用于权限判断）
  @Column({ nullable: false })
  role: string;

  // 创建时间（自动生成）
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 更新时间（自动更新）
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}