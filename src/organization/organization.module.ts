import { forwardRef, Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrgLeaveType } from './entities/organization-leave-type.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Team } from 'src/team/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrgLeaveType, User, Team]),
    UserModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
