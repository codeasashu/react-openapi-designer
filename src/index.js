import React from 'react';
import {render} from 'react-dom';
import 'highlight.js/styles/monokai.css';
import App from './app';

import './css/app.css';
import './css/styles.min.css';

function getOptions(element) {
  const specUrl = element.getAttribute('spec-url');
  const showHeader = element.hasAttribute('show-header') || true;
  const readOnly = element.hasAttribute('readonly');
  const view = element.getAttribute('view');
  return {
    specUrl,
    showHeader,
    readOnly,
    view,
  };
}

function autoInit() {
  if (document == null) {
    return null;
  }
  const element = document.querySelector('react-openapi-designer');
  if (!element) {
    return;
  }

  const options = getOptions(element);
  render(<App {...options} />, element);
}

autoInit();
export default App;
