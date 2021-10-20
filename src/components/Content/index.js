import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import Options from './options';
import Info from './info';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';
import MonacoEditor from '../Editor/Monaco';
import {observer} from 'mobx-react-lite';
import {StoresContext} from '../Tree/context';
import {NodeCategories, NodeTypes} from '../../utils/tree';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

const getComponentForNode = (node) => {
  switch (node.type) {
    case NodeTypes.Path:
    case NodeTypes.Operation:
      return PathContent;
    case NodeTypes.Response:
      return Response;
    case NodeTypes.Model:
      return ModelContent;
    case NodeTypes.Parameter:
      return Parameter;
    default:
      return Info;
  }
};

const SubContent = observer(({node}) => {
  let relativeJsonPath = [];
  if (node.category === NodeCategories.SourceMap) {
    relativeJsonPath = node.relativeJsonPath;
  }
  const RenderSubContent = getComponentForNode(node);
  return <RenderSubContent relativeJsonPath={relativeJsonPath} node={node} />;
});

SubContent.propTypes = {
  node: PropTypes.object,
};

const Content = observer(() => {
  const stores = React.useContext(StoresContext);
  const {activeNode} = stores.uiStore;
  const sourceNode = stores.graphStore.rootNode;
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
        {currentView === 'code' && <MonacoEditor />}
      </div>
    </StyledContent>
  );
});

Content.propTypes = {
  openapi: PropTypes.object,
};

export default Content;
