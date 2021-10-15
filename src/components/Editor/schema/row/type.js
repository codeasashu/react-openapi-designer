import React from 'react';
import {pick, cloneDeep} from 'lodash';

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));

const ds = [
  'additionalProperties',
  'maxProperties',
  'minProperties',
  'uniqueItems',
  'maxItems',
  'minItems',
  'maxLength',
  'minLength',
  'pattern',
  'maximum',
  'minimum',
  'multipleOf',
  'enum',
  'format',
  'deprecated',
  'behavior',
  'example',
  'default',
];

const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

const Gs = (e) => {
  const {
    type: t,
    subtype: n,
    extraProps: r,
    subtypeExtraProps: i,
    spec: o,
    handleUpdateProp: a,
  } = e;

  const u = [
    ...Object.keys(pick(cloneDeep(r), ds)),
    ...Object.keys(pick(cloneDeep(i), ds)),
  ].length;

  let l;

  if (ps('array', t) && n.length) {
    l = React.createElement(Qs, {
      propKey: 'subtypeExtraProps',
      type: n,
      props: i,
      isArrayChild: true,
      handleUpdateProp: a,
      validations: $s(Ss, n, o),
    });
  }

  return c.createElement(s.Popover, {
    boundary: 'window',
    position: 'top-right',
    targetClassName: 'h-full',

    target: c.createElement(
      s.Tooltip,
      {
        boundary: 'window',
        content: 'Other Properties',
        position: 'top',
      },
      c.createElement(
        'span',
        {
          className: 'w-12 inline-flex justify-end',
        },
        c.createElement(
          'button',
          {
            'data-test': 'other-properties-btn',
            tabIndex: 0,
            type: 'button',
            className: 'bp3-button bp3-minimal bp3-small z-10',
          },
          c.createElement(
            'span',
            {
              className: 'bp3-button-text text-sm mr-1',

              style: {
                color: u > 0 ? s.Colors.GRAY1 : s.Colors.GRAY4,
              },
            },
            u > 0 ? u : '',
          ),
          c.createElement(s.Icon, {
            icon: 'property',
            iconSize: 12,
            color: u > 0 ? s.Colors.GRAY1 : s.Colors.GRAY4,
          }),
        ),
      ),
    ),

    content: c.createElement(
      'div',
      {
        className: 'p-5',
      },
      c.createElement(Qs, {
        propKey: 'extraProps',
        type: t,
        props: r,
        subtype: n,
        handleUpdateProp: a,
        validations: $s(Ss, t, o),
      }),
      l,
    ),
  });
};
