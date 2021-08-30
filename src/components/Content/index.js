import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import {OpenApiBuilder} from 'openapi3-ts';
import styled from 'styled-components';
import Options from './options';
import Info from './info';
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

function getContentItem(
  openapi,
  errors,
  {
    onPathChange,
    onSchemaChange,
    onParameterChange,
    onResponseChange,
    onInfoChange,
    onSecuritySchemeChange,
    onServerChange,
  },
) {
  let query = useQuery();
  let contentItem = null;
  const path = query.get('path');
  const pathItem = openapi.paths[path];
  const modelSchema =
    openapi.components.schemas &&
    openapi.components.schemas[query.get('model')];
  const parameterSchema =
    openapi.components.parameters &&
    openapi.components.parameters[query.get('parameter')];
  const responseSchema =
    openapi.components.responses &&
    openapi.components.responses[query.get('response')];

  switch (query.get('menu')) {
    case 'info':
      contentItem = (
        <Info
          info={openapi.info}
          servers={openapi.servers || []}
          globalSecurity={openapi.security || []}
          securitySchemes={openapi.components?.securitySchemes}
          onChange={onInfoChange}
          onSecuritySchemeChange={onSecuritySchemeChange}
          onServerChange={onServerChange}
        />
      );
      break;
    case 'path':
      contentItem = (
        <PathContent
          path={path}
          method={query.get('method')}
          pathItem={pathItem}
          errors={errors.path}
          onChange={onPathChange}
        />
      );
      break;
    case 'model':
      contentItem = (
        <ModelContent
          name={query.get('model')}
          schema={modelSchema}
          errors={errors.schema}
          onChange={onSchemaChange}
        />
      );
      break;
    case 'parameter':
      contentItem = (
        <Parameter
          name={query.get('parameter')}
          parameter={parameterSchema}
          errors={errors.parameter}
          onChange={onParameterChange}
        />
      );
      break;
    case 'response':
      contentItem = (
        <Response
          name={query.get('response')}
          response={responseSchema}
          errors={errors.response}
          onChange={onResponseChange}
        />
      );
      break;
  }
  return contentItem;
}

export default function Content({
  openapi,
  errors,
  onPathChange,
  onSchemaChange,
  onParameterChange,
  onResponseChange,
  onInfoChange,
  onSecuritySchemeChange,
  onServerChange,
}) {
  const [currentView, setCurrentView] = useState('form');

  const toggleView = () =>
    setCurrentView(currentView === 'form' ? 'code' : 'form');

  return (
    <StyledContent className={'flex flex-col flex-1'}>
      <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
        <Options onToggleView={toggleView} />
        {currentView === 'form' &&
          getContentItem(openapi, errors, {
            onPathChange,
            onSchemaChange,
            onParameterChange,
            onResponseChange,
            onInfoChange,
            onSecuritySchemeChange,
            onServerChange,
          })}
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
  errors: PropTypes.object,
  onPathChange: PropTypes.func,
  onSchemaChange: PropTypes.func,
  onParameterChange: PropTypes.func,
  onResponseChange: PropTypes.func,
  onInfoChange: PropTypes.func,
  onServerChange: PropTypes.func,
  onSecuritySchemeChange: PropTypes.func,
};
