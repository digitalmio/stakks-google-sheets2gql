import google from '../modules/google';

export const statusSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        a: { type: 'object' }
      }
    }
  }
};

export const status = async (request, reply) => {
  const a = await google().getAllSheetData('1zZM8isIi3I1sL3RCgcTxNuJLf3klWUX5pFT8Reub3gc');
  return { status: 'ok', a };
};
