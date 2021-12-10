import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {Button, ButtonGroup, Icon} from '@blueprintjs/core';
import {StoresContext} from '../Context';
import {NodeCategories} from '../../datasets/tree';

const Options = observer((props) => {
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
            onClick={() => props.onToggleView('form')}
          />
          <Button
            active={props.view === 'code'}
            small
            icon={<Icon size={14} icon="code" />}
            text="Code"
            onClick={() => props.onToggleView('code')}
          />
          <Button
            active={props.view === 'docs'}
            small
            icon={<Icon size={14} icon="book" />}
            text="Preview"
            onClick={() => props.onToggleView('preview')}
          />
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <Button
          small
          aria-label="toggle fullscreen"
          icon={
            <Icon
              size={14}
              icon={stores.uiStore.fullscreen === true ? 'minimize' : 'move'}
            />
          }
          onClick={() => stores.uiStore.toggleFullscreen()}
        />
      </div>
    </div>
  );
});

Options.propTypes = {
  view: PropTypes.string,
  onToggleView: PropTypes.func,
  onDelete: PropTypes.func,
};

export default Options;
