import StackData from '../models/stackData';

export const statusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' }
      }
    }
  }
};

export const status = async (request, reply) => {
  const [{ count }, ...rest] = await Staks.query().count('id');

  return reply.send({
    connection: parseInt(count) >= 0 ? 'ok' : 'error'
  });
};
