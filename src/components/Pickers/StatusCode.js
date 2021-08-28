import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Button, ControlGroup, MenuItem} from '@blueprintjs/core';
import {Suggest} from '@blueprintjs/select';
import {StatusCodes, highlightText} from '../../utils';

const renderCreateContentTypeOption = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>,
) => {
  return query.length <= 3 ? (
    <MenuItem
      icon="add"
      text={`Create "${query}"`}
      active={active}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  ) : null;
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

const StatusCode = ({addCode, selectedItem, onOpen, onSelect, onDelete}) => {
  const inputRef = useRef();
  const [selectedCode, setSelectedCode] = useState(selectedItem);

  const handleSelect = (code) => {
    setSelectedCode(code);
    onSelect(code);
  };

  useEffect(() => {
    if (addCode === true) {
      inputRef.current.focus();
      onOpen();
    }
  }, [addCode]);

  return (
    <ControlGroup>
      <Suggest
        items={StatusCodes}
        createNewItemFromQuery={(ct) => ct}
        createNewItemRenderer={renderCreateContentTypeOption}
        itemRenderer={renderStatusCode}
        itemPredicate={filterStatusCode}
        inputValueRenderer={(ct) => ct}
        itemsEqual={(a, b) => a === b}
        onItemSelect={handleSelect}
        selectedItem={selectedCode}
        inputProps={{inputRef}}
      />
      <Button icon="trash" onClick={() => onDelete(selectedCode)} />
    </ControlGroup>
  );
};

StatusCode.propTypes = {
  selectedItem: PropTypes.any,
  addCode: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  onOpen: PropTypes.func,
};

export default StatusCode;
