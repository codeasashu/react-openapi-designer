import React from 'react';
import {Classes, Popover2, Tooltip2} from '@blueprintjs/popover2';
import {Button, TextArea} from '@blueprintjs/core';
import {mount, shallow} from 'enzyme';
import SchemaRow from '../schema-row';
import AdvancedProperties from '../advanced-properties';
import DropPlus from '../../ui/drop-plus';
import {act, render} from '../../../test-utils';

const objSchema = {type: 'object', properties: {type: 'string'}};

describe('SchemaRow tests', () => {
  const handleSidebar = jest.fn();
  const handleField = jest.fn();
  const handleChildField = jest.fn();
  const handleName = jest.fn();
  const handleSchemaType = jest.fn();
  const handleDescription = jest.fn();
  const handleAdditionalProperties = jest.fn();
  const handleDelete = jest.fn();
  const handleRequire = jest.fn();

  let dummyProps = {
    show: true,
    root: true,
    sidebar: {properties: {show: true}},
    schema: objSchema,
    handleName,
    handleField,
    handleChildField,
    handleSchemaType,
    handleSidebar,
    handleDescription,
    handleAdditionalProperties,
    handleDelete,
    handleRequire,
  };

  let wrapper;

  //const wrapper = shallow(<SchemaRow {...dummyProps} />);
  const getDropdownBtn = () =>
    wrapper.find(Button).filter('[aria-label="child dropdown"]');

  const getAddChildBtn = () => wrapper.find(DropPlus);
  const getAddRowBtn = () =>
    wrapper.find(Button).filter('[aria-label="add row"]');
  const getPaddedRow = () => wrapper.find('.row-container');
  const getDescriptionTooltip = () =>
    wrapper.find(Tooltip2).filter({role: 'description'});
  const getAdvancedPropTooltip = () =>
    wrapper.find(Tooltip2).filter({role: 'advanced properties'});
  const getDeleteRowBtn = () =>
    wrapper.find(Button).filter({role: 'delete row'});
  const getRequiredToggleBtn = (withinTooltip = true) => {
    if (withinTooltip == true) {
      return wrapper
        .find(Tooltip2)
        .filter({role: 'required field'})
        .find(Button);
    }
    return wrapper.find(Button).filter({role: 'required field'});
  };

  beforeEach(() => {
    wrapper = shallow(<SchemaRow {...dummyProps} />);
    //wrapper.setProps({...dummyProps});
  });

  it('sets default props', () => {
    expect(wrapper.prop('fieldPrefix')).toBeUndefined();
    expect(wrapper.prop('fieldName')).toBeUndefined();
    expect(wrapper.prop('required')).toBeUndefined();
    expect(wrapper.prop('parent')).toBeUndefined();
  });

  it('shows dropdown when show is set and schema is object', () => {
    let dropdownButton = getDropdownBtn().first();

    expect(dropdownButton.prop('icon')).toBe('chevron-down');
    dropdownButton.simulate('click');
    expect(handleSidebar).toHaveBeenNthCalledWith(1, {key: ['properties']});
    handleSidebar.mockClear();

    wrapper.setProps({sidebar: {properties: {show: false}}});
    dropdownButton = getDropdownBtn().first();
    expect(dropdownButton.prop('icon')).toBe('chevron-right');

    //Dropdown is not shown when schema is !object/array[!object]
    wrapper.setProps({schema: {type: 'string'}});
    dropdownButton = getDropdownBtn();
    expect(dropdownButton.exists()).toBe(false);

    wrapper.setProps({schema: {type: 'array', items: {type: 'string'}}});
    dropdownButton = getDropdownBtn();
    expect(dropdownButton.exists()).toBe(false);

    wrapper.setProps({schema: {type: 'object', properties: {type: 'string'}}});
    dropdownButton = getDropdownBtn();
    expect(dropdownButton.exists()).toBe(true);
  });

  it('shows add row or child when schema is object', () => {
    // Root element does not have child button, only add row button
    let childBtn = getAddChildBtn();
    expect(childBtn.exists()).toBe(false);

    let rowBtn = getAddRowBtn();
    expect(rowBtn.exists()).toBe(true);
    rowBtn.simulate('click');
    expect(handleField).toHaveBeenNthCalledWith(1, {
      key: dummyProps.fieldPrefix,
      value: dummyProps.fieldName,
    });
    handleField.mockClear();
    // Having a fieldName means this is not longer root elem,
    // this add child btn is shown
    wrapper.setProps({fieldName: 'abc'});
    childBtn = getAddChildBtn();
    expect(childBtn.exists()).toBe(true);
    childBtn.prop('handleAddChildField')();
    expect(handleChildField).toHaveBeenNthCalledWith(1, {
      key: ['abc', 'properties'],
    });
    handleChildField.mockClear();
    //Add row or child row buttons should not be present if schema!=object
    wrapper.setProps({schema: {type: 'string'}});
    childBtn = getAddChildBtn();
    rowBtn = getAddRowBtn();
    expect(childBtn.exists()).toBe(false);
    expect(rowBtn.exists()).toBe(false);
  });

  it('has correct padding for each row level', () => {
    let row = getPaddedRow();
    expect(row.props().style).toHaveProperty('paddingLeft', '0px');

    // We still have 50px padding for string schemas because
    // we dont show icons on the left (which we show for object schemas)
    // but we still want container to be aligned at same distance from left.
    // This 50px is the amount of space these icons occupy.
    wrapper.setProps({schema: {type: 'string'}});
    row = getPaddedRow();
    expect(row.props().style).toHaveProperty('paddingLeft', '50px');

    // calculation of padding goes like this:
    // Take the level of row (starts at 0). root row has level 0,
    // its child row has level 1 and so on.
    // padleft = 30 * level
    wrapper.setProps({schema: {type: 'object', properties: []}});
    // Adding child rows to objecy should have increased padding by 0+30px
    wrapper.setProps({fieldPrefix: ['properties']});
    row = getPaddedRow();
    expect(row.props().style).toHaveProperty('paddingLeft', '30px');

    wrapper.setProps({schema: {type: 'string'}});
    // Adding child rows to string should have increased padding by 50+30px
    wrapper.setProps({fieldPrefix: ['properties']});
    row = getPaddedRow();
    expect(row.props().style).toHaveProperty('paddingLeft', '80px');

    wrapper.setProps({fieldPrefix: ['properties', 'abc', 'properties']});
    row = getPaddedRow();
    expect(row.props().style).toHaveProperty('paddingLeft', '110px');
  });

  it('renders name field', () => {
    // "name" field does not show on root nodes
    wrapper.setProps({fieldName: 'abc', root: true});
    let nameField = wrapper.find('DebouncedInput');
    expect(nameField.exists()).toBe(false);

    // It only shows in child nodes
    wrapper.setProps({fieldName: 'abc', root: false});
    nameField = wrapper.find('DebouncedInput');
    expect(nameField.props().value).toBe('abc');
    nameField.prop('onChange')('def');
    expect(handleName).toHaveBeenNthCalledWith(1, {
      key: undefined,
      name: 'abc',
      value: 'def',
    });
  });

  it('renders schema dropdown', () => {
    // "name" field does not show on root nodes
    let dropdownField = wrapper.find('SchemaDropdown');
    expect(dropdownField.props().schema).toStrictEqual({
      type: 'object',
      properties: {
        type: 'string',
      },
    });

    wrapper.setProps({schema: {type: 'string'}});
    dropdownField = wrapper.find('SchemaDropdown');
    expect(dropdownField.props().schema).toStrictEqual({type: 'string'});

    expect(wrapper.find('SchemaItemEntity').props().type).toBe('string');
    expect(wrapper.find('SchemaItemEntity').props().text).toBe('string');

    // For array, schemaitem text is different
    wrapper.setProps({schema: {type: 'array', items: {type: 'string'}}});
    expect(wrapper.find('SchemaItemEntity').props().type).toBe('array');
    expect(wrapper.find('SchemaItemEntity').props().text).toBe(
      'array [string]',
    );

    dropdownField.prop('handleOnClick')('abc');
    expect(handleSchemaType).toHaveBeenNthCalledWith(1, {
      key: ['type'],
      value: 'abc',
    });
  });

  it('renders description', async () => {
    wrapper = shallow(<SchemaRow {...dummyProps} />);
    let description = getDescriptionTooltip();
    expect(description.props().content).toEqual(<span>Description</span>);
    // By default, it shows blank description
    wrapper = mount(<SchemaRow {...dummyProps} />);
    description = getDescriptionTooltip();
    await act(async () => {
      description.find(Button).simulate('click');
    });

    wrapper.update();
    let descriptionBox = wrapper
      .find(TextArea)
      .filter({'aria-label': 'description'})
      .first();
    expect(descriptionBox.props().value).toBe('');

    let newProps = {
      ...dummyProps,
      schema: {type: 'string', description: 'abc'},
    };
    wrapper = mount(<SchemaRow {...newProps} />);
    description = getDescriptionTooltip();
    await act(async () => {
      description.find(Button).simulate('click');
    });

    wrapper.update();
    descriptionBox = wrapper
      .find(TextArea)
      .filter({'aria-label': 'description'})
      .first();
    expect(descriptionBox.props().value).toBe('abc');

    // Changing description should trigger
    descriptionBox.simulate('change', {target: {value: 'def'}});
    expect(handleDescription).toHaveBeenNthCalledWith(1, {
      key: ['description'],
      value: 'def',
    });
    handleDescription.mockClear();
  });

  it('renders advanced properties', async () => {
    wrapper = shallow(<SchemaRow {...dummyProps} />);
    let advancedPropTooltip = getAdvancedPropTooltip();
    expect(advancedPropTooltip.props().content).toEqual(
      <span>Advanced Settings</span>,
    );
    // By default, it shows blank description
    wrapper = mount(<SchemaRow {...dummyProps} />);
    advancedPropTooltip = getAdvancedPropTooltip();
    await act(async () => {
      advancedPropTooltip.find(Button).simulate('click');
    });

    wrapper.update();
    let advancedPropComponent = wrapper.find(AdvancedProperties).first();
    expect(advancedPropComponent.props().data).toBe(
      JSON.stringify(dummyProps.schema, null, 2),
    );

    let newProps = {
      ...dummyProps,
      schema: {type: 'string', description: 'abc'},
    };
    wrapper = mount(<SchemaRow {...newProps} />);
    advancedPropTooltip = getAdvancedPropTooltip();
    await act(async () => {
      advancedPropTooltip.find(Button).simulate('click');
    });

    wrapper.update();
    advancedPropComponent = wrapper.find(AdvancedProperties).first();

    expect(advancedPropComponent.props().data).toBe(
      JSON.stringify(newProps.schema, null, 2),
    );

    // Changing description should trigger
    advancedPropComponent.prop('onChange')('abc');
    expect(handleAdditionalProperties).toHaveBeenNthCalledWith(1, {
      key: [],
      value: 'abc',
    });
    handleAdditionalProperties.mockClear();
  });

  it('renders delete row button', () => {
    let deleteRowBtn = getDeleteRowBtn();
    expect(deleteRowBtn.exists()).toBe(false);

    wrapper.setProps({fieldName: 'abc'});
    deleteRowBtn = getDeleteRowBtn();
    expect(deleteRowBtn.props().icon).toBe('cross');

    deleteRowBtn.simulate('click');
    expect(handleDelete).toHaveBeenNthCalledWith(1, {key: ['abc']});
  });

  it('renders required row button', () => {
    let requiredBtn = getRequiredToggleBtn();
    expect(requiredBtn.exists()).toBe(false);

    // Since this is still the root node, required is disabled
    wrapper.setProps({fieldName: 'abc'});
    requiredBtn = getRequiredToggleBtn(false);
    expect(requiredBtn.props().icon).toBe('issue');
    expect(requiredBtn.props().disabled).toBe(true);

    // Now it is no longer the root node
    wrapper.setProps({fieldName: 'abc', root: false});
    requiredBtn = getRequiredToggleBtn();
    expect(requiredBtn.props().icon).toBe('issue');
    expect(requiredBtn.props().disabled).toBeUndefined();
    requiredBtn.simulate('click');
    expect(handleRequire).toHaveBeenNthCalledWith(1, {
      key: undefined,
      value: 'abc',
      required: true,
    });

    wrapper.setProps({required: true});
    requiredBtn.simulate('click');
    expect(handleRequire).toHaveBeenNthCalledWith(2, {
      key: undefined,
      value: 'abc',
      required: false,
    });

    handleRequire.mockClear();
  });
});
