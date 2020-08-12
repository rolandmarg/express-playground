import 'dotenv/config';
import { start, stop } from './app';
import { db } from './db';

async function bootstrap() {
  try {
    await db.createTables();

    start();

    console.info('server up and running');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    db.close();

    stop();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

process.on('unhandledRejection', shutdown);

bootstrap();
