import React from 'react';
import {render} from 'react-dom';

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
  render(<App />, element);
}

autoInit();
export default App;
