import { Leave } from 'src/leave/entities/leave.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Team } from 'src/team/entities/team.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({
    unique: true,
  })
  id: string;

  @Column({
    nullable: false,
    length: 100,
  })
  name: string;

  @Column({
    nullable: false,
    length: 100,
  })
  email: string;

  @Column({
    nullable: false,
  })
  role: string;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  //TODO: Add Team relationship after team enities are created

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  @ManyToOne(() => Team, (team) => team.users)
  team: Team;

  @OneToMany(() => Leave, (leave) => leave.createdBy)
  leaves: Leave[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  nameToTitleCase() {
    this.name = this.name
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
