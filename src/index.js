import React from 'react';
import {render} from 'react-dom';
import 'highlight.js/styles/monokai.css';
import App from './app';

import './css/app.css';
import './css/styles.min.css';

function getOptions(element) {
  const specUrl = element.getAttribute('spec-url');
  const showHeader = element.hasAttribute('noheader') === false;
  const readOnly = element.hasAttribute('readonly');
  const view = element.getAttribute('view');
  const mockUrl = element.getAttribute('mock-url');
  const storage = element.getAttribute('storage');
  return {
    specUrl,
    showHeader,
    readOnly,
    view,
    mockUrl,
    element,
    storage,
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
