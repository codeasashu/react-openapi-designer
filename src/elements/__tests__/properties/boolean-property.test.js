import React from 'react';
import {shallow} from 'enzyme';
import BooleanProperty from '../../properties/boolean-property';
import * as Keywords from '../../keywords';

/**
 * @TODO Add isSubtype tests as well
 **/
describe('Boolean property tests', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('Default tests', () => {
    const onChange = jest.fn();

    const getElement = (wrapper) => wrapper.find(Keywords.BoolDefault).first();

    it('Default change works', async () => {
      const wrapper = shallow(
        <BooleanProperty isSubtype={false} onChange={onChange} data={{}} />,
      );

      expect(getElement(wrapper).prop('value')).toBe('');
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {default: false}});
      expect(getElement(wrapper).prop('value')).toBe('false');
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {default: 'false'}});
      expect(getElement(wrapper).prop('value')).toBe('true');
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {default: true}});
      expect(getElement(wrapper).prop('value')).toBe('true');
      expect(onChange).not.toHaveBeenCalled();

      wrapper.setProps({data: {default: undefined}});
      expect(getElement(wrapper).prop('value')).toBe('');
      expect(onChange).not.toHaveBeenCalled();

      getElement(wrapper).prop('onChange')({target: {value: 'true'}});
      expect(onChange).toHaveBeenNthCalledWith(1, {default: true});
      onChange.mockClear();

      getElement(wrapper).prop('onChange')({target: {value: 'false'}});
      expect(onChange).toHaveBeenNthCalledWith(1, {default: false});
      onChange.mockClear();
    });
  });
});