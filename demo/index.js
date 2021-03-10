import React from "react";
import { render } from 'react-dom';
import JsonSchemaDesigner from "../src";

const handleChange = (schema) => {
  console.log('Schema Changed', schema)
};

const rootElement = document.getElementById("root");
render(<JsonSchemaDesigner onChange={handleChange} />, rootElement);
