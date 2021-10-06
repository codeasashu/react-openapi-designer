import React, {useState} from 'react';
import PropTypes from 'prop-types';
//import {useLocation, useHistory} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
//import {OpenApiBuilder} from 'openapi3-ts';
import styled from 'styled-components';
//import {getJsonPointerFromUrl} from '../../utils';
//import {getModuleFromJsonPointer, ModuleNames} from '../../model';
import Options from './options';
import Info from './info';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';
import YamlEditor from '../Editor/yaml';
import {observer} from 'mobx-react-lite';
import {StoresContext} from '../Tree/context';
import {NodeCategories, NodeTypes} from '../../utils/tree';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

//function useQuery() {
//const query = new URLSearchParams(useLocation().search);
//const path = query.get('path');
//return {path};
//}

const SubContent = ({node}) => {
  //const {path} = useQuery();
  //const [pointer, setPointer] = useState(getJsonPointerFromUrl(path));
  //useEffect(() => {
  //setPointer(getJsonPointerFromUrl(path));
  //}, [path]);
  //const moduleName = getModuleFromJsonPointer(pointer);

  let relativeJsonPath = [];
  if (node.category === NodeCategories.SourceMap) {
    relativeJsonPath = node.relativeJsonPath;
  }
  return (
    <>
      {node.type === NodeTypes.Info && <Info />}
      {node.type === NodeTypes.Path && (
        <PathContent relativeJsonPath={relativeJsonPath} node={node} />
      )}
      {node.type === NodeTypes.Response && (
        <Response relativeJsonPath={relativeJsonPath} node={node} />
      )}
      {node.type === NodeTypes.Model && (
        <ModelContent relativeJsonPath={relativeJsonPath} node={node} />
      )}
      {node.type === NodeTypes.Parameter && (
        <Parameter relativeJsonPath={relativeJsonPath} node={node} />
      )}
    </>
  );
};

SubContent.propTypes = {
  node: PropTypes.object,
};

const Content = observer(() => {
  const stores = React.useContext(StoresContext);
  const {activeNode} = stores.uiStore;
  const sourceNode = stores.graphStore.rootNode;
  console.log('storesc', stores.uiStore, activeNode, sourceNode);
  let history = useHistory();
  const [currentView, setCurrentView] = useState('form');

  const toggleView = () =>
    setCurrentView(currentView === 'form' ? 'code' : 'form');

  return (
    <StyledContent className={'flex flex-col flex-1'}>
      <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
        <Options
          view={currentView}
          onToggleView={toggleView}
          onDelete={() => history.replace('/')}
        />
        {currentView === 'form' && (
          <SubContent node={activeNode || sourceNode} />
        )}
        {currentView === 'code' && (
          <YamlEditor value={''} onChange={() => {}} />
        )}
      </div>
    </StyledContent>
  );
});

Content.propTypes = {
  openapi: PropTypes.object,
};

export default Content;
