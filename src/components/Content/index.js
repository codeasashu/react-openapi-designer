import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import {OpenApiBuilder} from 'openapi3-ts';
import styled from 'styled-components';
import Options from './options';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';
import MarkdownEditor from '../Editor/markdown';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getContentItem(openapi, handlePathChange) {
  let query = useQuery();
  let contentItem = null;
  const path = query.get('path');
  const pathItem = openapi.paths[path];
  console.log('path', path, pathItem);
  switch (query.get('menu')) {
    case 'path':
      contentItem = (
        <PathContent
          path={path}
          method={query.get('method')}
          pathItem={pathItem}
          onChange={handlePathChange}
        />
      );
      break;
    case 'model':
      contentItem = <ModelContent query={query} />;
      break;
    case 'parameter':
      contentItem = <Parameter query={query} />;
      break;
    case 'response':
      contentItem = <Response query={query} />;
      break;
  }
  return contentItem;
}

export default function Content({openapi, onPathChange}) {
  const [currentView, setCurrentView] = useState('form');

  const toggleView = () =>
    setCurrentView(currentView === 'form' ? 'code' : 'form');

  return (
    <StyledContent className={'flex flex-col flex-1'}>
      <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
        <Options onToggleView={toggleView} />
        {currentView === 'form' && getContentItem(openapi, onPathChange)}
        {currentView === 'code' && (
          <MarkdownEditor
            value={OpenApiBuilder.create(openapi).getSpecAsYaml()}
            onChange={() => {}}
          />
        )}
      </div>
    </StyledContent>
  );
}

Content.propTypes = {
  openapi: PropTypes.object,
  onPathChange: PropTypes.func,
};
