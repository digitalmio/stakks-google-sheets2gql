import firstUpper from './firstUpper';

it('should format string properly for first letter uppercase', () => {
  expect(firstUpper('abc')).toMatch('Abc');
  expect(firstUpper(123)).toMatch('123');
  expect(firstUpper(' 123')).toMatch('123');
  expect(firstUpper(' maciej  z')).toMatch('Maciejz');
  expect(firstUpper('Maciej Ziehlke')).toMatch('MaciejZiehlke');
});
