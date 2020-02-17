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

const getColumnName = number => {
  if (number > columnNames.length - 1) {
    const letterIndex = number - columnNames.length; // as number is 0 based, length is 1
    return 'A' + columnNames[letterIndex];
  }
  return columnNames[number];
};

const getName = el => {
  return el.range.split('!')[0];
};

const getHeaders = values => {
  const [headers, ...rest] = values;

  return headers.map((el, i) => {
    // empty object for data to be returned
    const data = {};

    // divide string by | to get header name and spec
    const [name, spec] = el.split('|');
    const isRequired = name.slice(-1) === '!' || name === 'id';
    data.name = isRequired ? name.slice(0, -1) : name;
    data.required = isRequired;
    data.column = getColumnName(i);

    // if there is any spec, it has to be parsed
    if (spec) {
      const [specType, ...specData] = spec.split(':');
      data.specType = specType;
      data.specData = specData.length ? specData : undefined;
    }

    return data;
  });
};

const parseData = (headers, values) => {
  const [rawHeaders, ...data] = values;

  // go though each row of data
  return data.map((row, ii) => {
    // now map all columns, but we have to loop headers,
    // to avoid problems if empty last column(s)
    return row.reduce(
      (acc, el, i) => {
        acc[headers[i].name] = formatData(el, headers[i]);
        return acc;
      },
      {
        __row__: ii + 2 // 0 -> 2, 1 -> 3 as we are starting from line 2 and index is 0 based
      }
    );
  });
};

const formatData = (data, headerSpec) => {
  // parse types
  if (headerSpec?.specType === 'type') {
    // int
    if (headerSpec?.specData[0] === 'int') {
      return parseInt(data);
    }
    // bool
    if (headerSpec?.specData[0] === 'bool') {
      return parseInt(data) === 1;
    }
  }

  // parse links
  if (headerSpec?.specType === 'link') {
    const dataArray = data?.split(':').filter(Boolean);

    if (headerSpec?.specData?.[1] === 'single') {
      return dataArray[0];
    }
    return dataArray;
  }

  // by default return string
  return data && data !== '' ? data : null;
};

export default data => {
  return data.map((el, acc) => {
    const headers = getHeaders(el.values);

    return {
      name: getName(el),
      headers,
      data: parseData(headers, el.values)
    };
  });
};
