import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlGroup, MenuItem} from '@blueprintjs/core';
import {Select} from '@blueprintjs/select';
import {StatusCodes, highlightText} from '../../utils';

const renderCreateContentTypeOption = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
) => {
  return (
    <MenuItem
      icon="add"
      text={`Create "${query}"`}
      active={active}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );
};

const renderStatusCode = (code, {handleClick, modifiers, query}) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  code = '' + code;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={code}
      onClick={handleClick}
      text={highlightText(code, query)}
    />
  );
};

const filterStatusCode = (query, code, _index, exactMatch) => {
  const normalizedTitle = '' + code;
  const normalizedQuery = query;

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return normalizedTitle.indexOf(normalizedQuery) >= 0;
  }
};

const areContentTypesEqual = (contentTypeA, contentTypeB) => {
  // Compare only the text (ignoring case) just for simplicity.
  return contentTypeA === contentTypeB;
};

const StatusCode = ({onSelect, onDelete}) => {
  return (
    <ControlGroup>
      <Select
        items={StatusCodes}
        createNewItemFromQuery={(ct) => ct}
        createNewItemRenderer={renderCreateContentTypeOption}
        itemRenderer={renderStatusCode}
        itemPredicate={filterStatusCode}
        inputValueRenderer={(ct) => ct}
        itemsEqual={(a, b) => a === b}
        onItemSelect={onSelect}
        selectedItem={200}>
        <Button rightIcon="double-caret-vertical" text="200" />
      </Select>
      <Button icon="trash" onClick={onDelete} />
    </ControlGroup>
  );
};

StatusCode.propTypes = {
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StatusCode;
