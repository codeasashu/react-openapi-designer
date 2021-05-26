import React from 'react';
import {render} from 'react-dom';
import ReactOpenapiDesigner from '../src';

const handleChange = (schema) => {
  console.log('Resp Changed', schema);
};

const initSchema = {
  title: 'abc',
  type: 'object',
  properties: {
    a: {type: 'string'},
  },
  required: ['a'],
  examples: {},
};

const params = {
  in: 'query',
  name: 'abc',
  schema: {
    type: 'string',
  },
  description: 'def',
};

const TestDiv = () => {
  return (
    <div>
      <ReactOpenapiDesigner.Schema
        schema={{type: 'string'}}
        dark
        onChange={handleChange}
      />
      <ReactOpenapiDesigner.Parameter
        dark
        {...params}
        onChange={handleChange}
      />
      <ReactOpenapiDesigner.Response dark onChange={handleChange} />
    </div>
  );
};

render(<TestDiv />, document.getElementById('root'));
