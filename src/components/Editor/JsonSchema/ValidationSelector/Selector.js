import React from 'react';
import PropTypes from 'prop-types';
import {
  clone,
  includes,
  pull,
  keys,
  values,
  isEmpty,
  get,
  intersection,
  uniq,
  compact,
} from 'lodash';
import {
  FormGroup,
  Switch,
  HTMLSelect,
  InputGroup,
  TagInput,
} from '@blueprintjs/core';
import classNames from 'classnames';
import SuggestionSelector from './Suggestions';

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

const is = ['allOf', 'oneOf', 'anyOf'];

const Selector = (props) => {
  const {
    propKey: t,
    type: _type, // n
    subtype: r,
    props: i,
    isArrayChild: o,
    handleUpdateProp: a,
    validations, // u
    commonValidationName: l,
  } = props;

  const type = clone(_type); // d = clone(n)

  if (fs(is, _type) || (ps('null', _type) && _type.length === 1)) {
    return null;
  }

  if (includes(type, 'number')) {
    pull(type, 'integer');
  }

  const h = [];

  console.log('init selector1', validations);

  for (const validation in validations) {
    console.log('validator11', validation);
    // e in u
    if (isEmpty(validations[validation])) {
      continue;
    }

    const d = [];

    for (const validators of validations[validation]) {
      // o of u[e]
      const e = validators.map((validator, index) => {
        // map(e, o) =>
        const u = keys(validator)[0];
        const l = values(validator)[0];
        const d = l.elemProps;
        const h = l.elemData || {};
        let f;
        const p = get(i, u);

        switch (l.elemType) {
          case 'checkbox':
            const e =
              u === 'additionalProperties'
                ? p === undefined || p !== false
                : !!p;

            f = (
              <Switch
                {...d}
                data-test={`${t}-${u}`}
                id={`${t}-${u}`}
                defaultChecked={e}
                onChange={(e) => {
                  a(t, u, e.currentTarget.checked);
                }}
              />
            );

            break;
          case 'text':
            f = (
              <InputGroup
                {...d}
                data-test={`${t}-${u}`}
                value={p !== undefined ? p : ''}
                onChange={(e) => {
                  const r =
                    ['example', 'default'].includes(u) &&
                    intersection(_type, ['number', 'integer']).length > 0 &&
                    !Number.isNaN(Number(e.target.value)) &&
                    !e.target.value.endsWith('.')
                      ? Number(e.target.value)
                      : e.target.value;
                  a(t, u, r);
                }}
              />
            );
            break;
          case 'tag':
            f = (
              <TagInput
                {...d}
                values={Array.isArray(p) ? p.map(String) : []}
                inputProps={{
                  'data-test': `${t}-${u}`,
                }}
                onChange={(e) => {
                  a(
                    t,
                    u,
                    intersection(_type, ['number', 'integer']).length > 0
                      ? e.map((e) => (Number.isNaN(Number(e)) ? e : Number(e)))
                      : e,
                  );
                }}
              />
            );
            break;
          case 'select': {
            const {validations: e = {}, noEmptyOption: i} = h;

            let o = clone(_type);

            if (includes(o, 'array') && typeof r == 'string') {
              o = o.concat(r);
            }

            let l = i ? [] : ['none'];

            for (const t of o) {
              l = l.concat(
                ((e == null ? undefined : e[t]) || []).map((e) => e.value),
              );
            }

            f = (
              <HTMLSelect
                {...d}
                fill
                options={uniq(compact(l))}
                data-test={`${t}-${u}`}
                value={p !== 'none' ? p : 'none'}
                onChange={(e) => {
                  const n = e.target.value;
                  a(t, u, n && n !== 'none' ? n : '');
                }}
              />
            );

            break;
          }
          case 'suggestSelect': {
            const {validations: e = {}, noEmptyOption: i} = h;

            let o = clone(_type);

            if (includes(o, 'array') && typeof r == 'string') {
              o = o.concat(r);
            }

            let s = i ? [] : ['none'];

            for (const t of o) {
              s = s.concat(
                ((e == null ? undefined : e[t]) || []).map((e) => e.value),
              );
            }

            f = React.createElement(SuggestionSelector, {
              'data-test': `${t}-${u}`,
              items: uniq(compact(s)),
              selectedItem: p && p !== 'none' ? p : 'none',

              onItemSelect: (e) => {
                a(t, u, e && e !== 'none' ? e : '');
              },

              allowCreate: true,
            });

            break;
          }
        }

        return (
          <FormGroup
            key={index}
            inline={l.inline}
            className={classNames(
              'mb-0',
              l.elemType !== 'checkbox' && 'flex-1',
              o && 'ml-3',
            )}
            label={<div className="text-sm font-normal">{l.label || u}</div>}
            contentClassName="text-center"
          >
            {f}
          </FormGroup>
        );
      });

      if (e.length) {
        d.push(<div className="flex pb-2">{e}</div>);
      }
    }

    if (d.length) {
      const t = Object.keys(validations);
      console.log('key11', validation);
      h.push(
        <div
          key={validation}
          className={classNames(validation !== t[t.length - 1] && 'pb-6')}
        >
          <div className="uppercase font-semibold pb-3">
            {o
              ? `Subtype ${
                  validation === 'common' ? '' : validation
                } properties`
              : validation === 'common'
              ? l
                ? l + ' properties'
                : 'other properties'
              : validation + ' properties'}
          </div>
          {d}
        </div>,
      );
    }
  }

  return (
    <div
      className="text-sm overflow-auto p-1"
      style={{
        width: 360,
        maxHeight: 500,
      }}
    >
      {h.length ? h : 'No validations for this type'}
    </div>
  );
};

Selector.propTypes = {
  propKey: PropTypes.any,
  subtype: PropTypes.any,
  props: PropTypes.any,
  isArrayChild: PropTypes.bool,
  handleUpdateProp: PropTypes.func,
  commonValidationName: PropTypes.string,
  type: PropTypes.any,
  validations: PropTypes.any,
  onChange: PropTypes.func,
};

export default Selector;
