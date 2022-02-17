import React, {Fragment} from 'react';
import {
  HTMLSelect,
  InputGroup,
  Menu,
  MenuDivider,
  MenuItem,
} from '@blueprintjs/core';
import {Suggest} from '@blueprintjs/select';
import {has, flatMap} from 'lodash';
import PropTypes from 'prop-types';

const gg = (e, t) =>
  flatMap(e, (e) =>
    e.items
      ? gg(e.items, e.label)
      : Object.assign(Object.assign({}, e), {
          parentKey: t,
        }),
  );

const RefSelector = ({
  refProviders = [],
  refPath = '',
  onChange,
  onBlur,
  store,
}) => {
  const refProvider = React.useMemo(() => {
    // o
    var n;

    for (const refProvider of refProviders) {
      // r of e
      if (
        typeof refProvider.matcher == 'function' &&
        ((n = refProvider.matcher) === null || n === undefined
          ? undefined
          : n.call(refProvider, refPath))
      ) {
        return refProvider;
      }
    }

    return refProviders.find((p) => !!p.default);
  }, [refProviders, refPath]);

  const defaultValue = refProvider ? refProvider.getRefLabel(refPath) : refPath; //a
  const [currentRefProvider, setCurrentRefProvider] =
    React.useState(refProvider); // u, l
  const [currentRefPath, setCurrentRefPath] = React.useState(defaultValue); // d,h
  const [activeItem, setActiveItem] = React.useState(); //f,p
  const [shouldRenderList, setShouldRenderList] = React.useState(false); //g, m
  const [refItems, setRefItems] = React.useState([]); // v,y

  const handleActiveItemChange = React.useCallback(
    (e) => {
      const n = e ? e.value : refPath;
      setActiveItem(refItems.find((e) => n === e.value));
    },
    [refItems, refPath],
  );

  const setRefLoading = React.useCallback(
    // _
    (e) => {
      if (store !== undefined) {
        store.refLoading = e;
      }
    },
    [store],
  );

  const onItemSelect = React.useCallback(
    async (e) => {
      if (
        currentRefProvider == null
          ? undefined
          : currentRefProvider.handleItemSelect
      ) {
        try {
          setRefLoading(true);
          e = await currentRefProvider.handleItemSelect(e);
        } finally {
          setRefLoading(false);
        }
      }

      onChange(String(e.value));

      if (onBlur) {
        onBlur(String(e.value));
      }
    },
    [onChange, currentRefProvider, onBlur, setRefLoading],
  );

  const handleSearch = React.useCallback(
    async (e, t = currentRefProvider) => {
      setCurrentRefPath(e);

      if (t && t.handleSearch) {
        try {
          setShouldRenderList(true);
          const n = await t.handleSearch(e);
          setShouldRenderList(false);

          if (n) {
            setRefItems(
              ((e, t) =>
                e.map((e) =>
                  Object.assign(Object.assign({}, e), {
                    provider: t,
                  }),
                ))(gg(n), t),
            );
          }
        } catch (e) {
          setShouldRenderList(false);
          console.warn(e);
        }
      }
    },
    [currentRefProvider],
  );

  const handleRefProviderChange = React.useCallback(
    (e) => {
      //t
      const selectedProvider = refProviders.find(
        (p) => e.currentTarget.value === p.name,
      ); // n
      setCurrentRefProvider(selectedProvider);

      if (has(selectedProvider, 'handleSearch')) {
        handleSearch('', selectedProvider);
      }
    },
    [setCurrentRefProvider, refProviders, handleSearch],
  );

  React.useEffect(() => {
    handleActiveItemChange(null);
  }, [refItems, handleActiveItemChange]);

  return (
    <div className="mx-0 flex flex-col flex-no-wrap mt-5 w-auto">
      <div className="w-full uppercase font-semibold mb-2">$ref target</div>
      <div className="flex flex-no-wrap">
        <HTMLSelect
          className="w-2/5 mr-2"
          value={currentRefProvider ? currentRefProvider.name : undefined}
          options={refProviders.map((p) => p.name)}
          onChange={handleRefProviderChange}
        />
        {has(currentRefProvider, 'handleSearch') ? (
          <Suggest
            className="w-full"
            popoverProps={{
              usePortal: true,
              targetClassName: 'w-full',
              captureDismiss: true,
              shouldReturnFocusOnClose: false,
            }}
            items={refItems}
            query={currentRefPath}
            onQueryChange={(e) => {
              if (currentRefPath !== e) {
                handleSearch(e);
              }
            }}
            inputProps={{
              placeholder: defaultValue || 'search',

              onFocus: () => {
                console.log('oonFocus11');
                handleSearch('');
              },

              onBlur: () => {
                console.log('oonBlur11');
                if (refPath !== currentRefPath) {
                  setCurrentRefPath(defaultValue);
                }
              },

              disabled: store == null ? undefined : store.refLoading,
            }}
            inputValueRenderer={(e) => {
              const val = (store == null ? undefined : store.refLoading)
                ? 'Loading...'
                : e.value || e.provider.getItemLabel(e);
              console.log('inputVal', val);
              return val;
            }}
            onItemSelect={onItemSelect} //w
            activeItem={activeItem} //f
            noResults={<Fragment>No results</Fragment>}
            itemListRenderer={({filteredItems, renderItem}) =>
              shouldRenderList ? (
                <div
                  className="p-2"
                  style={{
                    width: 300,
                  }}>
                  Searching...
                </div>
              ) : filteredItems.length === 0 ? (
                <span className="px-2" style={{width: 300}}>
                  No results found
                </span>
              ) : (
                <Menu
                  className="-mx-1"
                  style={{
                    width: 300,
                  }}>
                  {filteredItems.map(renderItem)}
                </Menu>
              )
            }
            onActiveItemChange={handleActiveItemChange}
            itemRenderer={(item, {modifiers, index, handleClick}) => {
              const i = (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.label,
                  }}
                />
              );

              return (
                <React.Fragment>
                  {index &&
                    item &&
                    item.parentKey &&
                    (index === 0 ||
                      (refItems.length > 0 &&
                        refItems.length > index &&
                        item.parentKey !== refItems[index - 1].parentKey && (
                          <MenuDivider
                            className="mt-1"
                            title={item.parentKey}
                          />
                        )))}
                  <MenuItem
                    key={item.value}
                    active={modifiers.active}
                    text={i}
                    onClick={handleClick}
                    shouldDismissPopover={false}
                  />
                </React.Fragment>
              );
            }}
          />
        ) : (
          <InputGroup
            className="text-sm w-full"
            value={refPath}
            onChange={(e) => onChange(String(e.target.value))}
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

RefSelector.propTypes = {
  refProviders: PropTypes.array,
  refPath: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  store: PropTypes.object,
};

export default RefSelector;
