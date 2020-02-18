import firstUpper from '../../utils/firstUpper';
import getColumnName from './columnName';

const getName = el => {
  return el.range.split('!')[0];
};

const getGraphType = ({ specType: type, specData: data, name }) => {
  const mapping = {
    int: 'Int',
    bool: 'Boolean',
    float: 'Float',
    id: 'ID'
  };

  if (name === 'id') {
    return mapping.id;
  }

  if (type === 'type') {
    return mapping[data[0]];
  }

  return 'String';
};

const getHeaders = values => {
  const [headers, ...rest] = values;

  return headers.map((el, i) => {
    // empty object for data to be returned
    const data = {};

    // divide string by | to get header name and spec
    const [name, spec] = el.split('|');
    const isRequired = name.slice(-1) === '!' || name === 'id';
    data.name = isRequired && name !== 'id' ? name.slice(0, -1) : name;
    data.required = isRequired;
    data.column = getColumnName(i);

    // if there is any spec, it has to be parsed
    if (spec) {
      const [specType, ...specData] = spec.split(':');
      data.specType = specType;
      data.specData = specData.length ? specData : undefined;
    }

    data.graphType = getGraphType(data);

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
  return data;
};

// returns graphQL type
const parseSchemaType = (name, headers) => {
  const data = headers.map(h => {
    // Link to other sheet
    if (h.specType === 'link') {
      // TODO: check if target exists!
      const target = h.specData?.[0] ? firstUpper(h.specData?.[0]) : firstUpper(h.name);
      const single = h.specData?.[1] === 'single';
      return `${h.name}: ${single ? '' : '['}${target}${single ? '' : ']'}${h.required ? '!' : ''}`;
    }

    // standard non-link type
    return `${h.name}: ${h.graphType}${h.required ? '!' : ''}`;
  });

  return `type ${firstUpper(name)} {
    ${data.join(' \n ')}
  }`;
};

// returns graphQL query
const parseSchemaQueries = name => {
  return `all${firstUpper(name)}: [${firstUpper(name)}]!
  ${name}(id: String!): ${firstUpper(name)}!`;
};

export default data => {
  return data.map((el, acc) => {
    const name = getName(el);
    const headers = getHeaders(el.values);

    return {
      name,
      headers,
      schemaType: parseSchemaType(name, headers),
      schemaQueries: parseSchemaQueries(name),
      data: parseData(headers, el.values)
    };
  });
};
