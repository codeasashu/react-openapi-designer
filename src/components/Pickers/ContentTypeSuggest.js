//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {escapeRegExp} from 'lodash';
import {MenuItem} from '@blueprintjs/core';
import {Suggest} from '@blueprintjs/select';

function ah(e, t) {
  let n = 0;
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
    const a = e.slice(n, i.lastIndex - r);

    if (a.length > 0) {
      o.push(a);
    }

    n = i.lastIndex;

    o.push(<strong key={n}>{t[0]}</strong>);
  }

  const a = e.slice(n);

  if (a.length > 0) {
    o.push(a);
  }

  return o;
}

const ContentTypeSuggest = ({
  items,
  selectedItem,
  onItemSelect,
  inputRef,
  className,
}) => {
  const [item, setItem] = React.useState(selectedItem);
  React.useEffect(() => {
    setItem(selectedItem);
  }, [selectedItem]);

  const filterContentType = (query, contentType, _index, exactMatch) => {
    const normalizedTitle = contentType.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return contentType.indexOf(normalizedQuery) >= 0;
    }
  };

  const itemRenderer = React.useCallback(
    (e, {modifiers, handleClick, query}) =>
      modifiers.matchesPredicate ? (
        <MenuItem
          active={modifiers.active}
          key={e}
          onClick={handleClick}
          shouldDismissPopover={false}
          text={ah(e, query)}
        />
      ) : null,
    [],
  );

  const newItemRenderer = React.useCallback(
    (item, isActive, onClick) => (
      <MenuItem
        icon="add"
        text={`Create "${item}"`}
        active={isActive}
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
      onActiveItemChange={setItem}
      selectedItem={selectedItem}
      itemRenderer={itemRenderer}
      items={items}
      inputValueRenderer={(e) => e}
      createNewItemFromQuery={(e) => e}
      createNewItemRenderer={newItemRenderer}
      onItemSelect={(item) => {
        onItemSelect(item);
        setItem(item);
      }}
      inputProps={{
        placeholder: 'Create or choose existing',
        inputRef: (e) => (inputRef ? (inputRef.current = e) : undefined),
      }}
      popoverProps={{
        minimal: true,
        targetClassName: 'w-full',
        shouldReturnFocusOnClose: false,
      }}
      itemPredicate={filterContentType}
      resetOnClose={false}
      resetOnQuery={false}
      resetOnSelect={false}
    />
  );
};

ContentTypeSuggest.propTypes = {
  inputRef: PropTypes.any,
  className: PropTypes.string,
  items: PropTypes.array,
  selectedItem: PropTypes.any,
  onItemSelect: PropTypes.func,
};

export default ContentTypeSuggest;
