import React from 'react';
import {render} from 'react-dom';
import 'highlight.js/styles/monokai.css';
import App from './app';

import './css/overrides.scss';
import './css/app.css';

function autoInit() {
  if (document == null) {
    return null;
  }
  const element = document.querySelector('react-openapi-designer');
  if (!element) {
    return;
  }
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Lolwa',
      version: '1.0.2',
    },
    paths: {},
    components: {
      schemas: {},
      responses: {},
      parameters: {},
      examples: {},
      requestBodies: {},
      headers: {},
      securitySchemes: {},
      links: {},
      callbacks: {},
    },
    tags: [],
    servers: [],
  };
  render(
    <App
      ref={(elem) => {
        window.ReactOpenapiDesigner = elem;
      }}
      spec={spec}
    />,
    element,
  );
}

autoInit();
export default App;
