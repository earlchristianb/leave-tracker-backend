import { Module } from '@nestjs/common';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from './entities/leave.entity';
import { User } from 'src/user/entities/user.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { OrgLeaveType } from 'src/organization/entities/organization-leave-type.entity';

@Module({
  imports: [
    UserModule,
    OrganizationModule,
    TypeOrmModule.forFeature([Leave, User, OrgLeaveType]),
  ],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}
