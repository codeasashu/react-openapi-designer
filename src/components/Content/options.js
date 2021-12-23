import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';
import {Button, ButtonGroup, Icon, Intent} from '@blueprintjs/core';
import {StoresContext} from '../Context';
import {NodeCategories} from '../../datasets/tree';
import Tags from './tags';

const Options = observer(({relativeJsonPath, node, ...props}) => {
  const stores = React.useContext(StoresContext);
  const {activeWidget, widgets} = stores.uiStore;
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const {errors, hints, info, warning} = stores.lintStore;

  const lintSpec = () => {
    if (activeWidget === widgets.lint) {
      stores.uiStore.toggleWidget(stores.uiStore.widgets.lint);
    } else {
      stores.uiStore.setActiveWidget(stores.uiStore.widgets.lint);
    }
  };

  return (
    <div
      className={classnames(
        'border-b  PanelActionBar w-full flex items-center px-5 py-2',
        {
          'border-transparent': !activeWidget,
        },
      )}>
      <div className="flex items-center">
        <Tags relativeJsonPath={relativeJsonPath} node={node} />
        {node && node.category === NodeCategories.SourceMap && (
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
        )}
      </div>
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
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <ButtonGroup>
          <Button
            active={props.view === 'docs'}
            small
            icon={<Icon size={14} icon="book" />}
            text="Preview"
            onClick={() => props.onToggleView('preview')}
          />
          <Button
            active={stores.uiStore.activeWidget === stores.uiStore.widgets.lint}
            small
            text={
              <div className="flex justify-center">
                <Icon
                  size={14}
                  icon="error"
                  intent={Intent.DANGER}
                  className="m-auto pl-2 pr-1"
                />
                <span className="counter m-auto">{errors.length}</span>
                <Icon
                  size={14}
                  intent={Intent.WARNING}
                  icon="warning-sign"
                  className="m-auto pl-2 pr-1"
                />
                <span className="counter m-auto">{warning.length}</span>
                <Icon
                  size={14}
                  icon="info-sign"
                  intent={Intent.PRIMARY}
                  className="m-auto pl-2 pr-1"
                />
                <span className="counter m-auto">{info.length}</span>
                <Icon
                  size={14}
                  icon="lightbulb"
                  intent={Intent.SUCCESS}
                  className="m-auto pl-2 pr-1"
                />
                <span className="counter m-auto">{hints.length}</span>
              </div>
            }
            onClick={() => lintSpec()}
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
