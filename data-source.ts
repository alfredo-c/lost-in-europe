import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: './env/.env.local' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
