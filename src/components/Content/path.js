import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {invert} from 'lodash';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useHistory, useLocation} from 'react-router-dom';
import {TitleEditor, UrlEditor} from '../Editor';
import {MethodPane} from '../Panes';
import {defaultOperation} from '../../model';
import {generateOperationId} from '../../utils/schema';

const methodTabClasses =
  'bp3-simple-tab-panel rounded-none flex-1 border-l-0 \
border-r-0 border-b-0 relative';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const tabIndexes = {
  get: 0,
  post: 1,
  put: 2,
  delete: 3,
};

const PathContent = ({path, pathItem, method: apiMethod, onChange}) => {
  let history = useHistory();
  let location = useLocation();
  let query = useQuery();

  const selectDefaultMethod = (method = null) => {
    method = method && method.toLowerCase();
    const methods = Object.keys(pathItem).map((m) => m.toLowerCase());
    if (method && methods.indexOf(method) > -1) return method;
    if (methods.indexOf('get') > -1) return 'get';
    if (methods.indexOf('post') > -1) return 'post';
    if (methods.indexOf('put') > -1) return 'put';
    if (methods.indexOf('delete') > -1) return 'delete';
    return null;
  };

  const addOperation = (methodName) => {
    const operationId = generateOperationId(path, methodName);
    const _pathItem = {
      ...pathItem,
      [methodName.toLowerCase()]: {...defaultOperation, operationId},
    };
    onChange({path, pathItem: _pathItem});
  };

  const updateOperation = (methodName, operation) => {
    onChange({
      path,
      pathItem: {
        ...pathItem,
        [methodName.toLowerCase()]: {...operationObj, ...operation},
      },
    });
  };

  const onTabClick = (selectedIndex) => {
    const methodName = invert(tabIndexes)[selectedIndex];
    setSelectedTab(selectedIndex);
    query.set('method', methodName);
    history.push(`/designer?${query}`);
  };

  const method = selectDefaultMethod(apiMethod);
  const operationObj = pathItem[method];
  const [selectedTab, setSelectedTab] = useState(
    tabIndexes[apiMethod.toLowerCase()],
  );

  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="flex px-10 mt-10 max-w-6xl justify-between">
          <TitleEditor
            xl
            value={operationObj['summary']}
            placeholder="Operation Name"
            onChange={(e) => {
              const summary = e.target.value;
              onChange({
                path,
                pathItem: {
                  ...pathItem,
                  [method.toLowerCase()]: {...operationObj, summary},
                },
              });
            }}
          />
        </div>
        <div className="px-10 pb-2 max-w-6xl">
          <div className="mt-6">
            <UrlEditor
              value={path}
              onChange={(e) => {
                console.log('url editor', e);
              }}
            />
          </div>
        </div>
        <Tabs
          className="flex flex-col flex-1"
          selectedTabClassName="selected-tab"
          selectedTabPanelClassName="block"
          selectedIndex={selectedTab}
          onSelect={onTabClick}>
          <TabList className="mt-6 px-10 flex bp3-simple-tab-list">
            <Tab
              className={`bp3-simple-tab uppercase ${
                method.toLowerCase() === 'get' && 'text-green-400'
              }`}>
              get
            </Tab>
            <Tab
              className={`bp3-simple-tab uppercase ${
                method.toLowerCase() === 'post' && 'text-blue-600'
              }`}>
              post
            </Tab>
            <Tab
              className={`bp3-simple-tab uppercase ${
                method.toLowerCase() === 'put' && 'text-yellow-600'
              }`}>
              put
            </Tab>
            <Tab
              className={`bp3-simple-tab uppercase ${
                method.toLowerCase() === 'delete' && 'text-red-400'
              }`}>
              delete
            </Tab>
          </TabList>
          <TabPanel className={methodTabClasses}>
            <MethodPane
              methodName="get"
              operation={pathItem['get']}
              onAddOperation={() => addOperation('get')}
              onChange={(e) => updateOperation('get', e)}
            />
          </TabPanel>
          <TabPanel className={methodTabClasses}>
            <MethodPane
              methodName="post"
              operation={pathItem['post']}
              onAddOperation={() => addOperation('post')}
              onChange={(e) => updateOperation('post', e)}
            />
          </TabPanel>
          <TabPanel className={methodTabClasses}>
            <MethodPane
              methodName="put"
              operation={pathItem['put']}
              onAddOperation={() => addOperation('put')}
              onChange={(e) => updateOperation('put', e)}
            />
          </TabPanel>
          <TabPanel className={methodTabClasses}>
            <MethodPane
              methodName="delete"
              operation={pathItem['delete']}
              onAddOperation={() => addOperation('delete')}
              onChange={(e) => updateOperation('delete', e)}
            />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

PathContent.propTypes = {
  path: PropTypes.string,
  method: PropTypes.string,
  pathItem: PropTypes.object,
  onChange: PropTypes.func,
};

export default PathContent;
