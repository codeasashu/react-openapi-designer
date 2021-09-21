/* eslint-disable react/display-name */
import React from 'react';

function setProto(e, t) {
  e.prototype = Object.create(t.prototype);
  e.prototype.constructor = e;
  Object.setPrototypeOf(e, t);
}

var l =
  typeof performance == 'object' && typeof performance.now == 'function'
    ? function () {
        return performance.now();
      }
    : function () {
        return Date.now();
      };

function d(e, t) {
  var n = l();

  var r = {
    id: requestAnimationFrame(function o() {
      if (t <= l() - n) {
        e.call(null);
      } else {
        r.id = requestAnimationFrame(o);
      }
    }),
  };

  return r;
}

var j = function (e, t) {
  e.children;
  e.direction;
  e.height;
  e.layout;
  e.innerTagName;
  e.outerTagName;
  e.width;
  t.instance;
};

//eslint-disable-next-line no-unused-vars
const getItemKey = (e, t) => {
  return e;
};

var p = null;
function h(e) {
  if (e === undefined) {
    e = false;
  }

  if (p === null || e) {
    var t = document.createElement('div');
    var n = t.style;
    n.width = '50px';
    n.height = '50px';
    n.overflow = 'scroll';
    n.direction = 'rtl';
    var r = document.createElement('div');
    var o = r.style;
    o.width = '100px';
    o.height = '100px';
    t.appendChild(r);
    document.body.appendChild(t);

    if (t.scrollLeft > 0) {
      p = 'positive-descending';
    } else {
      t.scrollLeft = 1;
      p = t.scrollLeft === 0 ? 'negative' : 'positive-ascending';
    }

    document.body.removeChild(t);
    return p;
  }

  return p;
}

const getInstance = (instance) => {
  if (instance === undefined) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }

  return instance;
};

function areEqual(e, t) {
  if (t.length !== e.length) {
    return false;
  }

  for (var n = 0; e.length > n; n++) {
    if (t[n] !== e[n]) {
      return false;
    }
  }

  return true;
}

const abc = function (e, t) {
  var n;

  if (t === undefined) {
    t = areEqual;
  }

  var o;
  var i = [];
  var a = false;

  return function () {
    var r = [];

    for (var s = 0; arguments.length > s; s++) {
      r[s] = arguments[s];
    }

    if (!(a && this === n && t(r, i))) {
      o = e.apply(this, r);
      a = true;
      n = this;
      i = r;
    }

    return o;
  };
};

function BaseList(e) {
  const {getEstimatedTotalSize, initInstanceProps} = e;
  var t;
  var n;
  var c = e.getItemOffset;
  var f = e.getItemSize;
  var p = e.getOffsetForIndexAndAlignment;
  var m = e.getStartIndexForOffset;
  var g = e.getStopIndexForStartIndex;
  var v = e.shouldResetStyleCacheOnItemSizeChange;
  var y = e.validateProps;

  n = t = (function (e) {
    function t(t) {
      var n;
      (n = e.call(this, t) || this)._instanceProps = initInstanceProps(
        n.props,
        getInstance(getInstance(n)),
      );

      n._outerRef = undefined;
      n._resetIsScrollingTimeoutId = null;

      n.state = {
        instance: getInstance(getInstance(n)),
        isScrolling: false,
        scrollDirection: 'forward',
        scrollOffset:
          typeof n.props.initialScrollOffset == 'number'
            ? n.props.initialScrollOffset
            : 0,
        scrollUpdateWasRequested: false,
      };

      n._callOnItemsRendered = undefined;

      n._callOnItemsRendered = abc(function (e, t, r, o) {
        return n.props.onItemsRendered({
          overscanStartIndex: e,
          overscanStopIndex: t,
          visibleStartIndex: r,
          visibleStopIndex: o,
        });
      });

      n._callOnScroll = undefined;

      n._callOnScroll = abc(function (e, t, r) {
        return n.props.onScroll({
          scrollDirection: e,
          scrollOffset: t,
          scrollUpdateWasRequested: r,
        });
      });

      n._getItemStyle = undefined;

      n._getItemStyle = function (e) {
        var t;
        var r = n.props;
        var o = r.direction;
        var i = r.itemSize;
        var a = r.layout;
        var s = n._getItemStyleCache(v && i, v && a, v && o);

        if (Object.prototype.hasOwnProperty.call(s, e)) {
          t = s[e];
        } else {
          var l = c(n.props, e, n._instanceProps);
          var u = f(n.props, e, n._instanceProps);
          var d = o === 'horizontal' || a === 'horizontal';
          var p = o === 'rtl';
          var h = d ? l : 0;

          s[e] = t = {
            position: 'absolute',
            left: p ? undefined : h,
            right: p ? h : undefined,
            top: d ? 0 : l,
            height: d ? '100%' : u,
            width: d ? u : '100%',
          };
        }

        return t;
      };

      n._getItemStyleCache = undefined;

      // eslint-disable-next-line no-unused-vars
      n._getItemStyleCache = abc(function (e, t, n) {
        return {};
      });

      n._onScrollHorizontal = function (e) {
        var t = e.currentTarget;
        var r = t.clientWidth;
        var o = t.scrollLeft;
        var i = t.scrollWidth;

        n.setState(function (e) {
          if (o === e.scrollOffset) {
            return null;
          }

          var t = n.props.direction;
          var a = o;

          if (t === 'rtl') {
            switch (h()) {
              case 'negative':
                a = -o;
                break;
              case 'positive-descending':
                a = i - r - o;
            }
          }

          a = Math.max(0, Math.min(a, i - r));

          return {
            isScrolling: true,
            scrollDirection: o > e.scrollOffset ? 'forward' : 'backward',
            scrollOffset: a,
            scrollUpdateWasRequested: false,
          };
        }, n._resetIsScrollingDebounced);
      };

      n._onScrollVertical = function (e) {
        var t = e.currentTarget;
        var r = t.clientHeight;
        var o = t.scrollHeight;
        var i = t.scrollTop;

        n.setState(function (e) {
          if (i === e.scrollOffset) {
            return null;
          }

          var t = Math.max(0, Math.min(i, o - r));

          return {
            isScrolling: true,
            scrollDirection: t > e.scrollOffset ? 'forward' : 'backward',
            scrollOffset: t,
            scrollUpdateWasRequested: false,
          };
        }, n._resetIsScrollingDebounced);
      };

      n._outerRefSetter = function (e) {
        var t = n.props.outerRef;
        n._outerRef = e;

        if (typeof t == 'function') {
          t(e);
        } else {
          if (
            t != null &&
            typeof t == 'object' &&
            Object.prototype.hasOwnProperty.call(t, 'current')
          ) {
            t.current = e;
          }
        }
      };

      n._resetIsScrollingDebounced = function () {
        if (n._resetIsScrollingTimeoutId !== null) {
          cancelAnimationFrame(n._resetIsScrollingTimeoutId.id);
        }

        n._resetIsScrollingTimeoutId = d(n._resetIsScrolling, 150);
      };

      n._resetIsScrolling = function () {
        n._resetIsScrollingTimeoutId = null;

        n.setState(
          {
            isScrolling: false,
          },
          function () {
            n._getItemStyleCache(-1, null);
          },
        );
      };

      return n;
    }

    setProto(t, e);

    t.getDerivedStateFromProps = function (e, t) {
      j(e, t);
      y(e);
      return null;
    };

    var n = t.prototype;

    n.scrollTo = function (e) {
      e = Math.max(0, e);

      this.setState(function (t) {
        if (e === t.scrollOffset) {
          return null;
        } else {
          return {
            scrollDirection: e > t.scrollOffset ? 'forward' : 'backward',
            scrollOffset: e,
            scrollUpdateWasRequested: true,
          };
        }
      }, this._resetIsScrollingDebounced);
    };

    n.scrollToItem = function (e, t) {
      if (t === undefined) {
        t = 'auto';
      }

      var n = this.props.itemCount;
      var r = this.state.scrollOffset;
      e = Math.max(0, Math.min(e, n - 1));
      this.scrollTo(p(this.props, e, t, r, this._instanceProps));
    };

    n.componentDidMount = function () {
      var e = this.props;
      var t = e.direction;
      var n = e.initialScrollOffset;
      var r = e.layout;

      if (typeof n == 'number' && this._outerRef != null) {
        var o = this._outerRef;

        if (t === 'horizontal' || r === 'horizontal') {
          o.scrollLeft = n;
        } else {
          o.scrollTop = n;
        }
      }

      this._callPropsCallbacks();
    };

    n.componentDidUpdate = function () {
      var e = this.props;
      var t = e.direction;
      var n = e.layout;
      var r = this.state;
      var o = r.scrollOffset;

      if (r.scrollUpdateWasRequested && this._outerRef != null) {
        var i = this._outerRef;

        if (t === 'horizontal' || n === 'horizontal') {
          if (t === 'rtl') {
            switch (h()) {
              case 'negative':
                i.scrollLeft = -o;
                break;
              case 'positive-ascending':
                i.scrollLeft = o;
                break;
              default:
                var a = i.clientWidth;
                var s = i.scrollWidth;
                i.scrollLeft = s - a - o;
            }
          } else {
            i.scrollLeft = o;
          }
        } else {
          i.scrollTop = o;
        }
      }

      this._callPropsCallbacks();
    };

    n.componentWillUnmount = function () {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelAnimationFrame(this._resetIsScrollingTimeoutId.id);
      }
    };

    n.render = function () {
      const {itemCount, itemKey, useIsScrolling, children, itemData} =
        this.props;
      var e = this.props;
      var n = e.className;
      var o = e.direction;
      var i = e.height;
      var a = e.innerRef;
      var c = e.innerElementType;
      var u = e.innerTagName;
      var _itemKey = itemKey === undefined ? getItemKey : itemKey; // h
      var m = e.layout;
      var g = e.outerElementType;
      var b = e.outerTagName;
      var v = e.style;
      var w = e.width;
      var E = this.state.isScrolling;
      var _ = o === 'horizontal' || m === 'horizontal';
      var O = _ ? this._onScrollHorizontal : this._onScrollVertical;
      var indexRange = this._getRangeToRender(); // S
      //var overscanStartIndex = indexRange[0]; //k
      var overscanStartIndex = 0; //k
      var overscanStopIndex = indexRange[1]; //T
      var j = [];

      if (itemCount > 0) {
        for (
          let index = overscanStartIndex;
          index <= overscanStopIndex;
          index++
        ) {
          j.push(
            React.createElement(children, {
              data: itemData,
              key: _itemKey(index, itemData),
              index,
              isScrolling: useIsScrolling ? this.state.isScrolling : undefined,
              style: this._getItemStyle(index),
            }),
          );
        }
      }

      var A = getEstimatedTotalSize(this.props, this._instanceProps);

      return React.createElement(
        g || b || 'div',
        {
          className: n,
          onScroll: O,
          ref: this._outerRefSetter,
          style: Object.assign(
            {
              position: 'relative',
              height: i,
              width: w,
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              willChange: 'transform',
              direction: o,
            },
            v,
          ),
        },
        React.createElement(
          c || u || 'div',
          {
            ref: a,
            style: {
              height: _ ? '100%' : A,
              pointerEvents: E ? 'none' : undefined,
              width: _ ? A : '100%',
            },
          },
          j,
        ),
      );
    };

    n._callPropsCallbacks = function () {
      if (
        typeof this.props.onItemsRendered == 'function' &&
        this.props.itemCount > 0
      ) {
        var e = this._getRangeToRender();
        var t = e[0];
        var n = e[1];
        var r = e[2];
        var o = e[3];
        this._callOnItemsRendered(t, n, r, o);
      }

      if (typeof this.props.onScroll == 'function') {
        var i = this.state;
        var a = i.scrollDirection;
        var s = i.scrollOffset;
        var c = i.scrollUpdateWasRequested;
        this._callOnScroll(a, s, c);
      }
    };

    n._getRangeToRender = function () {
      var e = this.props;
      var t = e.itemCount;
      var n = e.overscanCount;
      var r = this.state;
      var o = r.isScrolling;
      var i = r.scrollDirection;
      var a = r.scrollOffset;

      if (t === 0) {
        return [0, 0, 0, 0];
      }

      var s = m(this.props, a, this._instanceProps);
      var c = g(this.props, s, a, this._instanceProps);
      var l = o && i !== 'backward' ? 1 : Math.max(1, n);
      var u = o && i !== 'forward' ? 1 : Math.max(1, n);
      return [Math.max(0, s - l), Math.max(0, Math.min(t - 1, c + u)), s, c];
    };

    return t;
  })(React.PureComponent);

  t.defaultProps = {
    direction: 'ltr',
    itemData: undefined,
    layout: 'vertical',
    overscanCount: 20,
    useIsScrolling: false,
  };

  return n;
}

export default BaseList;
