export const ENV = {
  PORT: process.env.RUN_PORT || '3000',
  JWT_SECRET: process.env.JWT_SECRET || 'so secret',
  POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL || 'postgres://user:password@postgres:5432/postgres',
};
