import nJWT from 'njwt';
import got from 'got';
import qs from 'qs';

import redis from '../../config/redis';
import parseSheetData from './parseSheetData';

export default () => {
  const apiBaseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/';
  const googleJsonData = require('../../../google-service-account');

  /**
   * Gets token from cache or from Google oAuth endpoint
   */
  const getToken = async () => {
    try {
      // check if we have token cached
      const cachedToken = await redis.get('googleAccessToken');
      if (cachedToken) {
        return cachedToken;
      }

      console.log('Gathering new AccessToken from Google API.');

      // if not, let's get one from Google
      const claims = {
        iss: googleJsonData.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token'
      };

      const privateKey = googleJsonData.private_key;
      const created_jwt = nJWT.create(claims, privateKey, 'RS256');

      const { access_token: accessToken } = await got
        .post('https://oauth2.googleapis.com/token', {
          json: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: created_jwt.compact()
          }
        })
        .json();

      // cache token for just under 1 hour
      await redis.set('googleAccessToken', accessToken, 'EX', 3500);
      return accessToken;
    } catch (e) {
      throw Error(e);
    }
  };

  const getSheetInfo = async sheetId => {
    try {
      const accessToken = await getToken();
      return await got.get(`${apiBaseUrl}${sheetId}?access_token=${accessToken}`).json();
    } catch (e) {
      throw Error(e);
    }
  };

  const getAllSheetData = async sheetId => {
    try {
      const accessToken = await getToken();
      const sheetNamesReq = await getSheetInfo(sheetId);
      const sheetNames = sheetNamesReq.sheets.map(el => el.properties.title);
      const sheetQs = qs.stringify({ ranges: sheetNames }, { arrayFormat: 'repeat' });

      const dataReq = await got
        .get(`${apiBaseUrl}${sheetId}/values:batchGet?${sheetQs}&access_token=${accessToken}`)
        .json();
      return parseSheetData(dataReq.valueRanges);
    } catch (e) {
      throw Error(e);
    }
  };

  return {
    getToken,
    getSheetInfo,
    getAllSheetData
  };
};
