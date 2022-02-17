//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Icon, MenuItem} from '@blueprintjs/core';
import {MultiSelect2} from '@blueprintjs/select';
import {highlightText} from '../../utils';

const TagSuggest = ({
  items,
  selectedItems,
  onItemSelect,
  onItemRemove,
  className,
  ...props
}) => {
  const filterTags = (query, tag, _index, exactMatch) => {
    const normalizedTitle = tag.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return tag.indexOf(normalizedQuery) >= 0;
    }
  };

  const itemRenderer = (text, {modifiers, handleClick, query}) =>
    modifiers.matchesPredicate ? (
      <MenuItem
        active={modifiers.active}
        key={text}
        data-testid={text}
        onClick={handleClick}
        shouldDismissPopover={false}
        icon={
          selectedItems.indexOf(text) >= 0 ? (
            <Icon size={12} icon="small-tick" />
          ) : undefined
        }
        text={highlightText(text, query)}
      />
    ) : null;

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
    <MultiSelect2
      className={className}
      selectedItems={selectedItems}
      items={items}
      noResults={
        <MenuItem
          className="tagsuggest-noresult"
          disabled={true}
          text="No results."
        />
      }
      tagRenderer={(item) => item}
      itemRenderer={itemRenderer}
      createNewItemFromQuery={(e) => e}
      createNewItemRenderer={newItemRenderer}
      onItemSelect={(item) => onItemSelect(item)}
      tagInputProps={{
        onRemove: (item) => onItemRemove(item),
      }}
      inputProps={{
        placeholder: 'Create or choose existing',
      }}
      popoverProps={{
        minimal: true,
        targetClassName: `w-full ${props.popoverClassname || ''}`,
        shouldReturnFocusOnClose: false,
      }}
      itemPredicate={filterTags}
      resetOnClose={false}
      resetOnQuery={false}
      resetOnSelect={true}
    />
  );
};

TagSuggest.propTypes = {
  inputRef: PropTypes.any,
  selectedItems: PropTypes.array,
  className: PropTypes.string,
  popoverClassname: PropTypes.string,
  items: PropTypes.array,
  selectedItem: PropTypes.any,
  onItemSelect: PropTypes.func,
  onItemRemove: PropTypes.func,
};

export default TagSuggest;
