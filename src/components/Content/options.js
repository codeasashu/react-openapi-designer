import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {handleModelDelete} from 'store/modules/openapi';
import {useLocation} from 'react-router-dom';
import {Button, ButtonGroup} from '@blueprintjs/core';
import {getJsonPointerFromUrl} from '../../utils';
import {getModuleFromJsonPointer, ModuleNames} from '../../model';

function useQuery() {
  const query = new URLSearchParams(useLocation().search);
  const location = query.get('location');
  const path = query.get('path');
  return {location, path};
}
const shouldShow = (pointer: []) => {
  const moduleName = getModuleFromJsonPointer(pointer);
  if (moduleName === ModuleNames.info) {
    return false;
  }
  return true;
};

const Options = (props) => {
  const dispatch = useDispatch();
  const {path} = useQuery();
  const pointer = getJsonPointerFromUrl(path);

  return (
    <div className="border-b border-transparent PanelActionBar w-full flex items-center px-5 py-2">
      {shouldShow(pointer) && (
        <div className="flex items-center">
          <Button
            small
            icon="trash"
            text="delete"
            onClick={() => {
              dispatch(handleModelDelete({path: pointer}));
              props.onDelete(pointer);
            }}
          />
        </div>
      )}
      <div className="flex-1" />
      <div>
        <ButtonGroup>
          <Button small text="Form" onClick={props.onToggleView} />
          <Button small text="Code" onClick={props.onToggleView} />
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <Button small text="Preview" icon="eye-on" />
      </div>
    </div>
  );
};

Options.propTypes = {
  onToggleView: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Options;
