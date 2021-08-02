// @flow
import React from 'react';
import PropTypes from 'prop-types';

const SCHEMA_TYPES = [
  'object',
  'array',
  'string',
  'boolean',
  'integer',
  'number',
];

class Selectors extends React.PureComponent {
  renderSubType(schema) {
    const {onClick} = this.props;
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
                    schema.type === type
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  key={index}
                  onClick={() => onClick(type, ['items', 'type'])}
                  selected={schema.type === type}>
                  {type}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {schema, onClick} = this.props;
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
                    schema.type === type
                      ? 'bg-green-600 text-white schema-literal-selected'
                      : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  key={index}
                  onClick={() => onClick(type, ['type'])}
                  selected={schema.type === type}>
                  {type}
                </div>
              );
            })}
          </div>
        </div>
        {schema.type === 'array' && this.renderSubType(schema.items)}
      </div>
    );
  }
}

Selectors.propTypes = {
  onClick: PropTypes.func,
  schema: PropTypes.object,
};

export default Selectors;
