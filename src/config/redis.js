import Redis from 'ioredis';

const {
  REDIS_PORT: port = 6379,
  REDIS_HOST: host = '127.0.0.1',
  REDIS_PASS: password,
  REDIS_DB: db = 0
} = process.env;

export default new Redis({
  port,
  host,
  password,
  db
});
