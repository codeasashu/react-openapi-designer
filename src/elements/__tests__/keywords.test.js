import React from 'react';
import {shallow, mount} from 'enzyme';
import {TagInput, Switch} from '@blueprintjs/core';
import {act} from 'react-dom/test-utils';
import * as Keywords from '../keywords';

describe('Keyword tests', () => {
  it('is setting values to enum tags', async () => {
    const onChange = jest.fn();
    const wrapper = mount(<Keywords.Enum value={['a']} onChange={onChange} />);

    wrapper.find(TagInput).first().prop('onChange')(['a', 'b']);
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('is setting correct value for default', () => {
    const onChange = jest.fn();
    console.error = jest.fn();

    const wrapper = shallow(
      <Keywords.Default value={'a'} onChange={onChange} />,
    );
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('a');
    expect(console.error).not.toHaveBeenCalled();

    wrapper.setProps({value: 1});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(1);
    expect(console.error).not.toHaveBeenCalled();

    wrapper.setProps({value: {}});
    expect(wrapper.find('DebouncedInput').prop('value')).toEqual({});
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error.mock.calls[0][0]).toContain(
      'Failed prop type: Invalid prop `value` supplied to `Default`',
    );
    expect(console.error.mock.calls[1][0]).toContain(
      'Warning: Failed prop type: Invalid prop `value` supplied to `DebouncedInput`.',
    );

    console.error.mockClear();
    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toEqual(undefined);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('is Working with BoolDefault', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.BoolDefault value={'true'} onChange={onChange} />,
    );
    expect(wrapper.find('select').prop('value')).toBe('true');

    wrapper.setProps({value: true});
    expect(wrapper.find('select').prop('value')).toBe(true);

    wrapper.setProps({value: false});
    expect(wrapper.find('select').prop('value')).toBe(false);

    wrapper.setProps({value: 'ash'});
    expect(wrapper.find('select').prop('value')).toBe('ash');
  });

  it('is working with Format', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.Format value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('select').prop('value')).toBe('date');
    const StringFormats = [
      'date-time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
    ];

    const NumberFormats = ['float', 'double'];
    expect(
      wrapper
        .find('select')
        .children()
        .map((n) => n.text()),
    ).toEqual(['None', ...StringFormats]);

    wrapper.setProps({format: 'number'});
    expect(
      wrapper
        .find('select')
        .children()
        .map((n) => n.text()),
    ).toEqual(['None', ...NumberFormats]);

    // By default, only string formats are rendered
    wrapper.setProps({format: undefined});
    expect(
      wrapper
        .find('select')
        .children()
        .map((n) => n.text()),
    ).toEqual(['None', ...StringFormats]);
  });

  it('is working with Pattern', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.Pattern value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MinLength', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MinLength value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe(
      'min.length',
    );
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MaxLength', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MaxLength value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe(
      'max.length',
    );
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with Minimum', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.Minimum value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('minimum');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({exclusiveMinimum: true});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({exclusiveMinimum: '1'});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({exclusiveMinimum: false});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({exclusiveMinimum: undefined});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with Maximum', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.Maximum value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('maximum');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({exclusiveMaximum: true});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({exclusiveMaximum: '1'});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({exclusiveMaximum: false});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({exclusiveMaximum: undefined});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MultipleOf', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MultipleOf value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('>=0');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with UniqueItems', () => {
    const onToggle = jest.fn();

    const wrapper = shallow(
      <Keywords.UniqueItems value={false} onToggle={onToggle} />,
    );

    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: undefined});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: true});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({value: '1'});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({value: false});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: ''});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.find(Switch).prop('onChange')('abc');
    expect(onToggle).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MinItems', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MinItems value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('>=0');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MaxItems', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MaxItems value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('>=0');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(undefined);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('');

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with DisallowAdditionalProperties', () => {
    const onToggle = jest.fn();

    const wrapper = shallow(
      <Keywords.DisallowAdditionalProperties
        value={false}
        onToggle={onToggle}
      />,
    );

    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({value: undefined});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: true});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: '1'});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.setProps({value: false});
    expect(wrapper.find(Switch).prop('checked')).toBe(true);

    wrapper.setProps({value: ''});
    expect(wrapper.find(Switch).prop('checked')).toBe(false);

    wrapper.find(Switch).prop('onChange')('abc');
    expect(onToggle).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with ObjectBehaviour', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.ObjectBehaviour value={'true'} onChange={onChange} />,
    );
    expect(wrapper.find('select').prop('value')).toBe('true');

    wrapper.setProps({value: true});
    expect(wrapper.find('select').prop('value')).toBe(true);

    wrapper.setProps({value: false});
    expect(wrapper.find('select').prop('value')).toBe(false);

    wrapper.setProps({value: 'ash'});
    expect(wrapper.find('select').prop('value')).toBe('ash');

    wrapper.find('select').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MinProperty', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MinProperty value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('>=0');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(0);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(0);

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });

  it('is working with MaxProperty', () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <Keywords.MaxProperty value={'date'} onChange={onChange} />,
    );

    expect(wrapper.find('DebouncedInput').prop('large')).toBe(true);
    expect(wrapper.find('DebouncedInput').prop('placeholder')).toBe('>=0');
    expect(wrapper.find('DebouncedInput').prop('value')).toBe('date');

    wrapper.setProps({value: undefined});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(0);

    wrapper.setProps({value: ''});
    expect(wrapper.find('DebouncedInput').prop('value')).toBe(0);

    wrapper.find('DebouncedInput').prop('onChange')('abc');
    expect(onChange).toHaveBeenNthCalledWith(1, 'abc');
  });
});
