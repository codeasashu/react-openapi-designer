//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {set} from 'lodash';
import {observer} from 'mobx-react-lite';
import {StoresContext} from '../../Context';
import {usePatchOperation, getValueFromStore} from '../../../utils/selectors';
import {getParentPath} from '../../../utils';
import {nodeOperations} from '../../../datasets/tree';
import {
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  Position,
  Icon,
} from '@blueprintjs/core';
import Parameters from '../../Common/Parameters/parameters';
import SecurityParameters from '../../Common/Parameters/securities';
import {Popover2} from '@blueprintjs/popover2';

//oas3: ["components", "securitySchemes"],
const OperationParameters = observer(({parametersPath}) => {
  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const handlePatch = usePatchOperation();
  const paramRef = React.useRef(null);
  const securitySchemes = getValueFromStore(['components', 'securitySchemes']);
  const securityPath = getParentPath(parametersPath).concat('security');
  const operationSecurities = getValueFromStore(securityPath);
  const {activeSourceNode} = uiStore;
  if (!activeSourceNode) {
    return null;
  }

  const gotoOverview = (e) => {
    const overviewNode = stores.graphStore.getNodeByUri(
      '/p/reference.yaml/info',
    );
    stores.designTreeStore.handleNodeClick(e, overviewNode);
  };

  const addOperationSecurity = () => {
    const scheme = Object.keys(securitySchemes)[0];
    const existingSecurities = operationSecurities || [];
    const newSchemes = [{[scheme]: []}, ...existingSecurities];
    handlePatch(nodeOperations.Replace, securityPath, newSchemes);
  };

  const disableSecurity = () => {
    handlePatch(nodeOperations.Replace, securityPath, []);
  };

  const enableSecurity = () => {
    handlePatch(nodeOperations.Remove, securityPath);
  };

  const parameters = {};
  set(parameters, ['schema', 'type'], 'string');
  return (
    <>
      <ButtonGroup>
        <Popover2
          content={
            <Menu data-testid="security-ctxmenu">
              <MenuItem
                text="Edit global security"
                icon={<Icon icon="globe" />}
                onClick={(e) => gotoOverview(e)}
              />
              {Object.keys(securitySchemes).length > 0 && (
                <MenuItem
                  text="Add operation security"
                  icon={<Icon icon="plus" />}
                  onClick={() => addOperationSecurity()}
                />
              )}
              {!operationSecurities || operationSecurities.length > 0 ? (
                <MenuItem
                  text="Disable security for operation"
                  icon={<Icon icon="disable" />}
                  onClick={() => disableSecurity()}
                />
              ) : (
                <MenuItem
                  text="Remove NO security override"
                  icon={<Icon icon="disable" />}
                  onClick={() => enableSecurity()}
                />
              )}
            </Menu>
          }
          position={Position.RIGHT_TOP}>
          <Button text="Security" aria-label="security" icon="plus" />
        </Popover2>
        <Button
          text="Header"
          aria-label="header"
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
      <div>
        <SecurityParameters
          className="mt-6"
          title="Securities"
          relativeJsonPath={securityPath}
          autoFocus={paramRef}
        />
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
      </div>
    </>
  );
});

OperationParameters.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default OperationParameters;
