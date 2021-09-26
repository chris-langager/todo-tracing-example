export const ENV = {
  PORT: process.env.RUN_PORT || '3000',
  POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL || 'postgres://user:password@postgres:5432/postgres',
};
