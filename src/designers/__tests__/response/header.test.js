import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Headers from '../../response/headers';

it('renders header parameters', () => {
  const changeHandler = jest.fn();
  let headers = {
    'header-0': {
      schema: {type: 'string'},
      description: 'Header 0 description',
    },
    'header-1': {
      schema: {type: 'string'},
      description: 'Header 1 description',
    },
  };

  render(<Headers parameters={headers} onChange={changeHandler} />);

  // Both header keys are rendered
  const names = screen.getAllByLabelText(/name/i);
  expect(names[0]).toHaveValue('header-0');
  expect(names[1]).toHaveValue('header-1');

  const schemas = screen.getAllByRole('combobox');
  expect(schemas[0]).toHaveValue('string');
  expect(schemas[1]).toHaveValue('string');

  const descriptions = screen.getAllByPlaceholderText('Description');
  expect(descriptions[0]).toHaveValue('Header 0 description');
  expect(descriptions[1]).toHaveValue('Header 1 description');

  // Change happens on changing schema
  expect(changeHandler).toHaveBeenCalledTimes(0);
  fireEvent.change(schemas[0], {target: {value: 'boolean'}});
  expect(changeHandler).toHaveBeenCalledTimes(1);
  expect(changeHandler).toHaveBeenCalledWith({
    'header-0': {
      description: 'Header 0 description',
      schema: {type: 'boolean'}, // Changed schema reflected
    },
    'header-1': {
      description: 'Header 1 description',
      schema: {type: 'string'},
    },
  });
});

it('Adds a param row on add row button click', () => {
  const changeHandler = jest.fn();

  let headers = {
    'header-0': {
      schema: {type: 'string'},
      description: 'Header 0 description',
    },
    'header-1': {
      schema: {type: 'string'},
      description: 'Header 1 description',
    },
  };
  render(<Headers parameters={headers} onChange={changeHandler} />);

  const addRowBtn = screen.getByRole('button', {name: /add row/i});
  fireEvent.click(addRowBtn);

  const schemas = screen.getAllByRole('combobox');
  expect(schemas).toHaveLength(3);
  expect(schemas[2]).toHaveValue('string');

  const names = screen.getAllByLabelText(/name/i);
  expect(names[0]).toHaveValue('header-0');
  expect(names[1]).toHaveValue('header-1');
  expect(names[2]).toHaveValue('header-2');

  const descriptions = screen.getAllByPlaceholderText('Description');
  expect(descriptions[2]).toHaveValue('');

  fireEvent.change(names[1], {target: {value: 'pptest'}});
  fireEvent.blur(names[1]);

  expect(changeHandler).toHaveBeenCalledWith({
    'header-0': {
      description: 'Header 0 description',
      schema: {type: 'string'}, // Changed schema reflected
    },
    pptest: {
      description: 'Header 1 description',
      schema: {type: 'string'},
    },
    'header-2': {
      schema: {type: 'string'},
    },
  });

  fireEvent.click(addRowBtn);
  const names2 = screen.getAllByLabelText(/name/i);
  expect(names2[0]).toHaveValue('header-0');
  expect(names2[1]).toHaveValue('pptest');
  expect(names2[2]).toHaveValue('header-2');
  expect(names2[3]).toHaveValue('header-3');
});

it('Empty parameters are allowed', () => {
  const changeHandler = jest.fn();

  render(<Headers onChange={changeHandler} />);

  const schemas = screen.queryAllByRole('combobox');
  expect(schemas).toHaveLength(0);

  const addRowBtn = screen.getByRole('button', {name: /add row/i});
  fireEvent.click(addRowBtn);

  const schemas2 = screen.queryAllByRole('combobox');
  expect(schemas2).toHaveLength(1);
});

it('Deletes header on delete button press', () => {
  const changeHandler = jest.fn();

  let headers = {
    'header-0': {
      schema: {type: 'string'},
      description: 'Header 0 description',
    },
    'header-1': {
      schema: {type: 'string'},
      description: 'Header 1 description',
    },
  };
  render(<Headers parameters={headers} onChange={changeHandler} />);

  const deleteBtn = screen.getAllByRole('button', {name: /delete/i});
  fireEvent.click(deleteBtn[0]); // Should delete header-0

  expect(changeHandler).toHaveBeenNthCalledWith(1, {
    'header-1': {
      schema: {type: 'string'},
      description: 'Header 1 description',
    },
  });
});
