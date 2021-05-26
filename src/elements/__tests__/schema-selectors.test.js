import React from 'react';
import SchemaSelectors from '../schema-selectors';
import {shallow} from 'enzyme';
import {shape} from 'prop-types';

describe('schema selectors', () => {
  it('Displays all the types correctly', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <SchemaSelectors schema={{type: 'string'}} onClick={handleClick} />,
    );

    const literals = wrapper.find('.schema-literal').map((node) => node.text());
    expect(literals.sort()).toEqual(
      ['string', 'object', 'array', 'boolean', 'integer', 'number'].sort(),
    );
  });

  it('Has schema required', () => {
    const mountEmptySchema = () =>
      shallow(<SchemaSelectors onClick={() => {}} />);
    expect(mountEmptySchema).toThrowError(/A valid schema is required/i);
  });

  it('Selects the passed schema', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <SchemaSelectors schema={{type: 'string'}} onClick={handleClick} />,
    );

    const literal = wrapper.find('.schema-literal').filter('.schema-string');
    expect(literal.prop('selected')).toBe(true);

    const otherliteral = wrapper
      .find('.schema-literal')
      .filter('.schema-object');
    expect(otherliteral.prop('selected')).toBe(false);
  });

  it('Triggers a click on selecting schema', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <SchemaSelectors schema={{type: 'string'}} onClick={handleClick} />,
    );

    const literal = wrapper.find('.schema-literal').filter('.schema-object');
    literal.simulate('click');
    expect(handleClick).toBeCalledWith('object', ['type']);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
