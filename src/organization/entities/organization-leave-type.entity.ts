import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';

@Entity()
export class OrgLeaveType {
  @PrimaryGeneratedColumn("uuid")
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
    description: 'Maximum leaves allowed per year',
    required: true,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  maxLeavesPerYear: number;

  @ApiProperty({
    description: 'Monthly restriction on leaves',
    required: true,
  })
  @Column({
    type: 'int',
    nullable: true,
  })
  monthlyRestriction: number;

  @ManyToOne(() => Organization, (organization) => organization.orgLeaveTypes)
  organization: Organization;
}
