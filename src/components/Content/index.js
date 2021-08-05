import React from 'react';
//import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import Options from './options';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function getContentItem() {
  let query = useQuery();
  const path = query.get('path');
  const menu = query.get('menu');
  let contentItem = null;
  switch (menu) {
    case 'path':
      contentItem = <PathContent path={path} />;
      break;
    case 'model':
      contentItem = <ModelContent path={path} />;
      break;
    case 'parameter':
      contentItem = <Parameter path={path} />;
      break;
    case 'response':
      contentItem = <Response path={path} />;
      break;
  }
  return contentItem;
}

export default function Content() {
  return (
    <StyledContent className={'flex flex-col flex-1'}>
      <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
        <Options />
        {getContentItem()}
      </div>
    </StyledContent>
  );
}
