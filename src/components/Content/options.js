import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Icon} from '@blueprintjs/core';
import {StoresContext} from '../Tree/context';
import {NodeCategories} from '../../utils/tree';

const Options = (props) => {
  const stores = React.useContext(StoresContext);
  const {activeNode} = stores.uiStore;
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div className="border-b border-transparent PanelActionBar w-full flex items-center px-5 py-2">
      {activeNode && activeNode.category === NodeCategories.SourceMap && (
        <div className="flex items-center">
          <Button
            small
            icon={<Icon size={14} icon="trash" />}
            text={confirmDelete ? 'Are you sure?' : 'delete'}
            onMouseLeave={() => {
              setConfirmDelete(false);
            }}
            onClick={() => {
              if (confirmDelete) {
                if (props.onDelete) {
                  props.onDelete();
                }
              } else {
                setConfirmDelete(true);
              }
            }}
          />
        </div>
      )}
      <div className="flex-1" />
      <div>
        <ButtonGroup>
          <Button
            active={props.view === 'form'}
            small
            icon={<Icon size={14} icon="form" />}
            text="Form"
            onClick={props.onToggleView}
          />
          <Button
            active={props.view === 'code'}
            small
            icon={<Icon size={14} icon="code" />}
            text="Code"
            onClick={props.onToggleView}
          />
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <Button small text="Preview" icon="eye-on" />
      </div>
    </div>
  );
};

Options.propTypes = {
  view: PropTypes.string,
  onToggleView: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Options;
