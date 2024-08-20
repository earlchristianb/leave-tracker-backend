import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { Organization } from 'src/organization/entities/organization.entity';
import { OrgLeaveType } from 'src/organization/entities/organization-leave-type.entity';
import { Team } from 'src/team/entities/team.entity';
import { Leave } from 'src/leave/entities/leave.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, OrgLeaveType, Team, Leave]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
