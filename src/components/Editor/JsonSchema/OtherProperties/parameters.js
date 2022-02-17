import React from 'react';
//import PropTypes from 'prop-types';
import {Button, Icon, Classes as BP4Classes} from '@blueprintjs/core';
import {Popover2, Classes} from '@blueprintjs/popover2';
import {
  pick,
  cloneDeep,
  flattenDeep,
  compact,
  isObject,
  set,
  chunk,
} from 'lodash';
import {getValueFromStore} from '../../../../utils/selectors';
import Selector from './Selector';

const selectElement = {
  elemType: 'select',
};

const checkboxElement = {
  elemType: 'checkbox',
};

const recurseTraverse = (propertiesData, visitor, path) => {
  const currentData = {
    value: propertiesData,
    path,
  };

  if (visitor.onEnter) {
    visitor.onEnter(currentData);
  }

  for (const property of Object.keys(propertiesData)) {
    const propertyValue = propertiesData[property];

    if (visitor.onProperty) {
      visitor.onProperty({
        parent: propertiesData,
        parentPath: path,
        property,
        propertyValue,
      });
    }

    if (typeof propertyValue == 'object' && propertyValue !== null) {
      recurseTraverse(propertyValue, visitor, path.concat(property));
    }
  }

  if (visitor.onLeave) {
    visitor.onLeave(currentData);
  }
};

const traverse = (propertiesData, visitor) => {
  if (typeof propertiesData == 'object' && propertiesData !== null) {
    recurseTraverse(
      propertiesData,
      typeof visitor == 'function'
        ? {
            onProperty: visitor,
          }
        : visitor,
      [],
    );
  }
};

const NormalizePropertiesData = (propertiesData, spec) => {
  const _data = cloneDeep(propertiesData);

  traverse(propertiesData, ({parentPath, property, propertyValue}) => {
    if (
      isObject(propertyValue) &&
      Object.keys(propertyValue).includes('$default')
    ) {
      const o = propertyValue['$' + spec] || propertyValue.$default;
      set(_data, [...parentPath, property], o);
    }
  });

  return _data;
};

const ParameterFields = [
  {
    value: {
      key: 'matrix',
      label: 'matrix',
      value: 'matrix',
    },

    types: ['integer', 'number', 'string', 'array', 'object'],
    in: ['path'],
  },
  {
    value: {
      key: 'label',
      label: 'label',
      value: 'label',
    },

    types: ['integer', 'number', 'string', 'array', 'object'],
    in: ['path'],
  },
  {
    value: {
      key: 'form',
      label: 'form',
      value: 'form',
    },

    types: ['integer', 'number', 'string', 'array', 'object'],
    in: ['query', 'cookie'],
  },
  {
    value: {
      key: 'simple',
      label: 'simple',
      value: 'simple',
    },

    types: ['array'],
    in: ['path', 'header'],
  },
  {
    value: {
      key: 'spaceDelimited',
      label: 'spaceDelimited',
      value: 'spaceDelimited',
    },

    types: ['array'],
    in: ['query'],
  },
  {
    value: {
      key: 'pipeDelimited',
      label: 'pipeDelimited',
      value: 'pipeDelimited',
    },

    types: ['array'],
    in: ['query'],
  },
  {
    value: {
      key: 'deepObject',
      label: 'deepObject',
      value: 'deepObject',
    },

    types: ['object'],
    in: ['query'],
  },
];

const numbericElement = {
  elemType: 'text',

  elemProps: {
    type: 'number',
    placeholder: '>= 0',
  },
};

const textElement = {
  elemType: 'text',

  elemProps: {
    type: 'text',
  },
};

const StringFormats = {
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

const readWriteValidations = [
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

const adminValidations = [
  ...readWriteValidations,
  {
    key: 'writeOnly',
    label: 'Write Only',
    value: 'Write Only',
  },
];
const validations = {
  $default: {
    integer: adminValidations,
    number: adminValidations,
    string: adminValidations,
    boolean: adminValidations,
    array: adminValidations,
    object: adminValidations,
  },
};

const enumElement = {
  elemType: 'tag',

  elemProps: {
    placeholder: 'type an option and press enter',
  },
};

const propertiesData = {
  common: [
    [
      {
        format: {
          elemType: 'suggestSelect',

          elemData: {
            validations: StringFormats,
          },
        },
      },
      {
        default: Object.assign(Object.assign({}, textElement), {
          elemProps: {
            type: 'text',
            placeholder: 'default',
          },
        }),
      },
      {
        deprecated: Object.assign({}, checkboxElement),
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, selectElement), {
          elemData: {
            validations,
            noEmptyOption: true,
          },
        }),
      },
    ],
    [
      {
        enum: enumElement,
      },
    ],
    [
      {
        example: Object.assign(Object.assign({}, textElement), {
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
        minimum: numbericElement,
      },
      {
        exclusiveMinimum: Object.assign(Object.assign({}, checkboxElement), {
          label: 'exclusiveMin',
        }),
      },
    ],
    [
      {
        maximum: numbericElement,
      },
      {
        exclusiveMaximum: Object.assign(Object.assign({}, checkboxElement), {
          label: 'exclusiveMax',
        }),
      },
    ],
    [
      {
        multipleOf: numbericElement,
      },
    ],
  ],

  integer: [
    [
      {
        minimum: numbericElement,
      },
      {
        exclusiveMinimum: Object.assign(Object.assign({}, checkboxElement), {
          label: 'exclusiveMin',
        }),
      },
    ],
    [
      {
        maximum: numbericElement,
      },
      {
        exclusiveMaximum: Object.assign(Object.assign({}, checkboxElement), {
          label: 'exclusiveMax',
        }),
      },
    ],
    [
      {
        multipleOf: numbericElement,
      },
    ],
  ],

  string: [
    [
      {
        pattern: Object.assign(Object.assign({}, textElement), {
          elemProps: {
            type: 'text',
            placeholder: '^[A-Za-z0-9 -_]+',
          },
        }),
      },
    ],
    [
      {
        minLength: numbericElement,
      },
      {
        maxLength: numbericElement,
      },
    ],
  ],

  array: [
    [
      {
        uniqueItems: Object.assign(Object.assign({}, checkboxElement), {
          inline: true,
        }),
      },
      {
        deprecated: Object.assign(Object.assign({}, checkboxElement), {
          inline: true,
        }),
      },
    ],
    [
      {
        minItems: numbericElement,
      },
      {
        maxItems: numbericElement,
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, selectElement), {
          elemData: {
            validations,
            noEmptyOption: true,
          },
        }),
      },
    ],
  ],

  object: [
    [
      {
        additionalProperties: Object.assign(
          Object.assign({}, checkboxElement),
          {
            inline: true,
            label: 'allow additional properties',
          },
        ),
      },
      {
        deprecated: Object.assign(Object.assign({}, checkboxElement), {
          inline: true,
        }),
      },
    ],
    [
      {
        behavior: Object.assign(Object.assign({}, selectElement), {
          elemData: {
            validations,
            noEmptyOption: true,
          },
        }),
      },
    ],
    [
      {
        minProperties: numbericElement,
      },
      {
        maxProperties: numbericElement,
      },
    ],
  ],
};

const SchemaValidations = Object.assign(Object.assign({}, propertiesData), {
  common: {
    $oas2_0: [
      [
        {
          format: {
            elemType: 'suggestSelect',

            elemData: {
              validations: StringFormats,
            },
          },
        },
        {
          default: Object.assign(Object.assign({}, textElement), {
            elemProps: {
              type: 'text',
              placeholder: 'default',
            },
          }),
        },
        {
          deprecated: Object.assign({}, checkboxElement),
        },
        {
          allowEmptyValue: Object.assign({}, checkboxElement),
        },
      ],
    ],

    $default: [
      [
        {
          format: {
            elemType: 'suggestSelect',

            elemData: {
              validations: StringFormats,
            },
          },
        },
        {
          default: Object.assign(Object.assign({}, textElement), {
            elemProps: {
              type: 'text',
              placeholder: 'default',
            },
          }),
        },
      ],
      [
        {
          enum: enumElement,
        },
      ],
      [
        {
          example: Object.assign(Object.assign({}, textElement), {
            elemProps: {
              type: 'text',
              placeholder: 'example',
            },
          }),
        },
      ],
    ],
  },
});

const filterValidators = (fields, paramIn, type) =>
  fields
    .filter((field) => field.types.includes(type) && field.in.includes(paramIn))
    .map((e) => e.value);

const commonValidations = (paramIn) => ({
  integer: filterValidators(ParameterFields, paramIn, 'integer'),
  number: filterValidators(ParameterFields, paramIn, 'number'),
  string: filterValidators(ParameterFields, paramIn, 'string'),
  array: filterValidators(ParameterFields, paramIn, 'array'),
  object: filterValidators(ParameterFields, paramIn, 'object'),
});

const basicValidations = (validations, type, spec) => {
  const common_validations = flattenDeep(compact(['common', type]));
  return pick(NormalizePropertiesData(validations, spec), common_validations);
};

const buildValidations = (parameterIn, type, spec) => {
  const validations = [
    ...(type !== 'boolean'
      ? [
          {
            style: Object.assign(Object.assign({}, selectElement), {
              elemData: {
                validations: commonValidations(parameterIn),
              },
            }),
          },
        ]
      : []),
    {
      deprecated: Object.assign({}, checkboxElement),
    },
    ...(parameterIn === 'query'
      ? [
          {
            allowEmptyValue: Object.assign({}, checkboxElement),
          },
        ]
      : []),
    ...(parameterIn === 'query'
      ? [
          {
            allowReserved: Object.assign({}, checkboxElement),
          },
        ]
      : []),
    ...(parameterIn === 'array'
      ? [
          {
            explode: Object.assign({}, checkboxElement),
          },
        ]
      : []),
  ];

  const common = chunk(validations, 4);

  return basicValidations(
    {
      common,
    },
    type,
    spec,
  );
};

const OtherProperties = (e) => {
  const {relativeJsonPath, parameterIn, spec, handleUpdate} = e;
  const [isOpen, setOpen] = React.useState(false);

  const paramProps = getValueFromStore(relativeJsonPath);
  const schema = getValueFromStore(relativeJsonPath.concat(['schema']));

  const handlePropUpdate = handleUpdate(relativeJsonPath);
  const handlePropSchemaUpdate = handleUpdate(
    relativeJsonPath.concat('schema'),
  );

  return (
    <Popover2
      boundary="window"
      popoverClassName={(Classes.POPOVER2_CONTENT_SIZING, BP4Classes.DARK)}
      usePortal={true}
      fill={true}
      placement="left"
      isOpen={isOpen}
      onInteraction={(e) => setOpen(e)}
      content={
        <div className="">
          <Selector
            propKey="paramProps"
            type={[schema?.type]}
            props={paramProps}
            subtype={[]}
            handleUpdateProp={(e, t, n) => {
              console.log('Handle ParamProp update', e, t, n, relativeJsonPath);
              handlePropUpdate(e, t, n);
            }}
            validations={buildValidations(parameterIn, schema?.type, spec)}
            commonValidationName="parameter"
          />
          <Selector
            propKey="schemaProps"
            type={[schema?.type]}
            props={schema}
            subtype={[]}
            handleUpdateProp={(e, t, n) => {
              console.log('Handle ParamSchemaProp update', e, t, n);
              handlePropSchemaUpdate(e, t, n);
            }}
            validations={basicValidations(
              SchemaValidations,
              schema?.type,
              spec,
            )}
            commonValidationName="schema"
          />
          {/* {subTypeSelector} */}
        </div>
      }>
      <Button
        icon={<Icon icon="property" size={12} />}
        className="z-10 text-sm mr-1"
        data-testid="other-properties-button"
      />
    </Popover2>
  );
};

export default OtherProperties;
