import parseGoogleData from './parseGoogleData';
import data from './__snapshots__/parseGoogleData.input';

describe('Google API module', () => {
  it('should parse data for the Google data array', () => {
    expect(parseGoogleData(data)).toMatchSnapshot();
  });
});
