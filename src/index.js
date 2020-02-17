import fastify from 'fastify';
import { Model } from 'objection';
import { dbConfig } from './config/database';
import { genReqId } from './helpers/generateReqId';
import routes from './routes';

// define server and its config
const server = fastify({
  logger: true,
  genReqId
});

// load env variables and define server port
const serverPort = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// setup globally the database
Model.knex(dbConfig);

// set plugins
server.register(require('fastify-cors'));
server.register(require('fastify-favicon'));

// append request ID header to response
server.addHook('onSend', async (req, reply, payload) => {
  reply.header('request-id', req.id);
  return payload;
});

// define all routes
routes(server);

// run server async, so we have to do some gymnastics
const start = async () => {
  try {
    await server.listen(serverPort);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// go go go!
start();
