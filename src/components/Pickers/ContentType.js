// @flow
import React, {useRef} from 'react';
import PropTypes from 'prop-types';
//import {union, head} from 'lodash';
import {Button, ControlGroup, MenuItem} from '@blueprintjs/core';
import {Suggest} from '@blueprintjs/select';
import {ContentTypes, highlightText} from '../../utils';

const areContentTypesEqual = (contentTypeA, contentTypeB) =>
  contentTypeA.toLowerCase() === contentTypeB.toLowerCase();

const SelectedContentTypes = ({selected, contentTypes, onChange}) => {
  return contentTypes.length > 0 ? (
    <div className="bp3-select flex-shrink">
      <select value={selected} onChange={onChange}>
        <option label="any" value="">
          any
        </option>
        {contentTypes.map((k, i) => (
          <option value={k} key={i}>
            {k}
          </option>
        ))}
      </select>
    </div>
  ) : null;
};

SelectedContentTypes.propTypes = {
  selected: PropTypes.string,
  contentTypes: PropTypes.array,
  onChange: PropTypes.func,
};

const ContentType = ({selected, contentTypes, ...props}) => {
  const inputRef = useRef();

  const filterContentType = (query, contentType, _index, exactMatch) => {
    const normalizedTitle = contentType.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return contentType.indexOf(normalizedQuery) >= 0;
    }
  };

  return (
    <div className="flex items-center">
      <ControlGroup className="flex-1">
        <Button
          icon="plus"
          text="Add Body"
          onClick={() => {
            inputRef.current.focus();
          }}
        />
        <SelectedContentTypes
          selected={selected}
          contentTypes={contentTypes}
          onChange={(e) => props.onSelect(e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <Suggest
          items={Object.values(ContentTypes)}
          createNewItemFromQuery={(ct) => ct}
          createNewItemRenderer={({query, active, handleClick}) => (
            <MenuItem
              icon="add"
              text={`Create "${query}"`}
              active={active}
              onClick={handleClick}
              shouldDismissPopover={false}
            />
          )}
          itemRenderer={(contentType, {handleClick, modifiers, query}) => {
            return modifiers.matchesPredicate ? (
              <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={contentType}
                onClick={handleClick}
                text={highlightText(contentType, query)}
              />
            ) : null;
          }}
          itemPredicate={filterContentType}
          inputValueRenderer={(ct) => ct}
          itemsEqual={areContentTypesEqual}
          onItemSelect={(e) => props.onAdd(e)}
          selectedItem={selected}
          inputProps={{inputRef}}
        />
        <Button icon="trash" onClick={() => props.onDelete(selected)} />
      </ControlGroup>
    </div>
  );
};

ContentType.propTypes = {
  selected: PropTypes.string,
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onEmptyContentType: PropTypes.func,
};

export default ContentType;
