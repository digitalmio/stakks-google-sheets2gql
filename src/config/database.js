import knex from 'knex';

const {
  DB_HOST: host = '127.0.0.1',
  DB_PORT: port = 5432,
  DB_USER: user,
  DB_PASS: password,
  DB_DATABASE: database = 'stakks'
} = process.env;

export const dbConfig = knex({
  client: 'pg',
  connection: {
    host,
    user,
    password,
    database
  }
});
