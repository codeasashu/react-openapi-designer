import React from 'react';
//import PropTypes from 'prop-types';
import {Button, Icon, Colors, Classes as BP4Classes} from '@blueprintjs/core';
import {Popover2, Classes} from '@blueprintjs/popover2';
import {
  pick,
  cloneDeep,
  flattenDeep,
  compact,
  isObject,
  set,
  map,
  filter,
} from 'lodash';
import {
  isInside,
  isTypesInsideTypes,
  validBasicTypes,
} from '../../../../utils/schema';
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

const selectElement = {
  elemType: 'select',
};

const checkboxElement = {
  elemType: 'checkbox',
};

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

const removeFromProperties = (e, t) =>
  map(e, (e) => filter(e, (e) => !t.some((t) => t in e)));

const booleanValidations = {
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

const buildValidations = (propertiesData, types, spec) => {
  const commonTypes = flattenDeep(
    compact([isTypesInsideTypes(validBasicTypes, types) && 'common', types]),
  );
  const i = pick(NormalizePropertiesData(propertiesData, spec), commonTypes);

  if (commonTypes.includes('number') && commonTypes.includes('integer')) {
    delete i.integer;
  }

  if (
    commonTypes.includes('array') &&
    commonTypes.includes('common') &&
    i.array !== undefined
  ) {
    i.array = removeFromProperties(i.array, ['deprecated']);
  }

  if (
    commonTypes.includes('object') &&
    commonTypes.includes('common') &&
    i.object !== undefined
  ) {
    i.object = removeFromProperties(i.object, ['deprecated']);
  }

  if (
    commonTypes.includes('boolean') &&
    !isTypesInsideTypes(
      validBasicTypes.filter((e) => e !== 'boolean'),
      commonTypes,
    ) &&
    i.common !== undefined
  ) {
    i.common = [
      [
        {
          behavior: Object.assign(Object.assign({}, selectElement), {
            elemData: {
              validations,
              noEmptyOption: true,
            },
          }),
        },
        {
          default: Object.assign(Object.assign({}, selectElement), {
            elemData: {
              validations: booleanValidations,
            },
          }),
        },
        {
          deprecated: Object.assign(Object.assign({}, checkboxElement), {
            inline: true,
          }),
        },
      ],
    ];
  }

  return i;
};

const OtherProperties = (e) => {
  const {type, subtype, extraProps, subtypeExtraProps, spec, handleUpdateProp} =
    e;
  const [isOpen, setOpen] = React.useState(false);

  const additionalPropertiesCount = [
    ...Object.keys(pick(cloneDeep(extraProps), additionalPropertiesFields)),
    ...Object.keys(
      pick(cloneDeep(subtypeExtraProps), additionalPropertiesFields),
    ),
  ].length;

  let subTypeSelector;

  if (isInside('array', type) && subtype.length) {
    subTypeSelector = (
      <Selector
        propKey={'subtypeExtraProps'}
        type={subtype}
        props={subtypeExtraProps}
        isArrayChild={true}
        handleUpdateProp={handleUpdateProp}
        validations={buildValidations(propertiesData, subtype, spec)}
      />
    );
  }

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
        <div className="flex flex-1">
          <Selector
            propKey="extraProps"
            type={type}
            props={extraProps}
            subtype={subtype}
            handleUpdateProp={handleUpdateProp}
            validations={buildValidations(propertiesData, type, spec)}
          />
          {subTypeSelector}
        </div>
      }>
      <span className="w-12 inline-flex justify-end">
        <Button
          icon={
            <Icon
              icon="property"
              size={12}
              color={
                additionalPropertiesCount > 0 ? Colors.GRAY1 : Colors.GRAY4
              }
            />
          }
          minimal
          small
          className="z-10 text-sm mr-1"
          data-testid="other-properties-button"
          style={{
            color: additionalPropertiesCount > 0 ? Colors.GRAY1 : Colors.GRAY4,
          }}
          tabIndex={0}
          text={additionalPropertiesCount > 0 ? additionalPropertiesCount : ''}
        />
      </span>
    </Popover2>
  );
};

export default OtherProperties;
