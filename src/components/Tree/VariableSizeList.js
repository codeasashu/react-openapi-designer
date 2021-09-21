import BaseList from './BaseList';

var getLastScrollIndex = function (
  props,
  instanceProps,
  lastMeasuredIndex,
  scrollOffset,
) {
  const itemCount = props.itemCount;

  for (
    let i = 1;
    itemCount > lastMeasuredIndex &&
    scrollOffset >
      getNodeAtIndex(props, lastMeasuredIndex, instanceProps).offset;

  ) {
    lastMeasuredIndex += i;
    i *= 2;
  }

  return getScrollIndex(
    props,
    instanceProps,
    Math.min(lastMeasuredIndex, itemCount - 1),
    Math.floor(lastMeasuredIndex / 2),
    scrollOffset,
  );
};

const getScrollIndex = (
  props,
  instanceProps,
  lastMeasuredIndex,
  initialIndex,
  scrollOffset,
) => {
  for (; lastMeasuredIndex >= initialIndex; ) {
    const lastIndex =
      initialIndex + Math.floor((lastMeasuredIndex - initialIndex) / 2); // i
    const lastOffset = getNodeAtIndex(props, lastIndex, instanceProps).offset; // a

    if (scrollOffset === lastOffset) {
      return lastIndex;
    }

    if (scrollOffset > lastOffset) {
      initialIndex = lastIndex + 1;
    } else {
      if (scrollOffset < lastOffset) {
        lastMeasuredIndex = initialIndex - 1;
      }
    }
  }

  return initialIndex > 0 ? initialIndex - 1 : 0;
};

// Should be `getItemMetaDataAtIndex`
const getNodeAtIndex = (props, index, instanceProps) => {
  const {itemMetadataMap, lastMeasuredIndex} = instanceProps;
  const {itemSize} = props;

  if (lastMeasuredIndex < index) {
    let offset = 0;

    if (lastMeasuredIndex >= 0) {
      const lastNode = itemMetadataMap[lastMeasuredIndex];
      offset = lastNode.offset + lastNode.size;
    }

    for (let i = lastMeasuredIndex + 1; i <= index; i++) {
      var size = itemSize(i);

      itemMetadataMap[i] = {
        offset,
        size,
      };

      offset += size;
    }

    instanceProps.lastMeasuredIndex = index;
  }

  return itemMetadataMap[index];
};

//var C = function (e, t, n) {
//var r = e.itemSize;
//var o = n.itemMetadataMap;
//var i = n.lastMeasuredIndex;

//if (i < t) {
//var a = 0;

//if (i >= 0) {
//var s = o[i];
//a = s.offset + s.size;
//}

//for (var c = i + 1; t >= c; c++) {
//var l = r(c);

//o[c] = {
//offset: a,
//size: l,
//};

//a += l;
//}

//n.lastMeasuredIndex = t;
//}

//return o[t];
//};

var getEstimatedTotalSize = (props, instanceProps) => {
  const {itemCount} = props;
  let {itemMetadataMap, estimatedItemSize, lastMeasuredIndex} = instanceProps;
  let lastOffset = 0;

  if (itemCount <= lastMeasuredIndex) {
    lastMeasuredIndex = itemCount - 1;
  }

  if (lastMeasuredIndex >= 0) {
    const lastNode = itemMetadataMap[lastMeasuredIndex];
    lastOffset = lastNode.offset + lastNode.size;
  }

  return lastOffset + estimatedItemSize * (itemCount - lastMeasuredIndex - 1);
};

const VariableSizeList = BaseList({
  getItemOffset: (props, lastIndex, instanceProps) =>
    getNodeAtIndex(props, lastIndex, instanceProps).offset,

  getItemSize: function (e, t, n) {
    return n.itemMetadataMap[t].size;
  },

  getEstimatedTotalSize,

  //getOffsetForIndexAndAlignment: function (e, t, n, r, o) {
  getOffsetForIndexAndAlignment: function (
    props,
    index,
    strategy,
    scrollOffset,
    instanceProps,
  ) {
    const {direction, height, layout, width} = props;
    var offset =
      direction === 'horizontal' || layout === 'horizontal' ? width : height; // l
    var currentNode = getNodeAtIndex(props, index, instanceProps); // u
    var totalSize = getEstimatedTotalSize(props, instanceProps); //d
    var endOffset = Math.max(
      0,
      Math.min(totalSize - offset, currentNode.offset),
    ); //f
    var startOffset = Math.max(
      0,
      currentNode.offset - (offset + currentNode.size),
    ); //p

    const selectedStrategy =
      strategy === 'smart'
        ? startOffset - offset <= scrollOffset &&
          endOffset + offset >= scrollOffset
          ? 'auto'
          : 'center'
        : strategy;
    switch (selectedStrategy) {
      case 'start':
        return endOffset;
      case 'end':
        return startOffset;
      case 'center':
        return Math.round(startOffset + (endOffset - startOffset) / 2);
      case 'auto':
      default:
        if (startOffset <= scrollOffset && endOffset >= scrollOffset) {
          return scrollOffset;
        } else {
          if (startOffset > scrollOffset) {
            return startOffset;
          } else {
            return endOffset;
          }
        }
    }
  },

  getStartIndexForOffset: function (props, scrollOffset, instanceProps) {
    const {itemMetadataMap, lastMeasuredIndex} = instanceProps;
    const lastOffset =
      lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
    if (scrollOffset <= lastOffset) {
      return getScrollIndex(
        props,
        instanceProps,
        lastMeasuredIndex,
        0,
        scrollOffset,
      );
    } else {
      return getLastScrollIndex(
        props,
        instanceProps,
        Math.max(0, lastMeasuredIndex),
        scrollOffset,
      );
    }
  },

  getStopIndexForStartIndex: (
    props,
    lastMeasuredIndex,
    scrollOffset,
    instanceProps,
  ) => {
    const {direction, height, itemCount, layout, width} = props;
    const offset =
      direction === 'horizontal' || layout === 'horizontal' ? width : height;
    const lastNode = getNodeAtIndex(props, lastMeasuredIndex, instanceProps);
    var currentSize = scrollOffset + offset;
    var lastSize = lastNode.offset + lastNode.size;

    let stopIndex = lastMeasuredIndex;
    for (; itemCount - 1 > stopIndex && currentSize > lastSize; ) {
      stopIndex++;
      lastSize += getNodeAtIndex(props, stopIndex, instanceProps).size;
    }

    return stopIndex;
  },

  initInstanceProps: (props, instanceRef) => {
    const instanceProps = {
      itemMetadataMap: {},
      estimatedItemSize: props.estimatedItemSize || 50,
      lastMeasuredIndex: -1,
    };

    instanceRef.resetAfterIndex = (index, updateTree) => {
      if (updateTree === undefined) {
        updateTree = true;
      }

      instanceProps.lastMeasuredIndex = Math.min(
        instanceProps.lastMeasuredIndex,
        index - 1,
      );
      instanceRef._getItemStyleCache(-1);

      if (updateTree) {
        instanceRef.forceUpdate();
      }
    };

    return instanceProps;
  },

  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: function (e) {
    e.itemSize;
  },
});

export default VariableSizeList;
