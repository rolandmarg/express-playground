import 'dotenv/config';
import app from './app';
import { createConnection } from 'typeorm';
import entities from './entity';
import env from './env';

async function bootstrap() {
  await createConnection({
    type: 'postgres',
    url: env.DB_URL,
    synchronize: env.NODE_ENV !== 'production',
    entities,
    logging: ['info'],
  });

  app.listen(3000);
}

bootstrap();
