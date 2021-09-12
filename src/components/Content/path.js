import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  handleModelChange,
  handlePathNameChange,
  handleAddOperation,
} from 'store/modules/openapi';
import PropTypes from 'prop-types';
import {invert, get} from 'lodash';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {useHistory, useLocation} from 'react-router-dom';
import {TitleEditor, UrlEditor} from '../Editor';
import {MethodPane} from '../Panes';
import {escapeUri} from '../../utils';

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

const unescapeUri = (path) => path.replaceAll(/~1/g, '/');

const PathContent = ({path, relativeJsonPath, ...props}) => {
  let relativePath = relativeJsonPath.map((i) => unescapeUri(i));
  const dispatch = useDispatch();
  let history = useHistory();

  const onChange = React.useCallback(
    (path, value) => dispatch(handleModelChange({path, value})),
    [dispatch],
  );

  let query = useQuery();
  const pathItem = useSelector(({openapi}) =>
    get(openapi, relativePath.slice(0, 2)),
  );

  const selectDefaultMethod = () => {
    const methods = Object.keys(pathItem).map((m) => m.toLowerCase());
    if (methods.length === 0) return null;
    if (methods.indexOf('get') > -1) return 'get';
    if (methods.indexOf('post') > -1) return 'post';
    if (methods.indexOf('put') > -1) return 'put';
    if (methods.indexOf('delete') > -1) return 'delete';
    return methods[0].toLowerCase();
  };

  const addOperation = (method) => {
    dispatch(handleAddOperation({path: relativePath[1], method}));
    query.set(
      'path',
      `paths/${escapeUri(relativePath[1])}/${method.toLowerCase()}`,
    );
    history.push(`/designer?${query}`);
  };

  const updateOperation = (methodName, operation) => {
    onChange({
      path,
      pathItem: {
        ...pathItem,
        [methodName.toLowerCase()]: {...operation, ...operation},
      },
    });
  };

  const onTabClick = (selectedIndex) => {
    setSelectedTab(selectedIndex);
    const methodName = invert(tabIndexes)[selectedIndex];
    if (Object.keys(pathItem).indexOf(methodName.toLowerCase()) >= 0) {
      query.set(
        'path',
        `paths/${escapeUri(relativePath[1])}/${methodName.toLowerCase()}`,
      );
      history.push(`/designer?${query}`);
    }
  };

  const extractMethodFromUri = (validMethods, relativePath) => {
    if (relativePath.length < 3) return null;
    const method = relativePath[2];
    const isValidMethod = validMethods.indexOf(method.toLowerCase()) >= 0;
    return isValidMethod ? method.toLowerCase() : null;
  };

  let method = extractMethodFromUri(Object.keys(tabIndexes), relativePath);
  if (method === null) {
    method = selectDefaultMethod();
    const copyOfRelativePath = relativePath.slice(0, 2);
    copyOfRelativePath.push(method);
    relativePath = copyOfRelativePath;
  }

  const operation = useSelector(({openapi}) => {
    return get(openapi, relativePath);
  });

  const [selectedTab, setSelectedTab] = useState(
    tabIndexes[method.toLowerCase()],
  );

  const onPathChange = React.useCallback(
    (newPath, oldPath) => {
      dispatch(handlePathNameChange({newPath, oldPath}));
      const methodName = invert(tabIndexes)[selectedTab];
      query.set(
        'path',
        `#/paths/${escapeUri(newPath)}/${methodName.toLowerCase()}`,
      );
      history.replace(`/designer?${query}`);
    },
    [dispatch],
  );

  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="flex px-10 mt-10 max-w-6xl justify-between">
          <TitleEditor
            xl
            value={operation['summary']}
            placeholder="Operation Name"
            onChange={(e) => {
              const summary = e.target.value;
              onChange(relativePath.concat(['summary']), summary);
            }}
          />
        </div>
        <div className="px-10 pb-2 max-w-6xl">
          <div className="mt-6">
            <UrlEditor
              errors={props.errors?.url}
              value={relativePath[1]}
              onChange={(newPath) => {
                onPathChange(newPath, relativePath[1]);
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
  relativeJsonPath: PropTypes.array,
  errors: PropTypes.any,
  onChange: PropTypes.func,
};

export default PathContent;
