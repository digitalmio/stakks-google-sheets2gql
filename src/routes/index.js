import { status, statusSchema } from './status';

export default server => {
  // status route
  server.get('/status', statusSchema, status);

  // stacks
  // server.get('/:stack/:key');
};
