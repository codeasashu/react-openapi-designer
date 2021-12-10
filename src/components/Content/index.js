import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {observer} from 'mobx-react-lite';
import {cloneDeep} from 'lodash';
import Redoc from '../Docs';
import Options from './options';
import Info from './info';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';
import RequestBody from './RequestBody';
import MonacoEditor from '../Editor/Monaco';
import {StoresContext} from '../Context';
import {NodeCategories, NodeTypes} from '../../datasets/tree';

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
    case NodeTypes.RequestBody:
      return RequestBody;
    case NodeTypes.Model:
      return ModelContent;
    case NodeTypes.Parameter:
      return Parameter;
    case NodeTypes.Overview:
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
  const {activeNode, activeView, views} = stores.uiStore;
  const sourceNode = stores.graphStore.rootNode;

  const toggleView = (view) => stores.uiStore.setActiveView(view);

  return (
    <StyledContent className={'flex flex-col flex-1'}>
      <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
        <Options
          view={activeView}
          onToggleView={toggleView}
          onDelete={() => {
            stores.graphStore.removeNode(activeNode.id);
          }}
        />
        {activeView === views.form && (
          <SubContent node={activeNode || sourceNode} />
        )}
        {activeView === views.code && <MonacoEditor />}
        {activeView === views.preview && (
          <Redoc spec={cloneDeep(sourceNode.data.parsed)} />
        )}
      </div>
    </StyledContent>
  );
});

Content.propTypes = {};

export default Content;
