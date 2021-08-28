// @flow
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {union, head} from 'lodash';
import {Button, ControlGroup, MenuItem} from '@blueprintjs/core';
import {Suggest} from '@blueprintjs/select';
import {ContentTypes, highlightText} from '../utils';

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

const BodySelector = (props) => {
  const inputRef = useRef();

  const getDefaultContentType = (contentTypes) => {
    return head(contentTypes) || ContentTypes.json;
  };

  const [selectedContentType, setSelectedContentType] = useState(
    getDefaultContentType(props.contentTypes),
  );
  const [contentTypeHistory, setContentTypeHistory] = useState(
    union(props.contentTypes, [selectedContentType]),
  );
  const [validContentTypes, setValidContentTypes] = useState(
    Object.values(ContentTypes),
  );
  const [addingContentType, setAddingContentType] = useState(false);

  useEffect(() => {
    console.log('props contentType changed', props.contentTypes, props.via);
    setContentTypeHistory(props.contentTypes);
    setSelectedContentType(getDefaultContentType(props.contentTypes));
    setAddingContentType(false);
  }, [props.contentTypes]);

  //componentDidMount() {
  //if (typeof this.props.onSelect === 'function')
  //this.props.onSelect(this.state.selectedContentType);
  //}

  const filterContentType = (query, contentType, _index, exactMatch) => {
    const normalizedTitle = contentType.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return contentType.indexOf(normalizedQuery) >= 0;
    }
  };

  const addToValidContentType = (contentType) => {
    if (validContentTypes.indexOf(contentType) < 0) {
      validContentTypes.push(contentType);
    }
    setValidContentTypes(validContentTypes);
  };

  const addToContentTypeHistory = (contentType) => {
    const idx =
      addingContentType === true
        ? contentTypeHistory.indexOf(contentType)
        : contentTypeHistory.indexOf(selectedContentType);
    if (idx < 0) {
      setContentTypeHistory([...contentTypeHistory, contentType]);
    } else {
      let copyOfContentTypeHistory = contentTypeHistory.slice(0);
      copyOfContentTypeHistory.splice(idx, 1, contentType);
      setContentTypeHistory(copyOfContentTypeHistory);
    }
  };

  const onSelectContentType = (contentType) => {
    const oldSelectedContentType = selectedContentType;
    const isAdding = addingContentType;

    addToValidContentType(contentType);
    addToContentTypeHistory(contentType);
    setSelectedContentType(contentType);
    setAddingContentType(false);

    if (isAdding === true) {
      props.onAdd(contentType);
    } else {
      props.onUpdate(contentType, oldSelectedContentType);
    }
  };

  const removeContentTypeFromHistory = (contentType) => {
    let copyOfContentTypeHistory = contentTypeHistory.slice(0);
    const idx = contentTypeHistory.indexOf(contentType);
    const deletedElem =
      idx > 0 ? copyOfContentTypeHistory.splice(idx, 1) : null;
    return deletedElem.indexOf(contentType) >= 0
      ? copyOfContentTypeHistory
      : null;
  };

  const onDeleteContentType = () => {
    const toDeleteContentType = selectedContentType;
    const newHistory = removeContentTypeFromHistory(toDeleteContentType);
    console.log(newHistory, toDeleteContentType);
    if (newHistory !== null && newHistory.length) {
      setContentTypeHistory(newHistory);
      setSelectedContentType(contentTypeHistory[0]);
      props.onDelete(toDeleteContentType, selectedContentType);
    } else if (typeof props.onEmptyContentType === 'function') {
      // Alert the parent component when there are no contentTypes left
      // in the response
      props.onEmptyContentType();
    }
  };

  const getDropdownItems = () => {
    let items = validContentTypes.filter(
      (ct) => contentTypeHistory.indexOf(ct) < 0,
    );
    return addingContentType === true ? items : [...items, selectedContentType];
  };

  return (
    <div className="flex items-center">
      <ControlGroup className="flex-1">
        <Button
          icon="plus"
          text="Add Body"
          onClick={() => {
            inputRef.current.focus();
            setAddingContentType(true);
          }}
        />
        <SelectedContentTypes
          selected={selectedContentType}
          contentTypes={contentTypeHistory}
          onChange={(e) => {
            setSelectedContentType(e.target.value);
            props.onSelect(e.target.value);
          }}
        />
      </ControlGroup>
      <ControlGroup>
        <Suggest
          items={getDropdownItems()}
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
          onItemSelect={onSelectContentType}
          selectedItem={selectedContentType}
          inputProps={{inputRef}}
        />
        <Button icon="trash" onClick={onDeleteContentType} />
      </ControlGroup>
    </div>
  );
};

BodySelector.propTypes = {
  contentTypes: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  onEmptyContentType: PropTypes.func,
};

export default BodySelector;
