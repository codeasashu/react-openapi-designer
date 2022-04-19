import React from 'react';
//import PropTypes from 'prop-types';
import {Button, Icon, Popover, Colors, Tooltip} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
import {
  pick,
  cloneDeep,
  flattenDeep,
  intersection,
  compact,
  isObject,
  set,
  map,
  filter,
} from 'lodash';
import Selector from './Selector';

const additionalPropertiesFields = [
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

const as = ['string', 'number', 'integer', 'boolean', 'null', '$ref'];

const fs = (e, t) =>
  t !== null &&
  (Array.isArray(t) ? intersection(t, e).length > 0 : e.includes(t));
const ps = (e, t) => (Array.isArray(t) ? t.includes(e) : t === e);

// const Xa = {
//   integer: [
//     {
//       key: 'int32',
//       label: 'int32',
//       value: 'int32',
//     },
//     {
//       key: 'int64',
//       label: 'int64',
//       value: 'int64',
//     },
//   ],

//   number: [
//     {
//       key: 'float',
//       label: 'float',
//       value: 'float',
//     },
//     {
//       key: 'double',
//       label: 'double',
//       value: 'double',
//     },
//   ],

//   string: [
//     {
//       key: 'date',
//       label: 'date',
//       value: 'date',
//     },
//     {
//       key: 'time',
//       label: 'time',
//       value: 'time',
//     },
//     {
//       key: 'date-time',
//       label: 'date-time',
//       value: 'date-time',
//     },
//     {
//       key: 'duration',
//       label: 'duration',
//       value: 'duration',
//     },
//     {
//       key: 'uri',
//       label: 'uri',
//       value: 'uri',
//     },
//     {
//       key: 'uri-reference',
//       label: 'uri-reference',
//       value: 'uri-reference',
//     },
//     {
//       key: 'iri',
//       label: 'iri',
//       value: 'iri',
//     },
//     {
//       key: 'iri-reference',
//       label: 'iri-reference',
//       value: 'iri-reference',
//     },
//     {
//       key: 'email',
//       label: 'email',
//       value: 'email',
//     },
//     {
//       key: 'idn-email',
//       label: 'idn-email',
//       value: 'idn-email',
//     },
//     {
//       key: 'hostname',
//       label: 'hostname',
//       value: 'hostname',
//     },
//     {
//       key: 'idn-hostname',
//       label: 'idn-hostname',
//       value: 'idn-hostname',
//     },
//     {
//       key: 'password',
//       label: 'password',
//       value: 'password',
//     },
//     {
//       key: 'ipv4',
//       label: 'ipv4',
//       value: 'ipv4',
//     },
//     {
//       key: 'ipv6',
//       label: 'ipv6',
//       value: 'ipv6',
//     },
//     {
//       key: 'uuid',
//       label: 'uuid',
//       value: 'uuid',
//     },
//     {
//       key: 'uuid',
//       label: 'uuid',
//       value: 'uuid',
//     },
//     {
//       key: 'binary',
//       label: 'binary',
//       value: 'binary',
//     },
//     {
//       key: 'byte',
//       label: 'byte',
//       value: 'byte',
//     },
//     {
//       key: 'json-pointer',
//       label: 'json-pointer',
//       value: 'json-pointer',
//     },
//     {
//       key: 'relative-json-pointer',
//       label: 'relative-json-pointer',
//       value: 'relative-json-pointer',
//     },
//   ],
// };

const bs = {
  elemType: 'select',
};

const _s = {
  elemType: 'checkbox',
};

const ws = {
  elemType: 'text',

  elemProps: {
    type: 'number',
    placeholder: '>= 0',
  },
};

const Ms = {
  elemType: 'text',

  elemProps: {
    type: 'text',
  },
};

const es = [
  {
    key: 'readWrite',
    label: 'Read/Write',
    value: 'Read/Write',
  },
  {
    key: 'readOnly',
    label: 'Read Only',
    value: 'Read Only',
  },
];

const ts = [
  ...es,
  {
    key: 'writeOnly',
    label: 'Write Only',
    value: 'Write Only',
  },
];

const ns = {
  $default: {
    integer: ts,
    number: ts,
    string: ts,
    boolean: ts,
    array: ts,
    object: ts,
  },
};

const ys = {
  elemType: 'tag',

  elemProps: {
    placeholder: 'type an option and press enter',
  },
};

const Xa = {
  integer: [
    {
      key: 'int32',
      label: 'int32',
      value: 'int32',
    },
    {
      key: 'int64',
      label: 'int64',
      value: 'int64',
    },
  ],

  number: [
    {
      key: 'float',
      label: 'float',
      value: 'float',
    },
    {
      key: 'double',
      label: 'double',
      value: 'double',
    },
  ],

  string: [
    {
      key: 'date',
      label: 'date',
      value: 'date',
    },
    {
      key: 'time',
      label: 'time',
      value: 'time',
    },
    {
      key: 'date-time',
      label: 'date-time',
      value: 'date-time',
    },
    {
      key: 'duration',
      label: 'duration',
      value: 'duration',
    },
    {
      key: 'uri',
      label: 'uri',
      value: 'uri',
    },
    {
      key: 'uri-reference',
      label: 'uri-reference',
      value: 'uri-reference',
    },
    {
      key: 'iri',
      label: 'iri',
      value: 'iri',
    },
    {
      key: 'iri-reference',
      label: 'iri-reference',
      value: 'iri-reference',
    },
    {
      key: 'email',
      label: 'email',
      value: 'email',
    },
    {
      key: 'idn-email',
      label: 'idn-email',
      value: 'idn-email',
    },
    {
      key: 'hostname',
      label: 'hostname',
      value: 'hostname',
    },
    {
      key: 'idn-hostname',
      label: 'idn-hostname',
      value: 'idn-hostname',
    },
    {
      key: 'password',
      label: 'password',
      value: 'password',
    },
    {
      key: 'ipv4',
      label: 'ipv4',
      value: 'ipv4',
    },
    {
      key: 'ipv6',
      label: 'ipv6',
      value: 'ipv6',
    },
    {
      key: 'uuid',
      label: 'uuid',
      value: 'uuid',
    },
    {
      key: 'uuid',
      label: 'uuid',
      value: 'uuid',
    },
    {
      key: 'binary',
      label: 'binary',
      value: 'binary',
    },
    {
      key: 'byte',
      label: 'byte',
      value: 'byte',
    },
    {
      key: 'json-pointer',
      label: 'json-pointer',
      value: 'json-pointer',
    },
    {
      key: 'relative-json-pointer',
      label: 'relative-json-pointer',
      value: 'relative-json-pointer',
    },
  ],
};

const Ss = {
  common: [
    [
      {
        format: {
          elemType: 'suggestSelect',

          elemData: {
            validations: Xa,
          },
        },
      },
      {
        default: Object.assign(Object.assign({}, Ms), {
          elemProps: {
            type: 'text',
            placeholder: 'default',
          },
        }),
      },
      {
        deprecated: Object.assign({}, _s),
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, bs), {
          elemData: {
            validations: ns,
            noEmptyOption: true,
          },
        }),
      },
    ],
    [
      {
        enum: ys,
      },
    ],
    [
      {
        example: Object.assign(Object.assign({}, Ms), {
          elemProps: {
            type: 'text',
            placeholder: 'example',
          },
        }),
      },
    ],
  ],

  number: [
    [
      {
        minimum: ws,
      },
      {
        exclusiveMinimum: Object.assign(Object.assign({}, _s), {
          label: 'exclusiveMin',
        }),
      },
    ],
    [
      {
        maximum: ws,
      },
      {
        exclusiveMaximum: Object.assign(Object.assign({}, _s), {
          label: 'exclusiveMax',
        }),
      },
    ],
    [
      {
        multipleOf: ws,
      },
    ],
  ],

  integer: [
    [
      {
        minimum: ws,
      },
      {
        exclusiveMinimum: Object.assign(Object.assign({}, _s), {
          label: 'exclusiveMin',
        }),
      },
    ],
    [
      {
        maximum: ws,
      },
      {
        exclusiveMaximum: Object.assign(Object.assign({}, _s), {
          label: 'exclusiveMax',
        }),
      },
    ],
    [
      {
        multipleOf: ws,
      },
    ],
  ],

  string: [
    [
      {
        pattern: Object.assign(Object.assign({}, Ms), {
          elemProps: {
            type: 'text',
            placeholder: '^[A-Za-z0-9 -_]+',
          },
        }),
      },
    ],
    [
      {
        minLength: ws,
      },
      {
        maxLength: ws,
      },
    ],
  ],

  array: [
    [
      {
        uniqueItems: Object.assign(Object.assign({}, _s), {
          inline: true,
        }),
      },
      {
        deprecated: Object.assign(Object.assign({}, _s), {
          inline: true,
        }),
      },
    ],
    [
      {
        minItems: ws,
      },
      {
        maxItems: ws,
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, bs), {
          elemData: {
            validations: ns,
            noEmptyOption: true,
          },
        }),
      },
    ],
  ],

  object: [
    [
      {
        additionalProperties: Object.assign(Object.assign({}, _s), {
          inline: true,
          label: 'allow additional properties',
        }),
      },
      {
        deprecated: Object.assign(Object.assign({}, _s), {
          inline: true,
        }),
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, bs), {
          elemData: {
            validations: ns,
            noEmptyOption: true,
          },
        }),
      },
    ],
    [
      {
        minProperties: ws,
      },
      {
        maxProperties: ws,
      },
    ],
  ],
};

const P = (e, t, n) => {
  const r = {
    value: e,
    path: n,
  };

  if (t.onEnter) {
    t.onEnter(r);
  }

  for (const r of Object.keys(e)) {
    const o = e[r];

    if (t.onProperty) {
      t.onProperty({
        parent: e,
        parentPath: n,
        property: r,
        propertyValue: o,
      });
    }

    if (typeof o == 'object' && o !== null) {
      P(o, t, n.concat(r));
    }
  }

  if (t.onLeave) {
    t.onLeave(r);
  }
};

const traverse = (e, t) => {
  if (typeof e == 'object' && e !== null) {
    P(
      e,
      typeof t == 'function'
        ? {
            onProperty: t,
          }
        : t,
      [],
    );
  }
};

const Ns = (e, t) => {
  const n = cloneDeep(e);

  traverse(e, ({parentPath: e, property: r, propertyValue: i}) => {
    if (isObject(i) && Object.keys(i).includes('$default')) {
      const o = i['$' + t] || i.$default;
      set(n, [...e, r], o);
    }
  });

  return n;
};

const Ys = (e, t) => map(e, (e) => filter(e, (e) => !t.some((t) => t in e)));

const rs = {
  boolean: [
    {
      key: 'true',
      label: 'true',
      value: 'true',
    },
    {
      key: 'false',
      label: 'false',
      value: 'false',
    },
  ],
};

const $s = (e, t, n) => {
  const r = flattenDeep(compact([fs(as, t) && 'common', t]));
  const i = pick(Ns(e, n), r);

  if (r.includes('number') && r.includes('integer')) {
    delete i.integer;
  }

  if (r.includes('array') && r.includes('common') && i.array !== undefined) {
    i.array = Ys(i.array, ['deprecated']);
  }

  if (r.includes('object') && r.includes('common') && i.object !== undefined) {
    i.object = Ys(i.object, ['deprecated']);
  }

  if (
    r.includes('boolean') &&
    !fs(
      as.filter((e) => e !== 'boolean'),
      r,
    ) &&
    i.common !== undefined
  ) {
    i.common = [
      [
        {
          behavior: Object.assign(Object.assign({}, bs), {
            elemData: {
              validations: ns,
              noEmptyOption: true,
            },
          }),
        },
        {
          default: Object.assign(Object.assign({}, bs), {
            elemData: {
              validations: rs,
            },
          }),
        },
        {
          deprecated: Object.assign(Object.assign({}, _s), {
            inline: true,
          }),
        },
      ],
    ];
  }

  return i;
};

const ValidationSelector = (e) => {
  const {type, subtype, extraProps, subtypeExtraProps, spec, handleUpdateProp} =
    e;

  const u = [
    ...Object.keys(pick(cloneDeep(extraProps), additionalPropertiesFields)),
    ...Object.keys(
      pick(cloneDeep(subtypeExtraProps), additionalPropertiesFields),
    ),
  ].length;

  let subTypeSelector;

  if (ps('array', type) && subtype.length) {
    subTypeSelector = (
      <Selector
        propKey={'subtypeExtraProps'}
        type={subtype}
        props={subtypeExtraProps}
        isArrayChild={true}
        handleUpdateProp={handleUpdateProp}
        validations={$s(Ss, subtype, spec)}
      />
    );
  }

  return (
    <Popover2
      //boundary="window"
      //position="top-right"
      //targetClassName="h-full"
      content={
        <div className="p-5">
          <Selector
            propKey="extraProps"
            type={type}
            props={extraProps}
            subtype={subtype}
            handleUpdateProp={handleUpdateProp}
            validations={$s(Ss, type, spec)}
          />
          {subTypeSelector}
        </div>
      }>
      <Tooltip boundary="window" content="Other Properties" position="top">
        <span className="w-12 inline-flex justify-end">
          <Button
            icon={
              <Icon
                icon="property"
                size={12}
                color={u > 0 ? Colors.GRAY1 : Colors.GRAY4}
              />
            }
            minimal
            small
            className="z-10 text-sm mr-1"
            style={{color: u > 0 ? Colors.GRAY1 : Colors.GRAY4}}
            tabIndex={0}
            text={u > 0 ? u : ''}
          />
        </span>
      </Tooltip>
    </Popover2>
  );
};

export default ValidationSelector;
