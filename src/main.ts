import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
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
  setupSwagger(app);
  await app.listen(4200);
}
bootstrap();
