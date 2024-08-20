import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Team } from './entities/team.entity';
import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User, Team]),
    OrganizationModule,
    UserModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
