/* eslint no-unused-vars: 0 */
import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';

const TreeRow = (props) => {
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    treeId, // Delete from otherProps
    getPrevRow, // Delete from otherProps
    node, // Delete from otherProps
    path, // Delete from otherProps
    rowDirection,
    icons,
    ...otherProps
  } = props;

  let styles = {minWidth: '100%', position: 'relative'};
  if (node.type === 'path') {
    styles = {...styles, height: '50px'};
  }

  return (
    <div
      {...otherProps}
      className="TreeListItem TreeListItem--0 DesignTreeListItem"
      style={styles}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          icons,
          isOver,
          canDrop,
          draggedNode,
          lowerSiblingCounts,
          listIndex,
          swapFrom,
          swapLength,
          swapDepth,
        }),
      )}
    </div>
  );
};

TreeRow.defaultProps = {
  swapFrom: null,
  swapDepth: null,
  swapLength: null,
  canDrop: false,
  draggedNode: null,
};

TreeRow.propTypes = {
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  swapFrom: PropTypes.number,
  swapDepth: PropTypes.number,
  swapLength: PropTypes.number,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  icons: PropTypes.object,

  listIndex: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,

  // Drop target
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool,
  draggedNode: PropTypes.shape({}),

  // used in dndManager
  getPrevRow: PropTypes.func.isRequired,
  node: PropTypes.shape({}).isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  rowDirection: PropTypes.string.isRequired,
};

export default TreeRow;
