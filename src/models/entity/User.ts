// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn, Index
// } from 'typeorm';
//
// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   // 用户姓名
//   @Column({ nullable: false })
//   name: string;
//
//   // 用户账号，唯一索引
//   @Column({ unique: true, nullable: false })
//   userAccount: string;
//
//   // 用户邮箱，唯一索引
//   // @Column({ unique: true, nullable: false })
//   // email: string;
//   @Index({ unique: true })
//   @Column({ type: 'varchar', length: 100, nullable: false, default: '' })
//   email: string;
//
//   // 用户密码（用于登录认证），请确保在保存前加密处理
//   @Column({ nullable: false })
//   userPassword: string;
//
//   // 用户角色描述（例如：普通用户、VIP用户等，可以根据业务需要使用）
//   @Column({ nullable: true })
//   userRole: string;
//
//   // 用户权限角色（例如：admin、user 等，用于权限判断）
//   @Column({ nullable: false })
//   role: string;
//
//   // 创建时间（自动生成）
//   @CreateDateColumn({ type: 'timestamp' })
//   createdAt: Date;
//
//   // 更新时间（自动更新）
//   @UpdateDateColumn({ type: 'timestamp' })
//   updatedAt: Date;
// }


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users') // 指定数据库中表名为 `users`
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  //sub 用于校验 Jwt
  @Column()
  sub:number;

  // 用户姓名
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // 用户账号，唯一索引
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  userAccount: string;

  // 用户邮箱，唯一索引
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: true, })
  email: string;

  // 用户密码（登录认证前请加密处理）
  @Column({ type: 'varchar', length: 255, nullable: false })
  userPassword: string;

  // 用户角色描述（例如：普通用户、VIP 用户等，可选字段）
  @Column({ type: 'varchar', length: 100, nullable: true })
  userRole: string;

  // 用户权限角色（例如：admin、user 等，用于权限判断）
  @Column({ type: 'varchar', length: 50, nullable: false })
  role: string;

  // 创建时间（自动生成）
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // 更新时间（自动更新）
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}