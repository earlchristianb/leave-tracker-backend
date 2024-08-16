export default () => ({
  DB_NAME: process.env.POSTGRES_DB,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,
  DB_USER: process.env.POSTGRES_USER,
});
