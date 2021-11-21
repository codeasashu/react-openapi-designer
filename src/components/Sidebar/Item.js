import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tree from '../../Tree/Tree';
//import {eventTypes} from '../../utils/tree';
import {icons} from '../../utils/tree';
import NodeIcon from './NodeIcon';
import ExpandIcon from './ExpandIcon';
import NodeEditor from './NodeEditor';

const Item = ({
  className,
  isExpanded,
  isEdited,
  isExpandable,
  node,
  placeholder,
}) => {
  //const handleCaretClick = handleEvent(eventTypes.NodeCaretClick, node);
  const handleCaretClick = (e) => {
    console.log('caret clicked', e);
  };
  return (
    <div
      className={classnames('flex-1 flex items-center', className)}
      style={{paddingLeft: Tree.getLevel(node) * 15}}>
      {isExpandable && (
        <ExpandIcon
          onClick={handleCaretClick}
          expanded={isExpanded}
          icons={icons}
          node={node}
        />
      )}
      <NodeIcon expanded={isExpanded} icons={icons} node={node} />
      {isEdited ? (
        <NodeEditor node={node} placeholder={placeholder} />
      ) : (
        <>
          <span className="TreeListItem__label" title={node.name}>
            {node.name}
          </span>
          {node.metadata && node.metadata.subtype && (
            <span className="absolute capitalize bp3-tag right-0 mr-12 mt-2 bg-gray">
              {node.metadata.subtype}
            </span>
          )}
        </>
      )}
    </div>
  );
};

Item.propTypes = {
  className: PropTypes.any,
  isExpandable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isEdited: PropTypes.bool,
  node: PropTypes.object,
  placeholder: PropTypes.string,
};

export default Item;
