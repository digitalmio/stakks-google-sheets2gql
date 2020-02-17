import parseSheetData from './parseSheetData';
import data from './__snapshots__/parseSheetData.input';

describe('Google API module', () => {
  it('should parse data for the Google data array', () => {
    expect(parseSheetData(data)).toMatchSnapshot();
  });
});
