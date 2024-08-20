import { OrgLeaveType } from 'src/organization/entities/organization-leave-type.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.leaves)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => OrgLeaveType, (orgLeaveType) => orgLeaveType.leaves)
  leaveType: OrgLeaveType;

  @Column('simple-array')
  dates: string[];

  @Column()
  fileLink: string;

  @Column({
    nullable: true,
  })
  reason?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_At: Date;
}
