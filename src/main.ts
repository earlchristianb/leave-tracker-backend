import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false, //set true when in production
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');
  const corsOptions: CorsOptions = {
    origin: '*', // Allow access from anywhere
  };
  app.enableCors(corsOptions);
  setupSwagger(app);
  await app.listen(4200);
}
bootstrap();
