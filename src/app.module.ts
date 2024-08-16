import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { ConfigifyModule } from '@itgorillaz/configify';
import { DBConfig } from './config/db.config';
import { OrganizationModule } from './organization/organization.module';
import { Organization } from './organization/entities/organization.entity';
import { OrgLeaveType } from './organization/entities/organization-leave-type.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [DBConfig],
      imports: [ConfigifyModule],
      extraProviders: [],
      useFactory: (dbConfig: DBConfig) => ({
        type: 'postgres',
        url: dbConfig.dbUrl,
        ssl: true,
        logging: true,
        entities: [Organization, OrgLeaveType],
        synchronize: true,
      }),
    }),

    OrganizationModule,
  ],
})
export class AppModule {}
