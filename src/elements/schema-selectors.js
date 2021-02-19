import React from 'react';
import styled from 'styled-components';

const SCHEMA_TYPES = ['object', 'array', 'string', 'boolean', 'integer', 'number'];

const SchemaTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  font-size: 11px;
  text-align: left;
`;

const SchemaTypeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FullWidthSep = styled.div`
  width: 100%;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const SchemaTypeItem = styled.div`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  margin-right: 0.5rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
            border-radius: 3px;
            background-color: #0b6fcc;
            color: #fff;
        `}

  ${({ selected }) =>
    !selected &&
    `
            &:hover {
                background-color: rgba(0,0,0,0.1);
            }
        `}
`;

class SchemaSelectors extends React.PureComponent {
  render() {
    const { handleItemClick, selectedItem } = this.props;
    return (
      <SchemaTypeWrapper>
        <FullWidthSep>TYPE</FullWidthSep>
        {/* Will support allOf/oneOf/anyOf later */}
        {/* <SchemaTypeRow>
                    <SchemaTypeRow>
                        <SchemaTypeItem>allOf</SchemaTypeItem>
                        <SchemaTypeItem>oneOf</SchemaTypeItem>
                        <SchemaTypeItem>anyOf</SchemaTypeItem>
                    </SchemaTypeRow>
                </SchemaTypeRow> */}
        <SchemaTypeRow>
          <SchemaTypeRow>
            {SCHEMA_TYPES.map((type, index) => {
              return (
                <SchemaTypeItem
                  key={index}
                  onClick={() => {
                    handleItemClick(type);
                  }}
                  selected={selectedItem === type}>
                  {type}
                </SchemaTypeItem>
              );
            })}
          </SchemaTypeRow>
        </SchemaTypeRow>
      </SchemaTypeWrapper>
    );
  }
}

export default SchemaSelectors;
