import React from 'react';
import {shallow, mount} from 'enzyme';
import ArrayProperty from '../../properties/array-property';
import * as Keywords from '../../keywords';

/**
 * @TODO Add isSubtype tests as well
 **/
describe('Array property tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('Uniqueitem tests', () => {
    const onChange = jest.fn();

    const getElement = (wrapper) => wrapper.find(Keywords.UniqueItems).first();

    it('UniqueItems change works', async () => {
      const wrapper = shallow(
        <ArrayProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(getElement(wrapper).prop('value')).toBeUndefined();
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {uniqueItems: false}});
      expect(getElement(wrapper).prop('value')).toBe(false);
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {uniqueItems: true}});
      expect(getElement(wrapper).prop('value')).toBe(true);
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {uniqueItems: undefined}});
      expect(getElement(wrapper).prop('value')).toBe(undefined);
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Min Max item tests', () => {
    const onChange = jest.fn();

    beforeAll(() => {
      jest.resetAllMocks();
    });

    const minItemElement = (wrapper) => wrapper.find(Keywords.MinItems).first();
    const maxItemElement = (wrapper) => wrapper.find(Keywords.MaxItems).first();

    it('accepts blank minItems', () => {
      const wrapper = shallow(
        <ArrayProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(minItemElement(wrapper).prop('value')).toBe('');
      expect(maxItemElement(wrapper).prop('value')).toBe('');
      expect(onChange).toHaveBeenCalledTimes(0);

      minItemElement(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenCalledWith({minItems: 1});
      expect(onChange).toHaveBeenCalledTimes(1);

      maxItemElement(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenCalledWith({maxItems: 1});
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('works with valid integer values', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <ArrayProperty
          isSubtype={false}
          onChange={onChange}
          data={{minItems: 3}}
        />,
      );

      expect(minItemElement(wrapper).prop('value')).toBe(3);
      expect(maxItemElement(wrapper).prop('value')).toBe('');

      wrapper.setProps({data: {minItems: 'abc'}});
      expect(minItemElement(wrapper).prop('value')).toBe('abc');
      expect(maxItemElement(wrapper).prop('value')).toBe('');

      wrapper.setProps({data: {minItems: -4}});
      expect(minItemElement(wrapper).prop('value')).toBe(-4);
      expect(maxItemElement(wrapper).prop('value')).toBe('');

      wrapper.setProps({data: {maxItems: 55}});
      expect(maxItemElement(wrapper).prop('value')).toBe(55);
      expect(minItemElement(wrapper).prop('value')).toBe('');
    });
  });

  describe('Child renders', () => {
    it('renders a child after parent node', () => {
      const onChange = jest.fn();
      const wrapper = shallow(
        <ArrayProperty
          isSubtype={false}
          onChange={onChange}
          data={{}}
          child={<h1 className="test-child">Test Child</h1>}
        />,
      );

      expect(wrapper.find('.test-child').text()).toBe('Test Child');
      expect(wrapper.find('.parent-node').parents().childAt(1).text()).toBe(
        'Test Child',
      );
    });
  });
});
