import React from 'react';

const SCHEMA_TYPES = ['object', 'array', 'string', 'boolean', 'integer', 'number'];

const SchemaTypeWrapper = `
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  font-size: 11px;
  text-align: left;
`;

const SchemaTypeRow = `
  display: flex;
  flex-wrap: wrap;
`;

const FullWidthSep = `
  width: 100%;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const SchemaTypeItem = `
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  margin-right: 0.5rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

class SchemaSelectors extends React.PureComponent {
  render() {
    const { handleItemClick, selectedItem } = this.props;
    return (
      <div className="flex flex-col text-sm p-3">
        <div className="w-full uppercase font-semibold mb-2">TYPE</div>
        {/* Will support allOf/oneOf/anyOf later */}
        {/* <SchemaTypeRow>
                    <SchemaTypeRow>
                        <SchemaTypeItem>allOf</SchemaTypeItem>
                        <SchemaTypeItem>oneOf</SchemaTypeItem>
                        <SchemaTypeItem>anyOf</SchemaTypeItem>
                    </SchemaTypeRow>
                </SchemaTypeRow> */}
        <div className="mt-2 flex flex-wrap">
          <div className="flex flex-wrap text-xs">
            {SCHEMA_TYPES.map((type, index) => {
              return (
                <div className={
                  `flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer 
                  ${selectedItem === type ? 'bg-green-600 text-white' : 'hover:bg-gray-300'}`}
                  key={index}
                  onClick={() => {
                    handleItemClick(type);
                  }}
                  selected={selectedItem === type}>
                  {type}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default SchemaSelectors;
