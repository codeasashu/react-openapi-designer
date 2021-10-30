// @flow
import React from 'react';
import OasDesigner from './components/Designer';
import {StoresContext} from './components/Tree/context';
import Stores from './Stores';
import './overrides.scss';
import './app.css';
const OpenapiSpecDesigner = (props) => {
  return (
    <StoresContext.Provider value={new Stores()}>
      <OasDesigner {...props} />
    </StoresContext.Provider>
  );
};

const ReactOpenapiDesigner = {
  OasDesigner: OpenapiSpecDesigner,
};

export {OasDesigner} from '.';

export default ReactOpenapiDesigner;
