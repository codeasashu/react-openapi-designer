import React from "react";
import { render } from 'react-dom';
import JsonSchemaDesigner from "../src";

const handleChange = (schema) => {
  console.log('Schema Changed', schema)
};

const initSchema = {
    title: 'abc',
    type: 'object',
    properties: {
      a: {type: 'string'}
    },
    required: ['a'],
    examples: {}
};

const rootElement = document.getElementById("root");
render(<JsonSchemaDesigner onChange={handleChange} schema={initSchema} />, rootElement);
