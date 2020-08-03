import app from './app';
import { createConnection } from 'typeorm';
import entities from './entity';
import { DB_URL, NODE_ENV } from './env';

async function bootstrap() {
  await createConnection({
    type: 'postgres',
    url: DB_URL,
    synchronize: NODE_ENV !== 'production',
    entities,
    logging: ['info'],
  });

  app.listen(3000);
}

bootstrap();
