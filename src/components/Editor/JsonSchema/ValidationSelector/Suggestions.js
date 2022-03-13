import React from 'react';
import PropTypes from 'prop-types';
import {MenuItem} from '@blueprintjs/core';
import {Suggest, getCreateNewItem} from '@blueprintjs/select';
import {escapeRegExp} from 'lodash';

function Vs(e, t) {
  let key = 0;
  const r = t
    .split(/\s+/)
    .filter((e) => e.length > 0)
    .map(escapeRegExp);

  if (r.length === 0) {
    return [e];
  }

  const i = new RegExp(r.join('|'), 'gi');
  const o = [];

  for (;;) {
    const t = i.exec(e);

    if (!t) {
      break;
    }

    const r = t[0].length;
    const a = e.slice(key, i.lastIndex - r);

    if (a.length > 0) {
      o.push(a);
    }

    key = i.lastIndex;

    o.push(<strong key={key}>{t[0]}</strong>);
  }

  const a = e.slice(key);

  if (a.length > 0) {
    o.push(a);
  }

  return o;
}

const itemPredicate = (e = '', t = '') => {
  e = e.toLowerCase();
  return (t = t.toLowerCase()).includes(e);
};

const Suggestions = ({items, selectedItem, onItemSelect, className}) => {
  console.log('rendeer11', items);
  const [item, setItem] = React.useState(selectedItem);

  React.useEffect(() => {
    setItem(selectedItem);
  }, [selectedItem]);

  const itemRenderer = (e, {modifiers, handleClick, query}) => {
    return modifiers.matchesPredicate ? (
      <MenuItem
        active={modifiers.active}
        key={e}
        onClick={handleClick}
        shouldDismissPopover={false}
        text={Vs(e, query)}
      />
    ) : null;
  };

  const createNewItemRenderer = React.useCallback(
    (text, active, onClick) => (
      <MenuItem
        icon={'add'}
        text={`Use "${text}"`}
        active={active}
        onClick={onClick}
        shouldDismissPopover={false}
      />
    ),
    [],
  );

  return (
    <Suggest
      className={className}
      activeItem={item}
      onActiveItemChange={(e) => {
        console.log('activeItem', e, getCreateNewItem());
        setItem(e);
      }}
      selectedItem
      itemRenderer={itemRenderer}
      items={items}
      inputValueRenderer={(e) => {
        console.log('inputValueRenderer', e);
        return e;
      }}
      //createNewItemFromQuery={(e) => e}
      //createNewItemRenderer={createNewItemRenderer}
      onItemSelect={(e) => {
        console.log('onItemSelect', e);
        onItemSelect(e);
        setItem(e);
      }}
      //inputProps={{
      //placeholder: 'Create or choose existing',
      //inputRef: (e) => (inputRef ? (inputRef.current = e) : undefined),
      //}}
      //popoverProps={{
      //minimal: true,
      //targetClassName: 'w-full',
      //}}
      itemPredicate={itemPredicate}
      //resetOnClose={false}
      //resetOnQuery={false}
      //resetOnSelect={false}
    />
  );
};

Suggestions.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedItem: PropTypes.string,
  onItemSelect: PropTypes.func.isRequired,
  inputRef: PropTypes.func,
  className: PropTypes.string,
  'data-test': PropTypes.string,
};

export default Suggestions;
