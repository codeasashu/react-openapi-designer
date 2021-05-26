import React from 'react';
import {shallow, mount} from 'enzyme';
import {Keys, Classes, Switch} from '@blueprintjs/core';
import {act} from 'react-dom/test-utils';
import ObjectProperty from '../../properties/object-property';
import * as Keywords from '../../keywords';
import DebouncedInput from '../../debounced-input';

describe('Object property tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('Additional properties tests', () => {
    const onChange = jest.fn();

    const getElement = (wrapper) =>
      wrapper.find(Keywords.DisallowAdditionalProperties).first();

    it('Default change works', async () => {
      const wrapper = shallow(
        <ObjectProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(getElement(wrapper).prop('value')).toBeUndefined();
      expect(onChange).not.toHaveBeenCalled();
      expect(getElement(wrapper).dive().find(Switch).prop('checked')).toBe(
        false,
      );

      wrapper.setProps({data: {additionalProperties: true}});
      expect(getElement(wrapper).prop('value')).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
      expect(getElement(wrapper).dive().find(Switch).prop('checked')).toBe(
        false,
      );

      wrapper.setProps({data: {additionalProperties: false}});
      expect(getElement(wrapper).prop('value')).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
      expect(getElement(wrapper).dive().find(Switch).prop('checked')).toBe(
        true,
      );
    });
  });

  describe('Behaviour tests', () => {
    beforeAll(() => {
      jest.resetAllMocks();
    });

    const onChange = jest.fn();
    //console.error = jest.fn();
    const getElement = (wrapper) =>
      wrapper.find(Keywords.ObjectBehaviour).first();

    it('sets correct behaviour', () => {
      const wrapper = shallow(
        <ObjectProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(getElement(wrapper).prop('value')).toBe('');

      wrapper.setProps({data: {readOnly: true}});
      expect(getElement(wrapper).prop('value')).toBe('readOnly');

      wrapper.setProps({data: {writeOnly: true}});
      expect(getElement(wrapper).prop('value')).toBe('writeOnly');

      getElement(wrapper).prop('onChange')({target: {value: 'readOnly'}});
      expect(onChange).toHaveBeenNthCalledWith(1, {readOnly: true});

      getElement(wrapper).prop('onChange')({target: {value: 'writeOnly'}});
      expect(onChange).toHaveBeenNthCalledWith(2, {writeOnly: true});

      getElement(wrapper).prop('onChange')({target: {value: 'abc'}});
      expect(onChange).toHaveBeenNthCalledWith(3, {});
    });
  });

  describe('Min and Max Properties', () => {
    const onChange = jest.fn();

    beforeAll(() => {
      jest.resetAllMocks();
    });

    const minProp = (wrapper) => wrapper.find(Keywords.MinProperty).first();
    const maxProp = (wrapper) => wrapper.find(Keywords.MaxProperty).first();

    it('accepts blank min property', () => {
      const wrapper = shallow(
        <ObjectProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(minProp(wrapper).prop('value')).toBeUndefined();
      expect(maxProp(wrapper).prop('value')).toBeUndefined();
      expect(onChange).toHaveBeenCalledTimes(0);

      minProp(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenNthCalledWith(1, {minProperties: 1});
      expect(onChange).toHaveBeenCalledTimes(1);

      maxProp(wrapper).prop('onChange')(1);
      expect(onChange).toHaveBeenNthCalledWith(2, {maxProperties: 1});
    });

    it('works with valid integer values', () => {
      const onChange = jest.fn();
      console.error = jest.fn();

      const wrapper = mount(
        <ObjectProperty
          isSubtype={false}
          onChange={onChange}
          data={{minProperties: 3}}
        />,
      );

      expect(minProp(wrapper).prop('value')).toBe(3);
      expect(console.error).not.toHaveBeenCalled();

      // We allow string values to minProperties with a console error
      wrapper.setProps({data: {minProperties: 'abc'}});
      expect(minProp(wrapper).prop('value')).toBe('abc');
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error.mock.calls[0][0]).toContain(
        'Warning: Failed prop type: Invalid prop `data.minProperties` of type `string` supplied to `ObjectProperty`',
      );
      console.error.mockReset();
      jest.resetAllMocks();

      wrapper.setProps({data: {minProperties: -4}});
      expect(minProp(wrapper).prop('value')).toBe(-4);
      expect(maxProp(wrapper).prop('value')).toBeUndefined();

      wrapper.setProps({data: {maxProperties: 55}});
      expect(minProp(wrapper).prop('value')).toBeUndefined();
      expect(maxProp(wrapper).prop('value')).toBe(55);
    });
  });
});
