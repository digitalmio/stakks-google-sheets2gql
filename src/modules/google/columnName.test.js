import getColumnName from './columnName';

it('convert column number to A1 notation', () => {
  expect(getColumnName(0)).toMatch('A');
  expect(getColumnName(5)).toMatch('F');
  expect(getColumnName(44)).toMatch('AS');
});
