import React from 'react';
import {shallow, mount} from 'enzyme';
import {Keys, Classes, TagInput} from '@blueprintjs/core';
import {act} from 'react-dom/test-utils';
import NumberProperty from '../../properties/number-property';
import * as Keywords from '../../keywords';
import DebouncedInput from '../../debounced-input';

/**
 * @TODO Add isSubtype tests as well
 **/
describe('Number property tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('Default tests', () => {
    const onChange = jest.fn();

    const getElement = (wrapper) => wrapper.find(Keywords.Default).first();

    it('Default change works', async () => {
      const wrapper = shallow(
        <NumberProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(getElement(wrapper).prop('value')).toBe('');
      expect(onChange).not.toHaveBeenCalled();

      getElement(wrapper).prop('onChange')('mmm');
      expect(onChange).toHaveBeenCalledWith({default: 'mmm'});
      expect(onChange).toHaveBeenCalledTimes(1);

      wrapper.setProps({data: {default: 'ppq'}});
      expect(getElement(wrapper).prop('value')).toBe('ppq');
    });
  });

  describe('Enums', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    const onChange = jest.fn();
    console.error = jest.fn();

    it('allows falsy enums', () => {
      const wrapper = mount(
        <NumberProperty
          isSubtype={false}
          onChange={onChange}
          data={{enum: []}}
        />,
      );

      const enumContainer = wrapper.find(Keywords.Enum).first();
      expect(console.error).toHaveBeenCalledTimes(0);

      expect(enumContainer.prop('value')).toEqual([]);
      expect(onChange).not.toHaveBeenCalled();

      expect(enumContainer.prop('value')).toEqual([]);
      enumContainer.prop('onChange')(['b']);
      expect(onChange).toHaveBeenCalledWith({enum: ['b']});
      expect(console.error).toHaveBeenCalledTimes(0);

      wrapper.setProps({data: {}});
      expect(enumContainer.prop('value')).toEqual([]);
      enumContainer.prop('onChange')(['b']);
      expect(onChange).toHaveBeenCalledWith({enum: ['b']});
      expect(console.error).toHaveBeenCalledTimes(0);

      const errorProp = () => wrapper.setProps({data: {enum: 'abc'}});
      expect(errorProp).toThrowError('values.some is not a function');
      expect(console.error).toHaveBeenCalledTimes(4);
    });

    it('appends a value to the container', () => {
      const wrapper = shallow(
        <NumberProperty
          isSubtype={false}
          onChange={onChange}
          data={{enum: ['a']}}
        />,
      );

      const enumContainer = wrapper.find(Keywords.Enum).first();
      expect(enumContainer.prop('value')).toEqual(['a']);
      enumContainer.prop('onChange')(['a', 'b']);
      expect(onChange).toHaveBeenCalledWith({enum: ['a', 'b']});
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Format', () => {
    const onChange = jest.fn();

    it('accepts blank format', () => {
      const wrapper = shallow(
        <NumberProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      const container = wrapper.find(Keywords.Format).first();
      expect(container.prop('value')).toBeUndefined();
      expect(onChange).toHaveBeenCalledTimes(0);

      container.prop('onChange')({target: {value: 'date'}});
      expect(onChange).toHaveBeenCalledWith({format: 'date'});
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('integrates with select', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <NumberProperty
          isSubtype={false}
          onChange={onChange}
          data={{format: 'date'}}
        />,
      );

      let container = wrapper.find(Keywords.Format).first();
      expect(container.find('select').prop('value')).toBe('date');

      wrapper.setProps({data: {format: 'some-invalid-props'}});
      container = wrapper.find(Keywords.Format).first();
      expect(container.prop('value')).toBe('some-invalid-props');
      expect(container.find('select').prop('value')).toBe('some-invalid-props');
    });
  });

  describe('Min and Max Length', () => {
    const onChange = jest.fn();

    beforeAll(() => {
      jest.resetAllMocks();
    });

    const minLenElement = (wrapper) => wrapper.find(Keywords.Minimum).first();
    const maxLenElement = (wrapper) => wrapper.find(Keywords.Maximum).first();

    it('accepts blank minimum', () => {
      const wrapper = shallow(
        <NumberProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(minLenElement(wrapper).prop('value')).toBeUndefined();
      expect(maxLenElement(wrapper).prop('value')).toBeUndefined();
      expect(onChange).toHaveBeenCalledTimes(0);

      minLenElement(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenCalledWith({minimum: 1});
      expect(onChange).toHaveBeenCalledTimes(1);

      maxLenElement(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenCalledWith({maximum: 1});
      expect(onChange).toHaveBeenCalledTimes(2);

      expect(minLenElement(wrapper).prop('exclusiveMinimum')).toBeUndefined();
      expect(maxLenElement(wrapper).prop('exclusiveMaximum')).toBeUndefined();

      wrapper.setProps({data: {exclusiveMinimum: true}});
      expect(minLenElement(wrapper).prop('exclusiveMinimum')).toBe(true);
      expect(maxLenElement(wrapper).prop('exclusiveMaximum')).toBeUndefined();

      wrapper.setProps({data: {exclusiveMaximum: true}});
      expect(minLenElement(wrapper).prop('exclusiveMinimum')).toBeUndefined();
      expect(maxLenElement(wrapper).prop('exclusiveMaximum')).toBe(true);

      onChange.mockClear();
      wrapper.setProps({data: {}});
      minLenElement(wrapper).prop('onToggle')({target: {checked: true}});
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({exclusiveMinimum: true});

      onChange.mockClear();
      wrapper.setProps({data: {}});
      maxLenElement(wrapper).prop('onToggle')({target: {checked: true}});
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({exclusiveMaximum: true});
    });

    it('works with valid integer values', () => {
      const onChange = jest.fn();
      const wrapper = mount(
        <NumberProperty
          isSubtype={false}
          onChange={onChange}
          data={{minimum: 3}}
        />,
      );

      expect(minLenElement(wrapper).prop('value')).toBe(3);

      wrapper.setProps({data: {minimum: 'abc'}});
      expect(minLenElement(wrapper).prop('value')).toBe('abc');

      wrapper.setProps({data: {minimum: -4}});
      expect(minLenElement(wrapper).prop('value')).toBe(-4);
      expect(maxLenElement(wrapper).prop('value')).toBeUndefined();

      wrapper.setProps({data: {maximum: 55}});
      expect(maxLenElement(wrapper).prop('value')).toBe(55);
      expect(minLenElement(wrapper).prop('value')).toBeUndefined();
    });
  });
});
