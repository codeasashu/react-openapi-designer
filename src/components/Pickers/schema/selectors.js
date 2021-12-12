// @flow
import React from 'react';
import {flatMap, has} from 'lodash';
import PropTypes from 'prop-types';
import {
  HTMLSelect,
  InputGroup,
  Menu,
  MenuDivider,
  MenuItem,
} from '@blueprintjs/core';
import {isRefSchema} from '../../../utils/schema';
import {getRefProviders} from '../../../utils/selectors';
import {Suggest} from '@blueprintjs/select';

const SCHEMA_TYPES = [
  'object',
  'array',
  'string',
  'boolean',
  'integer',
  'number',
  '$ref',
];

const getMatchingRef = (RefProviders, refPath) => {
  for (const refProvider of RefProviders) {
    const matcher =
      refProvider.matcher == 'function' ? refProvider.matcher : undefined;
    if (matcher && matcher.call(refProvider, refPath)) {
      return refProvider;
    }
  }

  return RefProviders.find((e) => !!e.default);
};

const SubSchema = ({schema, onClick}) => {
  return (
    <div>
      <div className="w-full uppercase font-semibold mb-2">SUBTYPE</div>
      <div className="mt-2 flex flex-wrap">
        <div className="flex flex-wrap text-xs">
          {SCHEMA_TYPES.map((type, index) => {
            return (
              <div
                className={`flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer 
                  ${
                    schema.type === type ||
                    (isRefSchema(schema) && type === '$ref')
                      ? 'bg-green-600 text-white schema-literal-selected'
                      : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                key={index}
                onClick={() =>
                  onClick(type === '$ref' ? '' : type, [
                    'items',
                    type === '$ref' ? '$ref' : 'type',
                  ])
                }
                selected={schema.type === type}>
                {type}
              </div>
            );
          })}
        </div>
      </div>
      {isRefSchema(schema) && (
        <RefSchema
          schemaRef={schema['$ref']}
          onClick={(e) => onClick(e, ['items', '$ref'])}
          onBlur={(e) => onClick(e, ['items', '$ref'])}
        />
      )}
    </div>
  );
};

SubSchema.propTypes = {
  schema: PropTypes.object,
  onClick: PropTypes.func,
};

const gg = (e, t) =>
  flatMap(e, (e) =>
    e.items
      ? gg(e.items, e.label)
      : Object.assign(Object.assign({}, e), {
          parentKey: t,
        }),
  );

const RefSchema = ({schemaRef, onClick, onBlur}) => {
  const ref = schemaRef;
  const RefProviders = getRefProviders();
  const matchingRef = getMatchingRef(RefProviders, ref);
  const refLabel = matchingRef?.getRefLabel(ref);

  const [selectedRef, setSelectedRef] = React.useState(matchingRef);
  const [dropdownItems, setDropdownItems] = React.useState([]);
  const [query, setQuery] = React.useState(refLabel);

  const [activeItem, setActiveItem] = React.useState();
  const [isLoading, setLoading] = React.useState(false);

  const handleActiveItemChange = React.useCallback(
    (e) => {
      const n = e ? e.value : ref;
      setActiveItem(dropdownItems.find((e) => n === e.value));
    },
    [dropdownItems, ref],
  );

  const handleQuery = React.useCallback(
    async (term, _refProvider = selectedRef) => {
      setQuery(term);

      if (_refProvider && _refProvider.handleSearch) {
        try {
          setLoading(true);
          const refResults = await _refProvider.handleSearch(term);
          setLoading(false);

          if (refResults) {
            const refResultsWithParent = gg(refResults);
            const attachProviders = (items, provider) =>
              items.map((e) =>
                Object.assign(Object.assign({}, e), {
                  provider,
                }),
              );
            setDropdownItems(attachProviders(refResultsWithParent));
          }
        } catch (e) {
          setLoading(false);
          console.warn(e);
        }
      }
    },
    [selectedRef],
  );

  const handleSelect = React.useCallback(
    async (e) => {
      if (selectedRef == null ? undefined : selectedRef.handleItemSelect) {
        try {
          e = await selectedRef.handleItemSelect(e);
        } catch (e) {
          console.warn('handleSelect', e);
        }
      }

      onClick(String(e.value));

      if (onBlur) {
        onBlur(String(e.value));
      }
    },
    [onClick, selectedRef, onBlur],
  );

  const handleRefTypeSelect = React.useCallback(
    (e) => {
      const provider = RefProviders.find(
        (provider) => e.currentTarget.value === provider.name,
      );
      setSelectedRef(provider);

      if (has(provider, 'handleSearch')) {
        handleQuery('', provider);
      }
    },
    [setSelectedRef, RefProviders, handleQuery],
  );

  return (
    <div className="mx-0 flex flex-col flex-no-wrap mt-5 w-auto">
      <div className="w-full uppercase font-semibold mb-2">$REF TARGET</div>
      <div className="flex flex-no-wrap">
        <HTMLSelect
          className="flex-shrink w-2/5 mr-2"
          value={selectedRef ? selectedRef.name : undefined}
          options={RefProviders.map((e) => e.name)}
          onChange={(e) => {
            handleRefTypeSelect(e);
          }}
        />
        {has(selectedRef, 'handleSearch') ? (
          <Suggest
            className="w-full"
            popoverProps={{
              usePortal: false,
              targetClassName: 'w-full',
            }}
            items={dropdownItems}
            query={query}
            onQueryChange={(e) => {
              if (query !== e) {
                handleQuery(e);
              }
            }}
            inputProps={{
              placeholder: refLabel || 'search',

              onFocus: () => {
                handleQuery('');
              },

              onBlur: () => {
                if (ref !== query) {
                  setQuery(refLabel);
                }
              },

              disabled: undefined,
            }}
            inputValueRenderer={(e) => e.value || e.provider.getItemLabel(e)}
            onItemSelect={handleSelect}
            activeItem={activeItem}
            noResults={<>No Results</>}
            itemListRenderer={({filteredItems, renderItem}) => {
              return isLoading ? (
                <div className="p-2" style={{width: 300}}>
                  Searching...
                </div>
              ) : filteredItems.length === 0 ? (
                <span className="px-2" style={{width: 300}}>
                  No Results found
                </span>
              ) : (
                <Menu className="-mx-1" style={{width: 300}}>
                  {filteredItems.map(renderItem)}
                </Menu>
              );
            }}
            onActiveItemChange={handleActiveItemChange}
            itemRenderer={(e, {modifiers, index, handleClick}) => {
              const labelDiv = React.createElement('div', {
                dangerouslySetInnerHTML: {
                  __html: e.label,
                },
              });
              return (
                <React.Fragment key={index}>
                  {index !== undefined &&
                    e !== undefined &&
                    e.parentKey &&
                    (index === 0 ||
                      (dropdownItems.length > 0 &&
                        dropdownItems.length > index &&
                        e.parentKey !== dropdownItems[index - 1].parentKey && (
                          <MenuDivider
                            key={e.value}
                            className="mt-1"
                            title={e.parentKey}
                          />
                        )))}
                  <MenuItem
                    key={e.value}
                    active={modifiers.active}
                    text={labelDiv}
                    onClick={handleClick}
                    shouldDismissPopover={true}
                  />
                </React.Fragment>
              );
            }}
          />
        ) : (
          <InputGroup
            className="text-sm w-full"
            value={ref || ''}
            onChange={(e) => onClick(String(e.target.value))}
            onBlur={(e) => {
              if (onBlur) {
                onBlur(String(e.target.value));
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

RefSchema.propTypes = {
  schemaRef: PropTypes.any,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
};

const Selectors = ({schema, onClick}) => {
  if (!schema || Object.keys(schema).length === 0) {
    throw new Error('A valid schema is required');
  }

  return (
    <div className="flex flex-col text-sm p-3" label="schema-selector">
      <div className="w-full uppercase font-semibold mb-2">TYPE</div>
      <div className="mt-2 flex flex-wrap">
        <div className="flex flex-wrap text-xs">
          {SCHEMA_TYPES.map((type, index) => {
            return (
              <div
                className={`schema-literal schema-${type} flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer 
                  ${
                    schema.type === type ||
                    (isRefSchema(schema) && type === '$ref')
                      ? 'bg-green-600 text-white schema-literal-selected'
                      : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                key={index}
                onClick={() =>
                  onClick(type === '$ref' ? '' : type, [
                    type === '$ref' ? '$ref' : 'type',
                  ])
                }
                selected={schema.type === type}>
                {type}
              </div>
            );
          })}
        </div>
      </div>
      {schema.type === 'array' && (
        <SubSchema schema={schema.items} onClick={onClick} />
      )}
      {isRefSchema(schema) && (
        <RefSchema
          schemaRef={schema['$ref']}
          onClick={(e) => onClick(e, ['$ref'])}
          onBlur={(e) => onClick(e, ['$ref'])}
        />
      )}
    </div>
  );
};

Selectors.propTypes = {
  onClick: PropTypes.func,
  schema: PropTypes.object,
};

export default Selectors;
