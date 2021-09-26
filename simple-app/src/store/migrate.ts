import * as path from 'path';

import * as marv from 'marv/api/promise';
import * as driver from 'marv-pg-driver';
import { ENV } from '../env';

const directory = path.resolve('migrations');
const connection = {
  connectionString: ENV.POSTGRES_DATABASE_URL,
};

export async function migrate() {
  const migrations = await marv.scan(directory);
  await marv.migrate(migrations, driver({ connection }));
}
