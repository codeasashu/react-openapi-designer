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
const x = (e, t) => {
  return e;
};

var p = null;
function scrollDirection(e) {
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

const validateInstance = (instance) => {
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

const memo = function (e, t) {
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

function BaseList(props) {
  // e
  const {
    getItemOffset,
    getEstimatedTotalSize,
    getItemSize,
    getOffsetForIndexAndAlignment,
    getStartIndexForOffset,
    getStopIndexForStartIndex,
    initInstanceProps,
    shouldResetStyleCacheOnItemSizeChange,
    validateProps,
  } = props; // c

  const innerComponent = function () {
    //e
    function getInstance(caller) {
      // t
      const instance = React.PureComponent.call(this, caller) || this;
      instance._instanceProps = initInstanceProps(
        instance.props,
        validateInstance(validateInstance(instance)),
      );

      instance._outerRef = undefined;
      instance._resetIsScrollingTimeoutId = null;

      instance.state = {
        instance: validateInstance(validateInstance(instance)),
        isScrolling: false,
        scrollDirection: 'forward',
        scrollOffset:
          typeof instance.props.initialScrollOffset == 'number'
            ? instance.props.initialScrollOffset
            : 0,
        scrollUpdateWasRequested: false,
      };

      instance._callOnItemsRendered = memo(
        (
          overscanStartIndex,
          overscanStopIndex,
          visibleStartIndex,
          visibleStopIndex,
        ) =>
          instance.props.onItemsRendered({
            overscanStartIndex,
            overscanStopIndex,
            visibleStartIndex,
            visibleStopIndex,
          }),
      );

      instance._callOnScroll = undefined;

      instance._callOnScroll = memo(
        (scrollDirection, scrollOffset, scrollUpdateWasRequested) =>
          instance.props.onScroll({
            scrollDirection,
            scrollOffset,
            scrollUpdateWasRequested,
          }),
      );

      instance._getItemStyle = (item) => {
        // e
        let style;
        const {direction, itemSize, layout} = instance.props; // r
        let styleCache = instance._getItemStyleCache(
          shouldResetStyleCacheOnItemSizeChange && itemSize,
          shouldResetStyleCacheOnItemSizeChange && layout,
          shouldResetStyleCacheOnItemSizeChange && direction,
        );

        if (Object.prototype.hasOwnProperty.call(styleCache, item)) {
          style = styleCache[item];
        } else {
          const offset = getItemOffset(
            instance.props,
            item,
            instance._instanceProps,
          ); //l
          const size = getItemSize(
            instance.props,
            item,
            instance._instanceProps,
          ); //u
          const isHorizontal =
            direction === 'horizontal' || layout === 'horizontal';
          const isRight = direction === 'rtl';
          const padding = isHorizontal ? offset : 0;

          styleCache[item] = style = {
            position: 'absolute',
            left: isRight ? undefined : padding,
            right: isRight ? padding : undefined,
            top: isHorizontal ? 0 : offset,
            height: isHorizontal ? '100%' : size,
            width: isHorizontal ? size : '100%',
          };
        }

        return style;
      };

      instance._getItemStyleCache = memo(function (
        // eslint-disable-next-line no-unused-vars
        itemSize,
        // eslint-disable-next-line no-unused-vars
        layout,
        // eslint-disable-next-line no-unused-vars
        direction,
      ) {
        return {};
      });

      instance._onScrollHorizontal = (e) => {
        const {width, scrollLeft, scrollWidth} = e;

        instance.setState((draft) => {
          if (scrollLeft === draft.scrollOffset) {
            return null;
          }

          const {direction} = instance.props; //t
          let scrollOffset = scrollLeft;

          if (direction === 'rtl') {
            switch (scrollDirection()) {
              case 'negative':
                scrollOffset = -scrollLeft;
                break;
              case 'positive-descending':
                scrollOffset = scrollWidth - width - scrollLeft;
            }
          }

          scrollOffset = Math.max(
            0,
            Math.min(scrollOffset, scrollWidth - scrollLeft),
          );

          return {
            isScrolling: true,
            scrollDirection:
              scrollLeft > draft.scrollOffset ? 'forward' : 'backward',
            scrollOffset,
            scrollUpdateWasRequested: false,
          };
        }, instance._resetIsScrollingDebounced);
      };

      instance._onScrollVertical = function (e) {
        var t = e.currentTarget;
        var r = t.clientHeight;
        var o = t.scrollHeight;
        var i = t.scrollTop;

        instance.setState(function (e) {
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
        }, instance._resetIsScrollingDebounced);
      };

      instance._outerRefSetter = function (e) {
        var t = instance.props.outerRef;
        instance._outerRef = e;

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

      instance._resetIsScrollingDebounced = function () {
        if (instance._resetIsScrollingTimeoutId !== null) {
          cancelAnimationFrame(instance._resetIsScrollingTimeoutId.id);
        }

        instance._resetIsScrollingTimeoutId = d(
          instance._resetIsScrolling,
          150,
        );
      };

      instance._resetIsScrolling = function () {
        instance._resetIsScrollingTimeoutId = null;

        instance.setState(
          {
            isScrolling: false,
          },
          function () {
            instance._getItemStyleCache(-1, null);
          },
        );
      };

      return instance;
    }

    setProto(getInstance, React.PureComponent);

    getInstance.getDerivedStateFromProps = function (props, state) {
      j(props, state);
      validateProps(props);
      return null;
    };

    var instance = getInstance.prototype;

    instance.scrollTo = function (position) {
      const scrollOffset = Math.max(0, position);

      this.setState((draft) => {
        if (scrollOffset === draft.scrollOffset) {
          return null;
        } else {
          return {
            scrollDirection:
              scrollOffset > draft.scrollOffset ? 'forward' : 'backward',
            scrollOffset: scrollOffset,
            scrollUpdateWasRequested: true,
          };
        }
      }, this._resetIsScrollingDebounced);
    };

    instance.scrollToItem = function (e, t) {
      if (t === undefined) {
        t = 'auto';
      }

      var n = this.props.itemCount;
      var r = this.state.scrollOffset;
      e = Math.max(0, Math.min(e, n - 1));
      this.scrollTo(
        getOffsetForIndexAndAlignment(this.props, e, t, r, this._instanceProps),
      );
    };

    instance.componentDidMount = function () {
      const {direction, initialScrollOffset, layout} = this.props;

      if (typeof initialScrollOffset == 'number' && this._outerRef != null) {
        let outerRef = this._outerRef;

        if (direction === 'horizontal' || layout === 'horizontal') {
          outerRef.scrollLeft = initialScrollOffset;
        } else {
          outerRef.scrollTop = initialScrollOffset;
        }
      }

      this._callPropsCallbacks();
    };

    instance.componentDidUpdate = function () {
      const {direction, layout} = this.props;
      const {scrollOffset} = this.state;

      if (this.state.scrollUpdateWasRequested && this._outerRef != null) {
        const outerRef = this._outerRef;

        if (direction === 'horizontal' || layout === 'horizontal') {
          if (direction === 'rtl') {
            switch (scrollDirection()) {
              case 'negative':
                outerRef.scrollLeft = -scrollOffset;
                break;
              case 'positive-ascending':
                outerRef.scrollLeft = scrollOffset;
                break;
              default:
                var clientWidth = outerRef.clientWidth;
                var scrollWidth = outerRef.scrollWidth;
                outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset;
            }
          } else {
            outerRef.scrollLeft = scrollOffset;
          }
        } else {
          outerRef.scrollTop = scrollOffset;
        }
      }

      this._callPropsCallbacks();
    };

    instance.componentWillUnmount = function () {
      if (this._resetIsScrollingTimeoutId !== null) {
        cancelAnimationFrame(this._resetIsScrollingTimeoutId.id);
      }
    };

    instance.render = function () {
      var e = this.props;
      var t = e.children;
      var n = e.className;
      var o = e.direction;
      var i = e.height;
      var a = e.innerRef;
      var c = e.innerElementType;
      var u = e.innerTagName;
      var d = e.itemCount;
      var f = e.itemData;
      var p = e.itemKey;
      var h = p === undefined ? x : p;
      var m = e.layout;
      var g = e.outerElementType;
      var b = e.outerTagName;
      var v = e.style;
      var y = e.useIsScrolling;
      var w = e.width;
      var E = this.state.isScrolling;
      var _ = o === 'horizontal' || m === 'horizontal';
      var O = _ ? this._onScrollHorizontal : this._onScrollVertical;
      var S = this._getRangeToRender();
      var k = S[0];
      var T = S[1];
      var j = [];

      if (d > 0) {
        for (var C = k; T >= C; C++) {
          j.push(
            React.createElement(t, {
              data: f,
              key: h(C, f),
              index: C,
              isScrolling: y ? E : undefined,
              style: this._getItemStyle(C),
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

    instance._callPropsCallbacks = function () {
      if (
        typeof this.props.onItemsRendered == 'function' &&
        this.props.itemCount > 0
      ) {
        var renderRange = this._getRangeToRender();
        var overscanStartIndex = renderRange[0];
        var overscanStopIndex = renderRange[1];
        var startIndex = renderRange[2];
        var stopIndex = renderRange[3];
        this._callOnItemsRendered(
          overscanStartIndex,
          overscanStopIndex,
          startIndex,
          stopIndex,
        );
      }

      if (typeof this.props.onScroll == 'function') {
        const {scrollDirection, scrollOffset, scrollUpdateWasRequested} =
          this.state;
        this._callOnScroll(
          scrollDirection,
          scrollOffset,
          scrollUpdateWasRequested,
        );
      }
    };

    instance._getRangeToRender = function () {
      const {itemCount, overscanCount} = this.props;
      const {scrollOffset, isScrolling, scrollDirection} = this.state;

      if (itemCount === 0) {
        return [0, 0, 0, 0];
      }

      var startIndex = getStartIndexForOffset(
        this.props,
        scrollOffset,
        this._instanceProps,
      );
      var stopIndex = getStopIndexForStartIndex(
        this.props,
        startIndex,
        scrollOffset,
        this._instanceProps,
      );

      var topRange =
        isScrolling && scrollDirection !== 'backward'
          ? 1
          : Math.max(1, overscanCount);
      var bottomRange =
        isScrolling && scrollDirection !== 'forward'
          ? 1
          : Math.max(1, overscanCount);
      return [
        Math.max(0, startIndex - topRange),
        Math.max(0, Math.min(itemCount - 1, stopIndex + bottomRange)),
        startIndex,
        stopIndex,
      ];
    };

    return getInstance;
  };

  innerComponent.defaultProps = {
    direction: 'ltr',
    itemData: undefined,
    layout: 'vertical',
    overscanCount: 2,
    useIsScrolling: false,
  };

  return innerComponent;
}

export default BaseList;
