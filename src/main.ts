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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
