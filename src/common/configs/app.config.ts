import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class AppConfig {
  @IsNotEmpty()
  @Value('POSTGRES_URL')
  dbUrl: string;

  @IsNotEmpty()
  @Value('REQUEST_ORIGIN')
  requestOrigin: string;

  @IsNotEmpty()
  @Value('JWKS_URI')
  jwksUri: string;
}
