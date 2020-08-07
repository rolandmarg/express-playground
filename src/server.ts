import 'dotenv/config';
import app from './app';
import { connect } from './db';

async function bootstrap() {
  try {
    await connect();

    app.listen(3000);

    console.info('server up and running');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

bootstrap();
