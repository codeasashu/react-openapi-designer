import React from 'react';
import {shallow, mount} from 'enzyme';
import {TagInput, Switch} from '@blueprintjs/core';
import {act} from 'react-dom/test-utils';
import * as Keywords from '../keywords';
import Properties from '../properties';
import AdvancedProperties from '../advanced-properties';

describe('AdvancedProperties tests', () => {
  it('is string property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'string',
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    expect(wrapper.find(Properties.String).first().prop('data')).toEqual(input);
    expect(wrapper.find(Properties.String).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.String).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });

  it('is number property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'number',
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    expect(wrapper.find(Properties.Number).first().prop('data')).toEqual(input);
    expect(wrapper.find(Properties.Number).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.Number).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });

  it('is boolen property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'boolean',
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    expect(wrapper.find(Properties.Boolean).first().prop('data')).toEqual(
      input,
    );

    expect(wrapper.find(Properties.Boolean).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.Boolean).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });

  it('is integer property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'integer',
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    expect(wrapper.find(Properties.Number).first().prop('data')).toEqual(input);
    expect(wrapper.find(Properties.Number).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.Number).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });

  it('is object property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'object',
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    expect(wrapper.find(Properties.Object).first().prop('data')).toEqual(input);
    expect(wrapper.find(Properties.Object).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.Object).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });

  it('is array property', async () => {
    const onChange = jest.fn();
    const input = {
      type: 'array',
      items: {
        type: 'string',
      },
    };
    const wrapper = shallow(
      <AdvancedProperties data={JSON.stringify(input)} onChange={onChange} />,
    );

    const child = (
      <Properties.String
        data={{type: 'string'}}
        isSubtype={true}
        onChange={(e) => {}}
      />
    );

    const childElement = wrapper.find(Properties.Array).first().prop('child');
    expect(wrapper.find(Properties.Array).first().prop('data')).toEqual(input);
    expect(JSON.parse(JSON.stringify(childElement))).toEqual(
      JSON.parse(JSON.stringify(child)),
    );
    expect(wrapper.find(Properties.Array).first().prop('isSubtype')).toBe(
      false,
    );
    wrapper.find(Properties.Array).first().prop('onChange')('a');
    expect(onChange).toHaveBeenNthCalledWith(1, 'a');
  });
});
