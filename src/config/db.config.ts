import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class DBConfig {
  @IsNotEmpty()
  @Value('POSTGRES_URL')
  dbUrl: string;  
  @IsNotEmpty()
  @Value('POSTGRES_DB')
  dbName: string;
  @IsNotEmpty()
  @Value('POSTGRES_USER')
  @IsNotEmpty()
  dbUser: string;
  @Value('POSTGRES_PASSWORD')
  dbPassword: string;
}
