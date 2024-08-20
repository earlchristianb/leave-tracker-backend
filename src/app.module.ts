import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config';
import { ConfigifyModule } from '@itgorillaz/configify';
import { AppConfig } from './common/configs/app.config';
import { OrganizationModule } from './organization/organization.module';
import { Organization } from './organization/entities/organization.entity';
import { OrgLeaveType } from './organization/entities/organization-leave-type.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { LeaveModule } from './leave/leave.module';
import { Leave } from './leave/entities/leave.entity';
import { TeamModule } from './team/team.module';
import { Team } from './team/entities/team.entity';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { JwtAuthGuard } from './common/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      imports: [ConfigifyModule],
      extraProviders: [],
      useFactory: (appConfig: AppConfig) => ({
        type: 'postgres',
        url: appConfig.dbUrl,
        ssl: true,
        logging: true,
        entities: [Organization, OrgLeaveType, User, Leave, Team],
        synchronize: true,
      }),
    }),
    JwtModule.register({
      global: true,
    }),
    OrganizationModule,
    UserModule,
    LeaveModule,
    TeamModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
