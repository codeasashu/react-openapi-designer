import React from 'react';

const SCHEMA_TYPES = ['object', 'array', 'string', 'boolean', 'integer', 'number'];

class SchemaSelectors extends React.PureComponent {

  _handleSelectType(type, prefix) {
    const { onClick } = this.props;
    console.log('handleTTypeclick', type, prefix);
    onClick(type, prefix);
  }

  _handleSelectSubType(subType) {
    console.log('subttype', subType);
  }

  renderSubType(schema, handleOnClick) {
    return (
      <div>
      <div className="w-full uppercase font-semibold mb-2">SUBTYPE</div>
      <div className="mt-2 flex flex-wrap">
          <div className="flex flex-wrap text-xs">
            {SCHEMA_TYPES.map((type, index) => {
              return (
                <div className={
                  `flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer 
                  ${schema.type === type ? 'bg-green-600 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  key={index}
                  onClick={e => this._handleSelectType(type, ['items', 'type'])}
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
    const { schema } = this.props;
    return (
      <div className="flex flex-col text-sm p-3">
        <div className="w-full uppercase font-semibold mb-2">TYPE</div>
        <div className="mt-2 flex flex-wrap">
          <div className="flex flex-wrap text-xs">
            {SCHEMA_TYPES.map((type, index) => {
              return (
                <div className={
                  `flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer 
                  ${schema.type === type ? 'bg-green-600 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  key={index}
                  onClick={e => this._handleSelectType(type, ['type'])}
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

export default SchemaSelectors;
