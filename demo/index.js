import React from 'react';
import {render} from 'react-dom';
import ReactOpenapiDesigner from '../src';

render(
  <ReactOpenapiDesigner.OasDesigner dark />,
  document.getElementById('root'),
);
