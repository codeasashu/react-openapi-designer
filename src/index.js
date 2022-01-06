import React from 'react';
import {render} from 'react-dom';
import 'highlight.js/styles/monokai.css';
import App from './app';

import './css/overrides.scss';
import './css/app.css';

function parseSpec(rawspec) {
  let spec = null;
  try {
    spec = JSON.parse(rawspec);
  } catch (err) {
    console.error('[ParseError]: Error parsing spec');
  }
  return spec;
}

function autoInit() {
  if (document == null) {
    return null;
  }
  const element = document.querySelector('react-openapi-designer');
  if (!element) {
    return;
  }

  const spec = parseSpec(element.getAttribute('spec'));
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
