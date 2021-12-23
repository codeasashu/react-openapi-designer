import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {observer} from 'mobx-react';
import {StoresContext} from '../Context';
import EditableText from './EditableText';
import {reverseString, parsePath} from '../../utils/schema';
import {getMethodColor as getMethodTagColor} from '../../utils';

const PathItem = observer(({isEdited, node}) => {
  //const handleCaretClick = handleEvent(eventTypes.NodeCaretClick, node);

  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const isActiveNode = node.id === uiStore.activeNodeId;

  const handleMethodClick = (e, id) => {
    e.stopPropagation();
    stores.designTreeStore.setActiveNode(stores.graphStore.getNodeById(id));
  };

  let methodsTags = null;

  if (
    node.metadata !== undefined &&
    node.metadata.operations.items.length > 0
  ) {
    const activeId = node.metadata.operations.items.find(
      ({id}) => id === uiStore.activeNodeId,
    );

    const activeNode = isActiveNode || !!activeId;

    methodsTags = (
      <div className="uppercase mt-1 mb-1 truncate">
        {node.metadata.operations.items.map(({method, id}) => {
          return method ? (
            <span
              key={id}
              className={classnames(
                'bp3-tag mr-2 mt-1',
                'dark:bg-' + getMethodTagColor(method.toLowerCase()),
                {
                  ['bg-' + getMethodTagColor(method.toLowerCase())]: !(
                    activeNode || true
                  ),
                  'bg-white': activeNode || false,
                  'opacity-75 hover:opacity-100': !activeNode,
                  'opacity-100': !!activeNode,
                },
              )}
              role="button"
              onClick={(e) => handleMethodClick(e, id)}>
              {method}
            </span>
          ) : null;
        })}
      </div>
    );
  }

  return (
    <>
      <div
        className={classnames(
          'DesignTreeListItem__path relative h-full flex flex-col justify-center w-full',
          {
            'DesignTreeListItem__path--active': isActiveNode,
          },
        )}>
        {isEdited ? (
          <EditableText
            classnames="DesignTreeListItem__input"
            node={node}
            placeholder="/users/{userId}"
          />
        ) : (
          <>
            <span className="truncate text-left direction-rtl unicode-bidi">
              {parsePath(reverseString(node.name))
                .split('/')
                .map((name, index, items) => {
                  return name.startsWith('{') && name.endsWith('}') ? (
                    <React.Fragment key={index}>
                      <span className="opacity-75">{name}</span>
                      {items.length - 1 !== index ? '/' : ''}
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={index}>
                      {name}
                      {items.length - 1 !== index ? '/' : ''}
                    </React.Fragment>
                  );
                })}
            </span>
            {methodsTags}
          </>
        )}
      </div>
    </>
  );
});

PathItem.propTypes = {
  className: PropTypes.any,
  isExpandable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isEdited: PropTypes.bool,
  node: PropTypes.object,
  placeholder: PropTypes.string,
};

export default PathItem;
