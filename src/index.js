import React from 'react';
import {render} from 'react-dom';
import 'highlight.js/styles/monokai.css';
import App from './app';

import './css/overrides.scss';
import './css/app.css';
import './css/styles.min.css';

function autoInit() {
  if (document == null) {
    return null;
  }
  const element = document.querySelector('react-openapi-designer');
  if (!element) {
    return;
  }
  const specUrl = element.getAttribute('spec-url');
  const showHeader = (element.getAttribute('show-header') || '1') == '1';
  const view = element.getAttribute('view');
  render(
    <App specUrl={specUrl} showHeader={showHeader} view={view} />,
    element,
  );
}

autoInit();
export default App;
