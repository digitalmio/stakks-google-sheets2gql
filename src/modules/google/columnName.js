const columnNames = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

export default number => {
  if (number > columnNames.length - 1) {
    const letterIndex = number - columnNames.length; // as number is 0 based, length is 1
    return 'A' + columnNames[letterIndex];
  }
  return columnNames[number];
};
