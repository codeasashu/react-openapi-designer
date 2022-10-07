import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {ControlGroup, Button, Intent} from '@blueprintjs/core';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {TitleEditor, UrlEditor} from '../Editor';
import Operation from './operation/operation';
import PathParams from '../Common/Parameters/path';
import {decodeUriFragment, getMethodColor} from '../../utils';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {isOperationNode} from '../../utils/tree';
import {nodeOperations} from '../../datasets/tree';
import {httpMethods} from '../../datasets/http';
import {StoresContext} from '../Context';

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
      httpMethods.map((method) => ({
        method,
        present:
          activeOperationNodes.length > 0 &&
          activeOperationNodes.find((n) => method === n.path),
      })),
    [activeOperationNodes],
  );

  const selectedMethodIndex = activeOperationNode
    ? httpMethods.findIndex((e) => e === activeOperationNode.path)
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
      setActiveNode(selectedOperation);
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
              activeOperationNode
                ? getValueFromStore(
                    activeOperationNode.relativeJsonPath.concat(['summary']),
                  ) || ''
                : ''
            }
            disabled={!activeOperationNode}
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
          <div className="px-10 pb-2 max-w-6xl" data-testid="path-params">
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
        className="flex flex-col flex-1 w-full m-auto p-10"
        selectedTabClassName="selected-tab"
        selectedTabPanelClassName="block"
        selectedIndex={selectedTab}
        onSelect={handleTabSelect}>
        <TabList className="mt-6 px-10 flex bp4-simple-tab-list">
          {methods.map((e) => {
            const methodColor = getMethodColor(e.method);
            return (
              <Tab
                key={e.method}
                className={classnames('bp4-simple-tab uppercase ')}>
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
        {methods.map((e, index) => {
          const mJsonPath = [...activePathNode.relativeJsonPath, e.method];
          const operation = getValueFromStore(mJsonPath);
          return (
            <TabPanel
              key={e.method}
              data-testid={`operation-tabpanel-${e.method.toLowerCase()}`}
              className={classnames(
                'FormOasPath__tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative',
                {
                  active: index === selectedTab,
                },
              )}>
              <div
                className="relative pt-10"
                role={`operation-${e.method.toLowerCase()}`}>
                {operation ? (
                  <Operation
                    operation={operation}
                    relativeJsonPath={mJsonPath}
                    onChange={() => {}}
                  />
                ) : (
                  <div className="pt-24 text-center">
                    <Button
                      large
                      intent={Intent.PRIMARY}
                      icon="plus"
                      onClick={() => {
                        stores.oasStore.service.addOperation({
                          sourceNodeId: activePathNode.parentSourceNode.id,
                          path: activePathNode.path,
                          method: e.method,
                          setActive: true,
                        });
                      }}
                      text={`${e.method.toUpperCase()} Operation`}
                    />
                  </div>
                )}
              </div>
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
