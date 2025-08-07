// src/main.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load STAGE from root .env
dotenv.config();

// Then load specific env file from env/.env.{STAGE}
const stage = process.env.STAGE || 'local';
dotenv.config({
  path: path.resolve(process.cwd(), `env/.env.${stage}`),
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Lost in Europe API')
    .setDescription('API documentation for Lost in Europe')
    .setVersion('1.0')
    .addBearerAuth() // Optional: if using JWT Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI at /api

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
