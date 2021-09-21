import BaseList from './BaseList';

var I = function (e, t, n, r) {
  var o = e.itemCount;

  for (var i = 1; o > n && r > C(e, n, t).offset; ) {
    n += i;
    i *= 2;
  }

  return A(e, t, Math.min(n, o - 1), Math.floor(n / 2), r);
};

var A = function (e, t, n, r, o) {
  for (; n >= r; ) {
    var i = r + Math.floor((n - r) / 2);
    var a = C(e, i, t).offset;

    if (o === a) {
      return i;
    }

    if (o > a) {
      r = i + 1;
    } else {
      if (o < a) {
        n = i - 1;
      }
    }
  }

  if (r > 0) {
    return r - 1;
  } else {
    return 0;
  }
};

var C = function (e, t, n) {
  var r = e.itemSize;
  var o = n.itemMetadataMap;
  var i = n.lastMeasuredIndex;

  if (i < t) {
    var a = 0;

    if (i >= 0) {
      var s = o[i];
      a = s.offset + s.size;
    }

    for (var c = i + 1; t >= c; c++) {
      var l = r(c);

      o[c] = {
        offset: a,
        size: l,
      };

      a += l;
    }

    n.lastMeasuredIndex = t;
  }

  return o[t];
};

var getEstimatedTotalSize = (e, t) => {
  var n = e.itemCount;
  var r = t.itemMetadataMap;
  var o = t.estimatedItemSize;
  var i = t.lastMeasuredIndex;
  var a = 0;

  if (n <= i) {
    i = n - 1;
  }

  if (i >= 0) {
    var s = r[i];
    a = s.offset + s.size;
  }

  return a + o * (n - i - 1);
};

const VariableSizeList = BaseList({
  getItemOffset: function (e, t, n) {
    return C(e, t, n).offset;
  },

  getItemSize: function (e, t, n) {
    return n.itemMetadataMap[t].size;
  },

  getEstimatedTotalSize,

  getOffsetForIndexAndAlignment: function (e, t, n, r, o) {
    var i = e.direction;
    var a = e.height;
    var s = e.layout;
    var c = e.width;
    var l = i === 'horizontal' || s === 'horizontal' ? c : a;
    var u = C(e, t, o);
    var d = getEstimatedTotalSize(e, o);
    var f = Math.max(0, Math.min(d - l, u.offset));
    var p = Math.max(0, u.offset - l + u.size);

    switch (
      (n === 'smart' && (n = p - l <= r && f + l >= r ? 'auto' : 'center'), n)
    ) {
      case 'start':
        return f;
      case 'end':
        return p;
      case 'center':
        return Math.round(p + (f - p) / 2);
      case 'auto':
      default:
        if (p <= r && f >= r) {
          return r;
        } else {
          if (p > r) {
            return p;
          } else {
            return f;
          }
        }
    }
  },

  getStartIndexForOffset: function (props, scrollOffset, instanceProps) {
    // e, t, n
    const {itemMetadataMap, lastMeasuredIndex} = instanceProps;
    if (
      scrollOffset <=
      (lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0)
    ) {
      return A(props, instanceProps, lastMeasuredIndex, 0, scrollOffset);
    } else {
      return I(
        props,
        instanceProps,
        Math.max(0, lastMeasuredIndex),
        scrollOffset,
      );
    }
  },

  getStopIndexForStartIndex: function (e, t, n, r) {
    var o = e.direction;
    var i = e.height;
    var a = e.itemCount;
    var s = e.layout;
    var c = e.width;
    var l = o === 'horizontal' || s === 'horizontal' ? c : i;
    var u = C(e, t, r);
    var d = n + l;
    var f = u.offset + u.size;

    for (var p = t; a - 1 > p && d > f; ) {
      p++;
      f += C(e, p, r).size;
    }

    return p;
  },

  initInstanceProps: function (e, t) {
    var n = {
      itemMetadataMap: {},
      estimatedItemSize: e.estimatedItemSize || 50,
      lastMeasuredIndex: -1,
    };

    t.resetAfterIndex = function (e, r) {
      if (r === undefined) {
        r = true;
      }

      n.lastMeasuredIndex = Math.min(n.lastMeasuredIndex, e - 1);
      t._getItemStyleCache(-1);

      if (r) {
        t.forceUpdate();
      }
    };

    return n;
  },

  shouldResetStyleCacheOnItemSizeChange: false,

  validateProps: function (e) {
    e.itemSize;
  },
});

export default VariableSizeList;
