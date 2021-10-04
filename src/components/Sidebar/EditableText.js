import React from 'react';
import PropTypes from 'prop-types';
import {Position, Callout, Intent} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
import {StoreContext} from '../Tree/context';
import {eventTypes} from '../../utils/tree';

const EditableText = ({node, placeholder = ''}) => {
  const store = React.useContext(StoreContext);

  const inputRef = React.useRef();
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const {current} = inputRef;

    if (current) {
      const dotPos = current.value.indexOf('.');
      current.setSelectionRange(
        0,
        dotPos === -1 ? current.value.length : dotPos,
        'forward',
      );
    }
  }, []);

  const onInput = React.useCallback((e) => {
    console.log('input', e.target.value);
    if (e.target.value !== '') {
      setError(null);
    }
  }, []);

  const onBlur = React.useCallback(() => {
    store.events.emit(eventTypes.EditCancel);
  }, []);

  const onKeyDown = React.useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
          node.name = inputRef.current.value;
          store.events.emit(eventTypes.BeforeEditComplete, node, node.parent);
          break;
        case 'Escape':
          onBlur();
      }
    },
    [node, store, onInput],
  );

  //const onKeyDown2 = React.useCallback(
  //(e) => {
  //switch (e.key) {
  //case 'Enter':
  //node.name = inputRef.current.value;
  //node.isEdited = false;
  //console.log('node changed', node);
  //if (node.actions && node.actions.rename) {
  //node.actions.rename(inputRef.current.value);
  //}
  //break;
  //case 'Escape':
  //onBlur();
  //}
  //},
  //[node, onBlur],
  //);

  const onFocus = React.useCallback((e) => {
    const inputValue = e.target.value;
    const stopIndex = inputValue.indexOf('.');
    e.target.setSelectionRange(
      0,
      stopIndex === -1 ? inputValue.length : stopIndex,
      'forward',
    );
  }, []);

  return (
    <Popover2
      isOpen={error !== null}
      minimal={true}
      usePortal={true}
      className="w-full flex-shrink"
      position={Position.BOTTOM_RIGHT}
      content={<Callout intent={Intent.DANGER}>{error}</Callout>}>
      <input
        ref={inputRef}
        autoFocus={true}
        autoComplete="off"
        className="w-full DesignTreeListItem__input"
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        defaultValue={node.name}
        placeholder={placeholder}
        onInput={onInput}
      />
    </Popover2>
  );
};

EditableText.propTypes = {
  node: PropTypes.object,
  placeholder: PropTypes.string,
};

export default EditableText;

//const Q = Object(l.observer)(({className: e, node: t, placeholder: n}) => {
//const o = q();
//const [i, s] = Object(r.useState)(null);
//const l = Object(r.useRef)();

//Object(r.useEffect)(
//() =>
//o.events.on(I.ValidationError, (e) => {
//s(e.message);
//}).dispose,
//[o, s],
//);

//Object(r.useEffect)(() => {
//const {current: e} = l;

//if (e) {
//const t = e.value.indexOf('.');
//e.setSelectionRange(0, t === -1 ? e.value.length : t, 'forward');
//}
//}, []);

//const u = Object(r.useCallback)((e) => {
//if (e.target.value !== '') {
//s(null);
//}
//}, []);

//const d = Object(r.useCallback)(() => {
//o.events.emit(I.EditCancel);
//}, [o]);

//const f = Object(r.useCallback)(
//(e) => {
//switch (e.key) {
//case 'Enter':
//t.name = l.current.value;
//o.events.emit(I.BeforeEditComplete, t, t.parent);
//break;
//case 'Escape':
//d();
//}
//},
//[t, o, d],
//);

//const p = Object(r.useCallback)((e) => {
//const t = e.target.value;
//const n = t.indexOf('.');
//e.target.setSelectionRange(0, n === -1 ? t.length : n, 'forward');
//}, []);

//return Object(r.createElement)(a.Popover, {
//minimal: true,
//isOpen: i !== null,
//usePortal: true,
//position: a.Position.BOTTOM_RIGHT,
//className: 'w-full flex-shrink',
//targetClassName: 'w-full',

//target: Object(r.createElement)('input', {
//autoFocus: true,
//autoComplete: 'off',
//ref: l,
//className: c()(e, 'TreeListItem__input'),
//onKeyDown: f,
//onInput: u,
//onBlur: d,
//onFocus: p,
//defaultValue: t.name,
//placeholder: n,
//}),

//content: Object(r.createElement)(
//a.Callout,
//{
//intent: a.Intent.DANGER,
//},
//i,
//),
//});
//});
