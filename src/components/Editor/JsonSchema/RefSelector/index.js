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
  refProviders: e = [],
  refPath: t = '',
  onChange: n,
  onBlur: r,
  store: i,
}) => {
  const o = React.useMemo(() => {
    var n;

    for (const r of e) {
      if (
        typeof r.matcher == 'function' &&
        ((n = r.matcher) === null || n === undefined ? undefined : n.call(r, t))
      ) {
        return r;
      }
    }

    return e.find((e) => !!e.default);
  }, [e, t]);

  const a = o ? o.getRefLabel(t) : t;
  const [u, l] = React.useState(o);
  const [d, h] = React.useState(a);
  const [f, p] = React.useState();
  const [g, m] = React.useState(false);
  const [v, y] = React.useState([]);

  const b = React.useCallback(
    (e) => {
      const n = e ? e.value : t;
      p(v.find((e) => n === e.value));
    },
    [v, t],
  );

  const _ = React.useCallback(
    (e) => {
      if (i !== undefined) {
        i.refLoading = e;
      }
    },
    [i],
  );

  const w = React.useCallback(
    async (e) => {
      if (u == null ? undefined : u.handleItemSelect) {
        try {
          _(true);
          e = await u.handleItemSelect(e);
        } finally {
          _(false);
        }
      }

      n(String(e.value));

      if (r) {
        r(String(e.value));
      }
    },
    [n, u, r, _],
  );

  const M = React.useCallback(
    async (e, t = u) => {
      h(e);

      if (t && t.handleSearch) {
        try {
          m(true);
          const n = await t.handleSearch(e);
          m(false);

          if (n) {
            y(
              ((e, t) =>
                e.map((e) =>
                  Object.assign(Object.assign({}, e), {
                    provider: t,
                  }),
                ))(gg(n), t),
            );
          }
        } catch (e) {
          m(false);
          console.warn(e);
        }
      }
    },
    [u],
  );

  const x = React.useCallback(
    (t) => {
      const n = e.find((e) => t.currentTarget.value === e.name);
      l(n);

      if (has(n, 'handleSearch')) {
        M('', n);
      }
    },
    [l, e, M],
  );

  React.useEffect(() => {
    b(null);
  }, [v, b]);

  return (
    <div className="mx-0 flex flex-col flex-no-wrap mt-5 w-auto">
      <div className="w-full uppercase font-semibold mb-2">$ref target</div>
      <div className="flex flex-no-wrap">
        <HTMLSelect
          className="w-2/5 mr-2"
          value={u ? u.name : undefined}
          options={e.map((e) => e.name)}
          onChange={x}
        />
        {has(u, 'handleSearch') ? (
          <Suggest
            className="w-full"
            popoverProps={{
              usePortal: false,
              targetClassName: 'w-full',
            }}
            items={v}
            query={d}
            onQueryChange={(e) => {
              if (d !== e) {
                M(e);
              }
            }}
            inputProps={{
              placeholder: a || 'search',

              onFocus: () => {
                M('');
              },

              onBlur: () => {
                if (t !== d) {
                  h(a);
                }
              },

              disabled: i == null ? undefined : i.refLoading,
            }}
            inputValueRenderer={(e) => {
              return (i == null ? undefined : i.refLoading)
                ? 'Loading...'
                : e.value || e.provider.getItemLabel(e);
            }}
            onItemSelect={w}
            activeItem={f}
            noResults={<Fragment>No results</Fragment>}
            itemListRenderer={({filteredItems: e, renderItem: t}) =>
              g ? (
                <div
                  className="p-2"
                  style={{
                    width: 300,
                  }}
                >
                  Searching...
                </div>
              ) : e.length === 0 ? (
                <span className="px-2" style={{width: 300}}>
                  No results found
                </span>
              ) : (
                <Menu
                  className="-mx-1"
                  style={{
                    width: 300
                  }}
                >
                  {e.map(t)}
                </Menu>
              )
            }
            onActiveItemChange={b}
            itemRenderer={(e, {modifiers: t, index: n, handleClick: r}) => {
              const i = React.createElement('div', {
                dangerouslySetInnerHTML: {
                  __html: e.label,
                },
              });

              return React.createElement(
                React.Fragment,
                null,
                n !== undefined &&
                  (e == null ? undefined : e.parentKey) !== undefined &&
                  (n === 0 ||
                    (v.length > 0 &&
                      v.length > n &&
                      e.parentKey !== v[n - 1].parentKey &&
                      React.createElement(MenuDivider, {
                        className: 'mt-1',
                        title: e.parentKey,
                      }))),
                React.createElement(MenuItem, {
                  key: e.value,
                  active: t.active,
                  text: i,
                  onClick: r,
                  shouldDismissPopover: false,
                }),
              );
            }}
          />
        ) : (
          <InputGroup
            className="text-sm w-full"
            value={t}
            onChange={(e) => n(String(e.target.value))}
            onBlur={(e) => {
              if (r) {
                r(String(e.target.value));
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
