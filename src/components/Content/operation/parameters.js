//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {set} from 'lodash';
import {observer} from 'mobx-react-lite';
import {StoresContext} from '../../Tree/context';
import {usePatchOperation} from '../../../utils/selectors';
import {nodeOperations} from '../../../utils/tree';
import {ButtonGroup, Button} from '@blueprintjs/core';
import Parameters from '../../Common/Parameters/parameters';

//oas3: ["components", "securitySchemes"],
const OperationParameters = observer(({parametersPath}) => {
  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const handlePatch = usePatchOperation();
  const paramRef = React.useRef(null);
  const {activeSourceNode} = uiStore;
  if (!activeSourceNode) {
    return null;
  }

  const parameters = {};
  set(parameters, ['schema', 'type'], 'string');
  return (
    <>
      <ButtonGroup>
        <Button
          text="Security"
          role="security"
          icon="plus"
          onClick={() => {
            paramRef.current = 'security';
            handlePatch(
              nodeOperations.Replace,
              parametersPath.concat('-'),
              Object.assign(Object.assign({}, parameters), {in: 'security'}),
            );
          }}
        />
        <Button
          text="Header"
          role="header"
          icon="plus"
          onClick={() => {
            paramRef.current = 'header';
            handlePatch(
              nodeOperations.Replace,
              parametersPath.concat('-'),
              Object.assign(Object.assign({}, parameters), {in: 'header'}),
            );
          }}
        />
        <Button
          text="Query Param"
          icon="plus"
          role="query-param"
          onClick={() => {
            paramRef.current = 'query';
            handlePatch(
              nodeOperations.Replace,
              parametersPath.concat('-'),
              Object.assign(Object.assign({}, parameters), {in: 'query'}),
            );
          }}
        />
        <Button
          text="Cookie"
          icon="plus"
          role="cookie-param"
          onClick={() => {
            paramRef.current = 'cookie';
            handlePatch(
              nodeOperations.Replace,
              parametersPath.concat('-'),
              Object.assign(Object.assign({}, parameters), {in: 'cookie'}),
            );
          }}
        />
      </ButtonGroup>
      <Parameters
        className="mt-6"
        title="Headers"
        parametersPath={parametersPath}
        parameterIn="header"
        autoFocus={paramRef}
      />
      <Parameters
        className="mt-6"
        title="Query"
        parametersPath={parametersPath}
        parameterIn="query"
        autoFocus={paramRef}
      />
      <Parameters
        className="mt-6"
        title="Cookie"
        parametersPath={parametersPath}
        parameterIn="cookie"
        autoFocus={paramRef}
      />
    </>
  );
});

OperationParameters.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default OperationParameters;
