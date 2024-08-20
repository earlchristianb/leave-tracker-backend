import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';
import { Leave } from 'src/leave/entities/leave.entity';

@Entity()
export class OrgLeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Leave name',
    maxLength: 100,
    required: true,
    uniqueItems: true,
  })
  @Column({
    nullable: false,
    unique: true,
  })
  leaveName: string;

  @ApiProperty({
    description: 'Leave description',
    maxLength: 255,
    required: true,
  })
  @Column({
    nullable: false,
  })
  leaveDescription: string;
  @ApiProperty({
    description:
      'Additional information or notes for this kind of leaves, that employees should know',
    maxLength: 500,
    required: false,
  })
  @Column({
    length: '500',
    nullable: true,
  })
  additionalInfo?: string;

  @ApiProperty({
    description: 'Is this leave type active?',
    required: false,
  })
  @Column({
    default: true,
    nullable: true,
  })
  isActive?: boolean;

  @ApiProperty({
    description:
      'Abbreviation for this type of leave to be used in the system for filed leaves',
    required: true,
  })
  @Column({
    nullable: true,
    length: 5,
  })
  abbreviation: string;

  @ApiProperty({
    description: 'Maximum allowed per year for this type of leave',
    required: true,
  })
  @Column({
    nullable: false,
  })
  maxLeavesPerYear: number;

  @ApiProperty({
    description: 'Monthly restriction on this type of leave',
  })
  @Column({
    default: 0,
    nullable: true,
  })
  monthlyRestriction?: number;

  @OneToMany(() => Leave, (leave) => leave.leaveType)
  leaves: Leave[];

  @CreateDateColumn()
  created_at: Date;

  updated_at: Date;

  @ManyToOne(() => Organization, (organization) => organization.orgLeaveTypes)
  organization: Organization;
}
