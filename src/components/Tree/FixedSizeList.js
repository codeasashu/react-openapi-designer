import BaseList from './BaseList';

const FixedSizeList = BaseList({
  getItemOffset: function (e, t) {
    return e.itemSize * t;
  },

  getItemSize: function (e, t) {
    return e.itemSize;
  },

  getEstimatedTotalSize: function (e) {
    var t = e.itemCount;
    return t * e.itemSize;
  },

  getOffsetForIndexAndAlignment: function (e, t, n, r) {
    var o = e.direction;
    var i = e.height;
    var a = e.itemCount;
    var s = e.itemSize;
    var c = e.layout;
    var l = e.width;
    var u = o === 'horizontal' || c === 'horizontal' ? l : i;
    var d = Math.max(0, s * a - u);
    var f = Math.min(d, s * t);
    var p = Math.max(0, s * t - u + s);

    switch (
      (n === 'smart' && (n = p - u <= r && f + u >= r ? 'auto' : 'center'), n)
    ) {
      case 'start':
        return f;
      case 'end':
        return p;
      case 'center':
        var h = Math.round(p + (f - p) / 2);

        if (Math.ceil(u / 2) > h) {
          return 0;
        } else {
          if (d + Math.floor(u / 2) < h) {
            return d;
          } else {
            return h;
          }
        }
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

  getStartIndexForOffset: function (e, t) {
    var n = e.itemCount;
    var r = e.itemSize;
    return Math.max(0, Math.min(n - 1, Math.floor(t / r)));
  },

  getStopIndexForStartIndex: function (e, t, n) {
    var r = e.direction;
    var o = e.height;
    var i = e.itemCount;
    var a = e.itemSize;
    var s = e.layout;
    var c = e.width;
    var l = a * t;
    var u = r === 'horizontal' || s === 'horizontal' ? c : o;
    var d = Math.ceil((u + n - l) / a);
    return Math.max(0, Math.min(i - 1, t + d - 1));
  },

  initInstanceProps: function (e) {},
  shouldResetStyleCacheOnItemSizeChange: true,

  validateProps: function (e) {
    e.itemSize;
  },
});

export default FixedSizeList;
