import 'dotenv/config';
import * as app from './app';
import * as db from './db';

async function bootstrap() {
  try {
    await db.connect();

    app.start();

    console.info('server up and running');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    await db.close();

    app.stop();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

process.on('SIGINT', shutdown);

process.on('SIGTERM', shutdown);

process.on('unhandledRejection', shutdown);

bootstrap();
