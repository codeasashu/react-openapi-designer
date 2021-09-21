import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useLocation, useHistory} from 'react-router-dom';
import {OpenApiBuilder} from 'openapi3-ts';
import styled from 'styled-components';
import {getJsonPointerFromUrl} from '../../utils';
import {getModuleFromJsonPointer, ModuleNames} from '../../model';
import Options from './options';
import Info from './info';
import PathContent from './path';
import ModelContent from './model';
import Parameter from './parameter';
import Response from './response';
import YamlEditor from '../Editor/yaml';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

function useQuery() {
  const query = new URLSearchParams(useLocation().search);
  const path = query.get('path');
  return {path};
}

const SubContent = () => {
  const {path} = useQuery();
  const [pointer, setPointer] = useState(getJsonPointerFromUrl(path));
  useEffect(() => {
    setPointer(getJsonPointerFromUrl(path));
  }, [path]);
  const moduleName = getModuleFromJsonPointer(pointer);
  return (
    <>
      {moduleName === ModuleNames.info && <Info />}
      {moduleName === ModuleNames.paths && (
        <PathContent path={path} relativeJsonPath={pointer} />
      )}
      {moduleName === ModuleNames.responses && (
        <Response relativeJsonPath={pointer} />
      )}
      {moduleName === ModuleNames.models && (
        <ModelContent relativeJsonPath={pointer} />
      )}
      {moduleName === ModuleNames.parameters && (
        <Parameter relativeJsonPath={pointer} />
      )}
    </>
  );
};

export default function Content({openapi}) {
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
        {currentView === 'form' && <SubContent />}
        {currentView === 'code' && (
          <YamlEditor
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
};
