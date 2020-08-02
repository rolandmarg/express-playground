import app from './app';
import { createConnection } from 'typeorm';
import entities from './entity';

async function bootstrap() {
  await createConnection({
    type: 'postgres',
    url: process.env.DB_URL,
    synchronize: process.env.NODE_ENV !== 'production',
    entities,
  });

  app.listen(3000);
}

bootstrap();
