import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  clone,
  isEqual,
  intersection,
  pickBy,
  isEmpty,
  compact,
  flattenDeep,
} from 'lodash';
import AutosizeInput from 'react-input-autosize';
import {isParentNode} from '../../../utils/tree';
import {
  TextArea,
  Button,
  Colors,
  Icon,
  Popover,
  Tooltip,
} from '@blueprintjs/core';
import Container from './TypeSelector/container';
import {eventTypes} from '../../../datasets/tree';
import MovePropertyButton from './movePropertyButton';
import ValidationSelector from './ValidationSelector';

const is = ['allOf', 'oneOf', 'anyOf'];
const os = ['object', 'array'];
//const as = ['string', 'number', 'integer', 'boolean', 'null', '$ref'];
const ss = os.concat(is);

const as = ['string', 'number', 'integer', 'boolean', 'null', '$ref'];
const us = as.concat(os);
const cs = ss.concat(as);

const fs = (e, type) =>
  type !== null &&
  (Array.isArray(type) ? intersection(type, e).length > 0 : e.includes(type));
const ps = (e, type) => (Array.isArray(type) ? type.includes(e) : type === e);

const getRowState = (props) => {
  const extraProps = clone(props.extraProps || {});
  const subtypeExtraProps = clone(props.subtypeExtraProps || {});
  let type = [];

  if (props.type instanceof Array) {
    type = props.type;
  } else {
    if (props.type) {
      type = [props.type];
    }
  }

  return {
    type,
    subtype: Array.isArray(props.subtype)
      ? props.subtype
      : props.subtype
      ? [props.subtype]
      : [],
    refPath: props.refPath,
    extraProps,
    subtypeExtraProps,
  };
};

const Is = (e, t) => {
  const n = Object.assign({}, e);
  t = Array.isArray(t) ? t : [t];
  const r = pickBy(n, (e, n) => t.includes(n));

  if (r.enum) {
    n.enum = JSON.parse(r.enum, r.enum);
  } else {
    if (!(r.enum === undefined || r.enum)) {
      delete n.enum;
    }
  }

  if (r.additionalProperties) {
    delete n.additionalProperties;
  }

  if (r.deprecated === false) {
    delete n.deprecated;
  }

  for (const [e, t] of Object.entries(r)) {
    if (!['boolean', 'number'].includes(typeof t) && isEmpty(t)) {
      delete n[e];
    }
  }

  return n;
};

const Os = (
  e,
  {type: t, subtype: n, ref: r, extraProps: i, subtypeExtraProps: o},
) => {
  let a = compact(flattenDeep([t]));
  let s = compact(flattenDeep([n]));

  if (a.length === 0) {
    a = null;
  } else {
    if (a.length === 1) {
      a = a[0];
    }
  }

  if (s.length === 0) {
    s = null;
  } else {
    if (s.length === 1) {
      s = s[0];
    }
  }

  let u = r;

  if (!(ps('$ref', t) || ps('$ref', n))) {
    u = null;
  }

  e(a, s, u, i, o);
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
    treeStore.toggleExpand(node);
  };
  return hasChildren && isParentNode(node) ? (
    <div
      className="flex justify-center cursor-pointer p-1 rounded hover:bg-darken-3"
      style={{
        marginLeft: -10.5,
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

const AddPropertyBtn = ({node, handleAdd}) => {
  return (
    isParentNode(node) && (
      <div
        onClick={() => handleAdd(node)}
        data-test="add-property-btn"
        className="absolute flex items-center justify-center cursor-pointer rounded hover:bg-darken-3 z-10"
        style={{width: 20, height: 20}}>
        <Icon
          icon="plus"
          iconSize={12}
          className="text-darken-9 dark:text-lighten-9"
        />
      </div>
    )
  );
};

AddPropertyBtn.propTypes = {
  node: PropTypes.object,
  handleAdd: PropTypes.func,
};

const SchemaInput = ({
  value,
  isAutoFocusBlocked,
  setAutoFocusBlocked,
  children,
  onChange,
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
  }, [inputRef.current]);

  const handleBlur = () => {
    if (onChange && value !== val) {
      onChange(val);
    }
  };

  const handleChange = (e) => {
    console.log('vall', e.target.value);
    setVal(e.target.value);
  };

  React.useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <span style={{maxWidth: 250}}>
      <AutosizeInput
        ref={inputRef}
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
    index,
    level,
    node,
    type,
    subtype,
    refPath,
    path,
    extraProps,
    enumValue,
    childCount,
    store,
    isCombinerChild,
    rootName,
    name,
    isAutoFocusBlocked,
    setAutoFocusBlocked,
    getRefLabel,
    shouldRenderGoToRef,
    refSelector,
    format,
    isLast,
    parent,
    addHandler,
    changeHandler,
    swapHandler,
    cloneHandler,
    removeHandler,
  } = props;
  const hasChildren = !!(isParentNode(node) && childCount && childCount > 0);

  const renderValidationSelector = () => {
    const {
      type: e,
      subtype: t,
      refPath: n,
      extraProps: r,
      subtypeExtraProps: i,
    } = getRowState(props);

    return (
      <ValidationSelector
        type={e}
        subtype={t}
        extraProps={r}
        subtypeExtraProps={i}
        spec={props.store.spec}
        handleUpdateProp={(o, a, s) => {
          let u = {};

          switch (o) {
            case 'extraProps':
              u = r;
              break;
            case 'subtypeExtraProps':
              u = i;
          }

          if (s === '') {
            delete u[a];
          } else {
            u[a] = s;
          }

          Os(handleSaveDetails, {
            type: e,
            subtype: t,
            ref: n,
            extraProps: o === 'extraProps' ? Is(u, a) : r,
            subtypeExtraProps: o === 'subtypeExtraProps' ? Is(u, a) : i,
          });

          //this.props.store.emit(Za.ExtraPropUpdate, {
          //field: a,
          //value: s,
          //});
        }}
      />
    );
  };

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

  const isExtensible = (type, subtype) => {
    if (type) {
      console.log('eee', type, subtype);
      if (!(fs(ss, type) && !ps('array', type))) {
        console.log('eee2', type, subtype);
        if (fs(ss, subtype)) {
          return !ps('array', subtype);
        }
      }
      return true;
    }
  };

  const handleAdd = (node, props) => {
    const {type, subtype, path} = props;

    //if (!isExtensible) {
    //return;
    //}

    const inittype = type; //s
    let u = '';
    const initpath = path; //c
    let l = [];

    if (fs(ss, subtype) && !ps('array', subtype)) {
      u = subtype;
      l = ['children'];
    }

    store.store.treeStore.toggleExpand(node, true);
    return addHandler(inittype, u, initpath, l);
  };

  const handleRefClick = () => {
    var e;

    store.store.eventEmitter.emit(
      eventTypes.StoreEvents.GoToRef,
      String((e = refPath) !== null && e !== undefined ? e : ''),
    );
  };

  const handleSaveDetails = (
    selectedTypes,
    selectedSubTypes,
    selectedRefPath,
    newExtraProps,
    newSubtypeExtraProps,
  ) => {
    const {
      path,
      type,
      subtype,
      refPath,
      extraProps,
      subtypeExtraProps,
      propsChangeHandler,
      typeChangeHandler,
    } = props;

    if (isEqual(subtypeExtraProps, newSubtypeExtraProps)) {
      //i
      if (!isEqual(extraProps, newExtraProps)) {
        propsChangeHandler(path, newExtraProps);
      }
    } else {
      propsChangeHandler(path.concat(['children', '0']), newSubtypeExtraProps);
    }

    if (
      !(
        isEqual(type, selectedTypes) &&
        isEqual(subtype, selectedSubTypes) &&
        refPath === selectedRefPath
      )
    ) {
      typeChangeHandler(
        null,
        type,
        selectedTypes,
        path,
        subtype,
        selectedSubTypes,
        typeof selectedRefPath != 'string'
          ? refPath != null
            ? refPath
            : null
          : selectedRefPath,
      );
    }
  };

  const isAdvancedType = !isCombinerChild && level !== 0 && fs(cs, type);
  const isBasicType = fs(us, type) && type !== '$ref' && type !== 'noType';
  const isRootOrRef = (level === 0 && !!rootName) || type === '$ref';

  return (
    <div
      className="flex-1 flex items-center overflow-hidden"
      style={{marginLeft: 7, marginRight: 7}}>
      {isExtensible(type, subtype) && (
        <AddPropertyBtn
          node={node}
          handleAdd={(node) => handleAdd(node, props)}
        />
      )}
      <div
        className="flex flex-1 items-center text-sm leading-tight w-full h-full relative overflow-hidden"
        style={{
          paddingLeft: (level + 1) * 20 + 7,
        }}>
        <Caret
          node={node}
          hasChildren={hasChildren}
          treeStore={store.store.treeStore}
        />
        <div className="flex items-center flex-1 text-sm mr-2 overflow-hidden">
          {!isCombinerChild && (level != 0 || rootName) && (
            <SchemaInput
              type="text"
              placeholder="name"
              value={name || ''}
              minWidth={30}
              isAutoFocusBlocked={isAutoFocusBlocked}
              setAutoFocusBlocked={setAutoFocusBlocked}
              onChange={(e) => {
                changeHandler(path.concat('name'), e);
              }}
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
            rowState={getRowState(props)}
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
      <div
        className={classnames('ml-auto mr-4 JsonSchemaEditor_ActionItems', {
          'mr-12 pr-4': !isBasicType,
        })}>
        <MovePropertyButton
          data-test="move-property-up-button"
          icon={<Icon icon="arrow-up" iconSize={12} color={Colors.GRAY4} />}
          tooltip="move up"
          disabled={level === 0 || index === 0}
          onClick={() => {
            swapHandler(path, index, index - 1);
          }}
        />
        <MovePropertyButton
          data-test="move-property-down-button"
          icon={<Icon icon="arrow-down" iconSize={12} color={Colors.GRAY4} />}
          tooltip="move down"
          disabled={
            level === 0 ||
            (parent &&
              parent.metadata &&
              parent.metadata.childCount === index + 1)
          }
          onClick={() => {
            swapHandler(path, index, index + 1);
          }}
        />
        <MovePropertyButton
          data-test="duplicate-property-button"
          icon={<Icon icon="duplicate" iconSize={12} color={Colors.GRAY4} />}
          tooltip="duplicate"
          disabled={level === 0}
          onClick={() => {
            cloneHandler(path);
          }}
        />
        <MovePropertyButton
          data-test="remove-property-button"
          icon={<Icon icon="trash" iconSize={12} color={Colors.GRAY4} />}
          tooltip="remove"
          disabled={level === 0}
          onClick={() => {
            removeHandler(path);
          }}
        />
        {/* {isBasicType && renderValidationSelector(props)} */}
        <Tooltip
          boundary="window"
          position="top"
          content="Required?"
          disabled={!isAdvancedType}>
          <Button
            data-test="property-required-btn"
            className={classnames({'opacity-25': isAdvancedType})}
            small={true}
            minimal={true}
            disabled={!isAdvancedType}
            onClick={() => {
              changeHandler(path.concat('required'), !extraProps.required);
            }}
            title="Required"
            icon={
              <Icon
                icon="issue"
                iconSize={12}
                color={extraProps.required ? Colors.RED3 : Colors.GRAY4}
              />
            }
          />
        </Tooltip>
        <Popover
          position="top-right"
          boundary="window"
          disabled={isRootOrRef}
          target={
            <Tooltip
              boundary="window"
              position="top"
              content="Description"
              disabled={isRootOrRef}>
              <Button
                data-test="property-description-btn"
                className={classnames('z-10', {'opacity-25': isRootOrRef})}
                small={true}
                minimal={true}
                disabled={isRootOrRef}
                icon={
                  <Icon
                    icon="manual"
                    iconSize={12}
                    color={extraProps.description ? Colors.BLUE4 : Colors.GRAY4}
                  />
                }
              />
            </Tooltip>
          }
          content={
            <TextArea
              className="relative max-h-400px overflow-auto"
              style={{
                width: 400,
                minHeight: 38,
              }}
              placeholder="Description..."
              aria-label={'description'}
              growVertically
              value={extraProps.description || ''}
              onChange={(e) =>
                changeHandler(path.concat(['description']), e.target.value)
              }
            />
          }
        />
      </div>
    </div>
  );
};

SchemaRow.propTypes = {
  path: PropTypes.array,
  level: PropTypes.number,
  node: PropTypes.object,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  subtype: PropTypes.string,
  index: PropTypes.number,
  parent: PropTypes.object,
  childCount: PropTypes.number,
  store: PropTypes.object,
  isCombinerChild: PropTypes.bool,
  rootName: PropTypes.string,
  name: PropTypes.string,
  isAutoFocusBlocked: PropTypes.bool,
  isLast: PropTypes.bool,
  setAutoFocusBlocked: PropTypes.func,
  refPath: PropTypes.string,
  extraProps: PropTypes.object,
  subtypeExtraProps: PropTypes.object,
  propsChangeHandler: PropTypes.func,
  typeChangeHandler: PropTypes.func,
  enumValue: PropTypes.string,
  getRefLabel: PropTypes.func,
  shouldRenderGoToRef: PropTypes.func,
  refSelector: PropTypes.func,
  format: PropTypes.string,
  addHandler: PropTypes.func,
  changeHandler: PropTypes.func,
  swapHandler: PropTypes.func,
  cloneHandler: PropTypes.func,
  removeHandler: PropTypes.func,
};

export default SchemaRow;
