import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'admin' }) // Phân quyền: admin, manager
  role: string;
}
