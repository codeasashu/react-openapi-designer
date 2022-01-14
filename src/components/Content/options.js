import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';
import {Button, ButtonGroup, Icon, Intent} from '@blueprintjs/core';
import {StoresContext} from '../Context';
import {NodeCategories, NodeTypes} from '../../datasets/tree';
import Tags from './tags';

const Options = observer(({relativeJsonPath, node, onDelete}) => {
  const stores = React.useContext(StoresContext);
  const {activeWidget, activeView, widgets, views} = stores.uiStore;
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
                if (onDelete) {
                  onDelete();
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
            active={activeView === views.form}
            small
            icon={<Icon size={14} icon="form" />}
            text="Form"
            onClick={() => stores.uiStore.setActiveView(views.form)}
          />
          <Button
            active={activeView === views.code}
            small
            icon={<Icon size={14} icon="code" />}
            text="Code"
            onClick={() => stores.uiStore.setActiveView(views.code)}
          />
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <Button
          active={activeView === views.preview}
          small
          icon={<Icon size={14} icon="document" />}
          text="Preview"
          onClick={() => stores.uiStore.setActiveView(views.preview)}
        />
      </div>
      <div className="ml-3">
        <ButtonGroup>
          {node && node.type === NodeTypes.Operation && (
            <Button
              active={activeWidget === widgets.samples}
              small
              icon={<Icon size={14} icon="code" />}
              text="Samples"
              onClick={() => stores.uiStore.toggleWidget(widgets.samples)}
            />
          )}
          <Button
            active={activeWidget === widgets.lint}
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
