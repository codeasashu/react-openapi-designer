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
