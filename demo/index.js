import React from "react";
import { render } from 'react-dom';
import ReactOpenapiDesigner from "../src";

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

const TestDiv = () => {
  return (<div>
            {/* <ReactOpenapiDesigner.Schema dark onChange={handleChange} /> */}
            <ReactOpenapiDesigner.Response />
          </div>);
}

render(
  <TestDiv />,
  document.getElementById("root")
);
