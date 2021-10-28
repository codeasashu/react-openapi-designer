import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {ControlGroup, Button} from '@blueprintjs/core';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
//import {useHistory, useLocation} from 'react-router-dom';
import {TitleEditor, UrlEditor} from '../Editor';
import {MethodPane} from '../Panes';
import PathParams from '../Designer/ParameterGroup/path';
import {decodeUriFragment, validMethods, getMethodColor} from '../../utils';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {nodeOperations, isOperationNode} from '../../utils/tree';
import {StoresContext} from '../Tree/context';

const PathContent = observer(({relativeJsonPath, ...props}) => {
  const handlePatch = usePatchOperation();
  const stores = React.useContext(StoresContext);
  const {
    path: {activePathNode},
    service: {activeOperationNodes, activeOperationNode},
  } = stores.oasStore;

  const {activeSymbolNode, setActiveNode} = stores.uiStore;
  if (!activePathNode) {
    return null;
  }

  const methods = React.useMemo(
    () =>
      validMethods.map((method) => ({
        method,
        present:
          activeOperationNodes.length > 0 &&
          activeOperationNodes.find((n) => method === n.path),
      })),
    [activeOperationNodes],
  );

  const selectedMethodIndex = activeOperationNode
    ? validMethods.findIndex((e) => e === activeOperationNode.path)
    : 0;
  const [selectedTab, setSelectedTab] = useState(
    Math.max(0, selectedMethodIndex),
  );

  React.useEffect(() => {
    if (activeOperationNode && isOperationNode(activeSymbolNode)) {
      const newIndex = Math.max(
        0,
        methods.findIndex((e) => activeOperationNode.path === e.method),
      );

      if (selectedTab !== newIndex) {
        setSelectedTab(newIndex);
      }
    }
  }, [
    activeOperationNode,
    activeSymbolNode,
    methods,
    selectedTab,
    setSelectedTab,
  ]);

  //const relativePathItemPath =
  //node.type === NodeTypes.Path
  //? relativeJsonPath
  //: relativeJsonPath.slice(0, 2);
  //const pathItem = getValueFromStore(relativePathItemPath);
  //console.log('node', node, pathItem, relativeJsonPath);
  //if (node.type === NodeTypes.Path) {
  //const defaultMethod = selectDefaultMethod(pathItem);
  //relativeJsonPath.concat([defaultMethod]);
  //}
  //const methodIndex = validPathMethods.findIndex((e) => e === i.path);
  //console.log('relativeb', relativeJsonPath);

  const pathUrlRef = React.useRef(null);

  const handleTabSelect = (index) => {
    setSelectedTab(index);
    const selectedMethod = methods[index]; //a
    const selectedOperation = activeOperationNodes.find(
      (n) => selectedMethod.method === n.path,
    ); //s

    if (selectedOperation) {
      if (
        activeOperationNode &&
        selectedOperation.id !== activeOperationNode.id
      ) {
        setActiveNode(selectedOperation);
      }
    } else {
      if (activePathNode) {
        setActiveNode(activePathNode);
      }
    }
  };

  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="flex px-10 mt-10 max-w-6xl justify-between">
          <TitleEditor
            xl
            value={
              getValueFromStore(
                activeOperationNode.relativeJsonPath.concat(['summary']),
              ) || ''
            }
            placeholder="Operation Name"
            onChange={(e) => {
              handlePatch(
                nodeOperations.Replace,
                relativeJsonPath.concat(['summary']),
                e.target.value,
              );
            }}
          />
        </div>
        <div className="px-10 pb-2 max-w-6xl">
          <div className="mt-6">
            <ControlGroup className="flex">
              <UrlEditor
                errors={props.errors?.url}
                value={decodeUriFragment(relativeJsonPath[1])}
                onChange={(newPath) => {
                  stores.oasStore.path.updatePath(newPath);
                }}
                //setPathParamsVisibility(!isPathParamsVisible)
              />
              <Button
                text="path params"
                onClick={() => stores.oasStore.path.togglePathParams()}
              />
            </ControlGroup>
          </div>
        </div>
        {stores.oasStore.path.pathParamsVisible && (
          <div className="px-10 pb-2 max-w-6xl">
            <div className="flex items-center mt-5 mb-2">
              <div className="font-semibold text-gray-600 ml-1">
                Path parameters
              </div>
              <Button
                small
                minimal
                className="ml-1"
                icon="plus"
                aria-label="add row"
                onClick={() => {
                  pathUrlRef.current = 'path';
                  stores.oasStore.path.addPathParam();
                }}
              />
            </div>
            <PathParams
              autoFocus={pathUrlRef}
              parameterIn="path"
              parametersPath={activePathNode.relativeJsonPath.concat([
                'parameters',
              ])}
              title=""
              handleUpdateName={(relativePath, newValue, oldValue) => {
                if (oldValue !== newValue.trim()) {
                  stores.oasStore.path.updatePathParamName(
                    relativePath,
                    newValue,
                  );
                }
              }}
              handleRemove={(relativePath) => {
                stores.oasStore.path.removePathParam(relativePath);
              }}
              onChange={(newParam, index) => {
                //stores.oasStore.path.updatePathParamName(e, t);
                console.log('on path paaram change', newParam, index);
              }}
            />
          </div>
        )}
      </div>
      <Tabs
        className="flex flex-col flex-1"
        selectedTabClassName="selected-tab"
        selectedTabPanelClassName="block"
        selectedIndex={selectedTab}
        onSelect={handleTabSelect}>
        <TabList className="mt-6 px-10 flex bp3-simple-tab-list">
          {methods.map((e) => {
            const methodColor = getMethodColor(e.method);
            return (
              <Tab
                key={e.method}
                className={classnames('bp3-simple-tab uppercase ')}>
                <span
                  className={classnames('uppercase ', {
                    [`text-${methodColor} dark:text-${methodColor}`]: e.present,
                  })}>
                  {e.method}
                </span>
              </Tab>
            );
          })}
        </TabList>
        {methods.map((e) => {
          const mJsonPath = [...activePathNode.relativeJsonPath, e.method];
          return (
            <TabPanel
              key={e.method}
              className="FormOasPath__tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative">
              <MethodPane
                methodName={e.method}
                relativeJsonPath={mJsonPath}
                operation={getValueFromStore(mJsonPath)}
                onAddOperation={() => {
                  stores.oasStore.service.addOperation({
                    sourceNodeId: activePathNode.parentSourceNode.id,
                    path: activePathNode.path,
                    method: e.method,
                    setActive: true,
                  });
                }}
              />
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
});

PathContent.propTypes = {
  node: PropTypes.object,
  path: PropTypes.string,
  method: PropTypes.string,
  relativeJsonPath: PropTypes.array,
  errors: PropTypes.any,
  onChange: PropTypes.func,
};

export default PathContent;
