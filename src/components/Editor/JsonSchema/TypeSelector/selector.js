import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {InputGroup} from '@blueprintjs/core';
import {intersection, difference, flattenDeep, compact, pull} from 'lodash';

const is = ['allOf', 'oneOf', 'anyOf'];
const os = ['object', 'array'];
const as = ['string', 'number', 'integer', 'boolean', 'null', '$ref'];
const ss = os.concat(is);
const validTypes = ss.concat(as);

const hs = {
  text: {
    object: 'text-blue-600 dark:text-blue-400',
    any: 'text-blue-500',
    array: 'text-green-600 dark:text-green-400',
    allOf: 'text-orange-500',
    oneOf: 'text-orange-500',
    anyOf: 'text-orange-500',
    null: 'text-orange-500',
    integer: 'text-red-700 dark:text-red-600',
    number: 'text-red-700 dark:text-red-600',
    boolean: 'text-red-400',
    binary: 'text-green-400',
    string: 'text-green-700 dark:text-green-500',
    $ref: 'text-purple-600 dark:text-purple-400',
  },

  bg: {
    object: 'bg-blue-600',
    any: 'bg-blue-500',
    array: 'bg-green-600',
    allOf: 'bg-orange-500',
    oneOf: 'bg-orange-500',
    anyOf: 'bg-orange-500',
    null: 'bg-orange-500',
    integer: 'bg-red-700',
    number: 'bg-red-700',
    boolean: 'bg-red-400',
    binary: 'bg-green-400',
    string: 'bg-green-700',
    $ref: 'bg-purple-600',
  },
};

const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

const Os = (
  e,
  {type: t, subtype: n, ref: r, extraProps: i, subtypeExtraProps: o},
) => {
  let a = compact(flattenDeep([t]));
  let s = compact(flattenDeep([n]));

  if (a.length === 0) {
    a = null;
  } else {
    if (a.length === 1) {
      a = a[0];
    }
  }

  if (s.length === 0) {
    s = null;
  } else {
    if (s.length === 1) {
      s = s[0];
    }
  }

  let u = r;

  if (!(ps('$ref', t) || ps('$ref', n))) {
    u = null;
  }

  e(a, s, u, i, o);
};

const TypeList = ({
  whitelistTypes,
  sectionName,
  type,
  types,
  clickHandler,
  className: a,
  ...props
}) => {
  const u = [];
  let initialTypes = types;

  if (
    whitelistTypes &&
    ((initialTypes = intersection(types, whitelistTypes)),
    sectionName === 'isInTypeGroup')
  ) {
    const blacklistTypes = difference(whitelistTypes, validTypes);
    initialTypes = initialTypes.concat(blacklistTypes);
  }

  if (!initialTypes.length) {
    return null;
  }

  for (const e of initialTypes) {
    const t = ps(e, type) || (e === 'none' && type.length === 0);

    u.push(
      <div
        className={classnames(
          'flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer',
          t && hs.bg[e] ? hs.bg[e] + ' text-white' : 'hover:bg-darken-3',
        )}
        key={'t-' + e}
        onClick={() => {
          clickHandler(e === 'none' ? null : e);
        }}>
        {e}
      </div>,
    );
  }

  return (
    <div className={classnames(a, 'flex flex-wrap')} {...props}>
      {sectionName && (
        <div className="w-full uppercase font-semibold mb-2">{sectionName}</div>
      )}
      <div className="flex flex-wrap">{u}</div>
    </div>
  );
};

TypeList.propTypes = {
  whitelistTypes: PropTypes.array,
  sectionName: PropTypes.string,
  type: PropTypes.array,
  types: PropTypes.array,
  clickHandler: PropTypes.func,
  className: PropTypes.string,
};

const Selector = ({
  id: e,
  refSelector: t,
  whitelistTypes: n,
  type: r,
  subtype: i,
  refPath: o,
  extraProps: a,
  subtypeExtraProps: u,
  handleSave: l,
}) => {
  var d;
  const h = difference(validTypes, is);
  let f;
  let p;

  if (ps('array', r)) {
    f = (
      <TypeList
        className="mt-4"
        sectionName="SUBTYPE"
        whitelistTypes={n}
        type={i}
        types={['none'].concat(validTypes)}
        clickHandler={(e) => {
          let t = [];

          if (e) {
            if (!ps(e, is)) {
              t = difference(i, is);
            }

            if (e === '$ref') {
              t = ['$ref'];
            } else {
              pull(t, '$ref');

              if (ps(e, t)) {
                pull(t, e);
              } else {
                t.push(e);
              }
            }
          }

          Os(l, {
            type: r,
            subtype: t,
            extraProps: a,
            subtypeExtraProps: u,
          });
        }}
      />
    );
  }

  if (ps('$ref', r) || ps('$ref', i)) {
    p =
      (d =
        t == null
          ? undefined
          : t({
              id: e,
              refPath: o,

              onChange: (e) => {
                Os(l, {
                  type: r,
                  subtype: i,
                  ref: e,
                  extraProps: a,
                  subtypeExtraProps: u,
                });
              },
            })) !== null && d !== undefined ? (
        d
      ) : (
        <InputGroup
          className="text-sm w-full"
          value={o}
          onChange={(e) => {
            Os(l, {
              type: r,
              subtype: i,
              ref: String(e.target.value),
              extraProps: a,
              subtypeExtraProps: u,
            });
          }}
        />
      );
  }

  const g = (
    <TypeList
      whitelistTypes={n}
      sectionName={'TYPE'}
      type={r}
      types={is}
      clickHandler={(e) => {
        Os(l, {
          type: e,
          subtype: [],
          extraProps: a,
          subtypeExtraProps: u,
        });
      }}
    />
  );

  const m = (
    <TypeList
      data-test="property-type-selector-basic-section"
      className="mt-2"
      whitelistTypes={n}
      type={r}
      types={h}
      clickHandler={(e) => {
        let t = difference(r, is);

        if (e) {
          if (e === '$ref') {
            t = ['$ref'];
          } else {
            pull(t, '$ref');

            if (ps(e, r)) {
              pull(t, e);
            } else {
              t.push(e);
            }
          }
        } else {
          t = [];
        }

        let n = i;

        if (!ps('array', t)) {
          n = [];
        }

        if (e === 'array') {
          pull(t, 'object');
        } else {
          if (e === 'object') {
            pull(t, 'array');
          }
        }

        Os(l, {
          type: t,
          subtype: n,
          extraProps: a,
          subtypeExtraProps: u,
        });
      }}
    />
  );

  return (
    <div className="flex flex-col text-sm p-3">
      {g}
      {m}
      {f}
      {p}
    </div>
  );
};

Selector.propTypes = {
  id: PropTypes.string,
  refSelector: PropTypes.func,
  whitelistTypes: PropTypes.array,
  type: PropTypes.array,
  subtype: PropTypes.array,
  refPath: PropTypes.string,
  extraProps: PropTypes.object,
  subtypeExtraProps: PropTypes.object,
  handleSave: PropTypes.func,
};

export default Selector;
