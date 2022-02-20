import React from 'react';
import PropTypes from 'prop-types';
import {clone, isEqual} from 'lodash';
import AutosizeInput from 'react-input-autosize';
import {isParentNode} from '../../../utils/tree';
import {Icon} from '@blueprintjs/core';
import Container from './TypeSelector/container';
import {eventTypes} from '../../../datasets/tree';

const Ps = (e) => {
  var t;
  var n;
  const r = clone((t = e.extraProps) !== null && t !== undefined ? t : {});
  const i = clone(
    (n = e.subtypeExtraProps) !== null && n !== undefined ? n : {},
  );
  let o = [];

  if (e.type instanceof Array) {
    o = e.type;
  } else {
    if (e.type) {
      o = [e.type];
    }
  }

  return {
    type: o,
    subtype: Array.isArray(e.subtype)
      ? e.subtype
      : e.subtype
      ? [e.subtype]
      : [],
    refPath: e.refPath,
    extraProps: r,
    subtypeExtraProps: i,
  };
};

const SubType = (e) => {
  const {childCount: t, type: n, level: r, rootName: i, className: o} = e;

  if (r === 0 && i) {
    return null;
  }

  if (t !== undefined) {
    let e;
    e =
      (Array.isArray(n) && n.includes('array')) || n === 'array'
        ? `[${t}]`
        : `{${t}}`;

    return <div className={o}>{e}</div>;
  }

  return null;
};
const Caret = ({node, hasChildren, treeStore}) => {
  const toggleExpand = () => {
    console.log('toggleExpand');
  };
  return hasChildren && treeStore.isParentNode(node) ? (
    <div
      className="flex justify-center cursor-pointer p-1 rounded hover:bg-darken-3"
      style={{
        marginLeft: -23.5,
        marginRight: 3.5,
        width: 20,
        height: 20,
      }}
      onClick={toggleExpand}
      data-test="row-collapse">
      <Icon
        icon={treeStore.isNodeExpanded(node) ? 'caret-down' : 'caret-right'}
      />
    </div>
  ) : null;
};

Caret.propTypes = {
  node: PropTypes.object.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  treeStore: PropTypes.object.isRequired,
};

const SchemaInput = ({
  value,
  isAutoFocusBlocked,
  setAutoFocusBlocked,
  children,
  ...props
}) => {
  const [val, setVal] = React.useState(value || '');

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const {current: e} = inputRef;

    if (isAutoFocusBlocked === false && e !== null && val === '') {
      e.focus();
      setAutoFocusBlocked(true);
    }
  }, [inputRef.current, isAutoFocusBlocked]);

  const handleBlur = () => {
    if (props.onChange && value !== val) {
      props.onChange(val);
    }
  };

  const handleChange = (e) => {
    setVal(e.target.value);
  };

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <span style={{maxWidth: 250}}>
      <AutosizeInput
        value={val}
        onBlur={handleBlur}
        onChange={handleChange}
        inputStyle={{
          outline: 'none',
        }}
        tabIndex={1}
        inputClassName="bg-transparent hover:bg-darken-1 focus:bg-darken-2"
        {...props}>
        {children}
      </AutosizeInput>
    </span>
  );
};

SchemaInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  isAutoFocusBlocked: PropTypes.bool,
  setAutoFocusBlocked: PropTypes.func,
  children: PropTypes.any,
};

const SchemaRow = (props) => {
  const {
    level,
    node,
    type,
    subtype,
    refPath,
    enumValue,
    childCount,
    store,
    isCombinerChild,
    rootName,
    isAutoFocusBlocked,
    setAutoFocusBlocked,
    getRefLabel,
    shouldRenderGoToRef,
    refSelector,
    format,
    isLast,
    parent,
  } = props;
  const hasChildren = !!(
    level > 0 &&
    isParentNode(node) &&
    childCount &&
    childCount > 0
  );

  //const {
  //node: r,
  //level: i,
  //index: o,
  //type: a,
  //subtype: u,
  //childCount: l,
  //extraProps: d,
  //isCombinerChild: h,
  //name: f,
  //rootName: p,
  //path: g,
  //changeHandler: m,
  //removeHandler: v,
  //isLast: y,
  //parent: b,

  //store: { treeStore: _ },

  //enumValue: w,
  //format: M,
  //refPath: x,
  //getRefLabel: N,
  //shouldRenderGoToRef: C,
  //customRowActionRenderer: I,
  //refSelector: D,
  //isAutoFocusBlocked: j,
  //setAutoFocusBlocked: k,
  //cloneHandler: A,
  //swapHandler: T,
  //} = props;

  const handleAdd = () => {
    console.log('Add');
  };

  const handleRefClick = () => {
    var e;

    this.props.store.emit(
      eventTypes.GoToRef,
      String((e = refPath) !== null && e !== undefined ? e : ''),
    );
  };

  const handleSaveDetails = (e, t, n, r, i) => {
    const {
      path: o,
      type: a,
      subtype: s,
      refPath: u,
      extraProps: c,
      subtypeExtraProps: l,
      propsChangeHandler: d,
      typeChangeHandler: h,
    } = props;

    if (isEqual(l, i)) {
      if (!isEqual(c, r)) {
        d(o, r);
      }
    } else {
      d(o.concat(['children', '0']), i);
    }

    if (!(isEqual(a, e) && isEqual(s, t) && u === n)) {
      h(null, a, e, o, s, t, typeof n != 'string' ? (u != null ? u : null) : n);
    }
  };

  return (
    <div
      className="flex-1 flex items-center overflow-hidden"
      style={{marginLeft: 7, marginRight: 7}}>
      <div
        className="flex flex-1 items-center text-sm leading-tight w-full h-full relative overflow-hidden"
        style={{
          paddingLeft: (level + 1) * 20 + 7,
        }}>
        <Caret node={node} hasChildren={hasChildren} treeStore={store} />
        <div className="flex items-center flex-1 text-sm mr-2 overflow-hidden">
          {!isCombinerChild && (level != 0 || rootName) && (
            <SchemaInput
              type="text"
              value={name}
              minWidth={0}
              isAutoFocusBlocked={isAutoFocusBlocked}
              setAutoFocusBlocked={setAutoFocusBlocked}
              onKeyDown={(e) => {
                if (
                  isLast &&
                  parent &&
                  parent.metadata &&
                  node.parent &&
                  isParentNode(node.parent)
                ) {
                  if (
                    ['Tab', 'Enter'].includes(e.key) &&
                    parent &&
                    parent.metadata
                  ) {
                    setAutoFocusBlocked(false);
                    handleAdd(node.parent, parent.metadata);
                  }
                }
              }}
            />
          )}
          <Container
            store={store}
            level={level}
            type={type}
            isCombinerChild={isCombinerChild}
            subtype={subtype}
            enumValue={enumValue}
            format={format}
            refPath={refPath}
            refSelector={refSelector}
            getRefLabel={getRefLabel}
            shouldRenderGoToRef={shouldRenderGoToRef}
            rootName={rootName}
            onRefClick={handleRefClick}
            rowState={Ps(props)}
            handleSaveDetails={handleSaveDetails}
          />
          <SubType
            className="ml-2 text-darken-7 dark:text-lighten-9"
            childCount={childCount}
            type={type}
            level={level}
          />
        </div>
      </div>
    </div>
  );
};

SchemaRow.propTypes = {
  level: PropTypes.number,
  node: PropTypes.object,
  type: PropTypes.string,
  subtype: PropTypes.string,
  index: PropTypes.number,
  parent: PropTypes.object,
  childCount: PropTypes.number,
  store: PropTypes.object,
  isCombinerChild: PropTypes.bool,
  rootName: PropTypes.string,
  isAutoFocusBlocked: PropTypes.bool,
  isLast: PropTypes.bool,
  setAutoFocusBlocked: PropTypes.func,
  refPath: PropTypes.string,
  extraProps: PropTypes.object,
  subtypeExtraProps: PropTypes.object,
  propsChangeHandler: PropTypes.func,
  typeChangeHandler: PropTypes.func,
  path: PropTypes.array,
  enumValue: PropTypes.string,
  getRefLabel: PropTypes.func,
  shouldRenderGoToRef: PropTypes.func,
  refSelector: PropTypes.func,
  format: PropTypes.string,
};

export default SchemaRow;
