import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

//数据类型
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
  userRole: string;
}
