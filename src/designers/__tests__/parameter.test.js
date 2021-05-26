import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Parameter from '../parameter';

it('Renders the parameter with string schema', () => {
  const handleChange = jest.fn();
  render(
    <Parameter
      name="abc"
      titlePlaceholder="header0"
      schema={{type: 'string'}}
      onChange={handleChange}
      onDelete={(e) => console.log('ondelete', e)}
    />,
  );

  const parameterName = screen.getByPlaceholderText(/header0/i);

  expect(parameterName).toBeInTheDocument();
  fireEvent.change(parameterName, {target: {value: 'a'}});
  expect(handleChange).toHaveBeenCalledTimes(0);
  // Changes on name are only propogated on blur event
  fireEvent.blur(parameterName);
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith({
    description: '',
    name: 'a',
    required: false,
    schema: {type: 'string'},
  });

  const selector = screen.getByRole('combobox');
  expect(selector).toBeInTheDocument();
  expect(selector).toHaveValue('string');
});

it('Renders the parameter with integer schema', () => {
  const handleChange = jest.fn();
  render(
    <Parameter
      name="abc"
      titlePlaceholder="header0"
      schema={{type: 'integer'}}
      onChange={handleChange}
      onDelete={(e) => console.log('ondelete', e)}
    />,
  );

  const parameterName = screen.getByPlaceholderText(/header0/i);

  expect(parameterName).toBeInTheDocument();
  fireEvent.change(parameterName, {target: {value: 'a'}});
  fireEvent.blur(parameterName);
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith({
    description: '',
    name: 'a',
    required: false,
    schema: {type: 'integer'},
  });
});

it('Renders the parameter with schema selected', () => {
  const handleChange = jest.fn();
  render(
    <Parameter
      name="abc"
      titlePlaceholder="header0"
      schema={{type: 'integer'}}
      onChange={handleChange}
      onDelete={(e) => console.log('ondelete', e)}
    />,
  );

  const selector = screen.getByRole('combobox');
  expect(selector).toBeInTheDocument();
  expect(selector).toHaveValue('integer');
  fireEvent.change(selector, {target: {value: 'boolean'}});
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith({
    description: '',
    name: 'abc',
    required: false,
    schema: {type: 'boolean'},
  });
});

it('Renders the parameter with description', () => {
  const handleChange = jest.fn();
  render(
    <Parameter
      name="abc"
      titlePlaceholder="header0"
      description="xyz"
      schema={{type: 'integer'}}
      onChange={handleChange}
      onDelete={(e) => console.log('ondelete', e)}
    />,
  );

  const descriptionBox = screen.getByPlaceholderText('Description');
  expect(descriptionBox).toBeInTheDocument();
  expect(descriptionBox).toHaveValue('xyz');
  fireEvent.change(descriptionBox, {target: {value: 'def'}});
  expect(handleChange).toHaveBeenCalledTimes(0);
  // Changes on description are only propogated on blur event
  fireEvent.blur(descriptionBox);
  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledWith({
    description: 'def',
    name: 'abc',
    required: false,
    schema: {type: 'integer'},
  });
});

it('Renders with empty name on empty name prop', () => {
  const handleChange = jest.fn();
  const handleDelete = jest.fn();

  render(
    <Parameter
      name=""
      titlePlaceholder="header0"
      schema={{type: 'integer'}}
      onChange={handleChange}
      onDelete={handleDelete}
    />,
  );

  const selector = screen.getByLabelText(/name/i);
  expect(selector).toBeInTheDocument();
  expect(selector).toHaveValue('');
  expect(selector).toHaveProperty('placeholder');
  expect(handleChange).toHaveBeenCalledTimes(0);
});

it('Triggers delete onDelete', () => {
  const handleChange = jest.fn();
  const handleDelete = jest.fn();

  render(
    <Parameter
      name="abc"
      titlePlaceholder="header0"
      schema={{type: 'integer'}}
      onChange={handleChange}
      onDelete={handleDelete}
    />,
  );

  const selector = screen.getByRole('button', {name: /delete/i});
  expect(selector).toBeInTheDocument();
  fireEvent.click(selector);
  expect(handleDelete).toHaveBeenCalledTimes(1);
  expect(handleChange).toHaveBeenCalledTimes(0);
});
