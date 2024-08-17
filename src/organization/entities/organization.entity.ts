import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrgLeaveType } from './organization-leave-type.entity'; 
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Organization {
  @ApiProperty({
    example: uuidv4(),
    description: 'The generated uuid for the Organization',
  })
  @PrimaryGeneratedColumn('uuid'
  )
  id: string;

  @ApiProperty({
    description: 'Invite code for the organization, use to join the organization when signing up as a member',
    maxLength: 10,
    minLength: 6,
    required: true,
    uniqueItems: true,
  })
  @Column({
    nullable: false,
    unique: true,
    length: 10,
  })
  inviteCode: string;

  @ApiProperty({
    description: 'Organization name',
    maxLength: 100,
    required: true,
  })
  @Column({
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Organization description',
    maxLength: 100,
    required: true,
  })
  @Column({
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Types of leaves available in the organization',
    type: () => [OrgLeaveType],
  })
  @OneToMany(() => OrgLeaveType, (orgLeaveType) => orgLeaveType.organization, {
    cascade: true,
    eager: true,
  })
  orgLeaveTypes: OrgLeaveType[];

  // @ApiProperty({
  //   description: 'Types of leaves available in the organization',
  //   type: () => [OrgLeaveType],
  // })
  // createdBy: string;
  @ApiProperty({
    description: 'The Date when the organization was created',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The Date when the organization was last updated',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  transformCodeToUppercase() {
    this.inviteCode = this.inviteCode.toUpperCase();
  }
}
