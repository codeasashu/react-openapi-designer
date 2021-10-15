import React from 'react';
import {includes, pull, clone} from 'lodash';

const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

const Qs = (e) => {
  const {
    propKey: t,
    type: n,
    subtype: r,
    props: i,
    isArrayChild: o,
    handleUpdateProp: a,
    validations: u,
    commonValidationName: l,
  } = e;

  const d = clone(n);

  if (fs(is, n) || (ps('null', n) && n.length === 1)) {
    return null;
  }

  if (includes(d, 'number')) {
    pull(d, 'integer');
  }

  const h = [];

  for (const e in u) {
    if (Object(S.isEmpty)(u[e])) {
      continue;
    }

    const d = [];

    for (const o of u[e]) {
      const e = o.map((e, o) => {
        const u = Object(S.keys)(e)[0];
        const l = Object(S.values)(e)[0];
        const d = l.elemProps;
        const h = l.elemData || {};
        let f;
        const p = Object(S.get)(i, u);

        switch (l.elemType) {
          case 'checkbox':
            const e =
              u === 'additionalProperties'
                ? p === undefined || p !== false
                : !!p;

            f = c.createElement(
              s.Switch,
              Object.assign({}, d, {
                'data-test': `${t}-${u}`,
                id: `${t}-${u}`,
                defaultChecked: e,

                onChange: (e) => {
                  a(t, u, e.currentTarget.checked);
                },
              }),
            );

            break;
          case 'text':
            f = c.createElement(
              s.InputGroup,
              Object.assign({}, d, {
                'data-test': `${t}-${u}`,
                value: p !== undefined ? p : '',

                onChange: (e) => {
                  const r =
                    ['example', 'default'].includes(u) &&
                    Object(S.intersection)(n, ['number', 'integer']).length >
                      0 &&
                    !Number.isNaN(Number(e.target.value)) &&
                    !e.target.value.endsWith('.')
                      ? Number(e.target.value)
                      : e.target.value;
                  a(t, u, r);
                },
              }),
            );

            break;
          case 'tag':
            f = c.createElement(
              s.TagInput,
              Object.assign({}, d, {
                values: Array.isArray(p) ? p.map(String) : [],

                inputProps: {
                  'data-test': `${t}-${u}`,
                },

                onChange: (e) => {
                  a(
                    t,
                    u,
                    Object(S.intersection)(n, ['number', 'integer']).length > 0
                      ? e.map((e) => (Number.isNaN(Number(e)) ? e : Number(e)))
                      : e,
                  );
                },
              }),
            );

            break;
          case 'select': {
            const {validations: e = {}, noEmptyOption: i} = h;

            let o = Object(S.clone)(n);

            if (Object(S.includes)(o, 'array') && typeof r == 'string') {
              o = o.concat(r);
            }

            let l = i ? [] : ['none'];

            for (const t of o) {
              l = l.concat(
                ((e == null ? undefined : e[t]) || []).map((e) => e.value),
              );
            }

            f = c.createElement(
              s.HTMLSelect,
              Object.assign({}, d, {
                'data-test': `${t}-${u}`,
                value: p !== 'none' ? p : 'none',
                fill: true,
                options: Object(S.uniq)(Object(S.compact)(l)),

                onChange: (e) => {
                  const n = e.target.value;
                  a(t, u, n && n !== 'none' ? n : '');
                },
              }),
            );

            break;
          }
          case 'suggestSelect': {
            const {validations: e = {}, noEmptyOption: i} = h;

            let o = Object(S.clone)(n);

            if (Object(S.includes)(o, 'array') && typeof r == 'string') {
              o = o.concat(r);
            }

            let s = i ? [] : ['none'];

            for (const t of o) {
              s = s.concat(
                ((e == null ? undefined : e[t]) || []).map((e) => e.value),
              );
            }

            f = c.createElement(Hs, {
              'data-test': `${t}-${u}`,
              items: Object(S.uniq)(Object(S.compact)(s)),
              selectedItem: p && p !== 'none' ? p : 'none',

              onItemSelect: (e) => {
                a(t, u, e && e !== 'none' ? e : '');
              },

              allowCreate: true,
            });

            break;
          }
        }

        return c.createElement(
          s.FormGroup,
          {
            key: o,
            inline: l.inline,
            className: R(
              'mb-0',
              l.elemType !== 'checkbox' && 'flex-1',
              o && 'ml-3',
            ),

            label: c.createElement(
              'div',
              {
                className: 'text-sm font-normal',
              },
              l.label || u,
            ),

            contentClassName: 'text-center',
          },
          f,
        );
      });

      if (e.length) {
        d.push(
          c.createElement(
            'div',
            {
              className: 'flex pb-2',
            },
            e,
          ),
        );
      }
    }

    if (d.length) {
      const t = Object.keys(u);

      h.push(
        c.createElement(
          'div',
          {
            key: e,
            className: R(e !== t[t.length - 1] && 'pb-6'),
          },
          c.createElement(
            'div',
            {
              className: 'uppercase font-semibold pb-3',
            },
            o
              ? `Subtype ${e === 'common' ? '' : e} properties`
              : e === 'common'
              ? l
                ? l + ' properties'
                : 'other properties'
              : e + ' properties',
          ),
          d,
        ),
      );
    }
  }

  return c.createElement(
    'div',
    {
      className: 'text-sm overflow-auto p-1',

      style: {
        width: 360,
        maxHeight: 500,
      },
    },
    h.length ? h : 'No validations for this type',
  );
};
