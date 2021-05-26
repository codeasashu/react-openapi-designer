import React from 'react';
import SchemaSelectors from '../../elements/schema-selectors';
import {Popover2, Classes, Tooltip2} from '@blueprintjs/popover2';
import {Overlay} from '@blueprintjs/core';
//import {render, screen, fireEvent} from '@testing-library/react';
import {
  prettyDOM,
  schemaStoreObject,
  act,
  render,
  screen,
  fireEvent,
  within,
} from '../../../test-utils';
import {shallow, mount} from 'enzyme';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import Schema from '../schema';
import SchemaRow from '../../elements/schema-row';

//beforeEach(() => {
//jest.resetModules();
//});

it('renders schema as object when empty schema passed', () => {
  const handleChange = jest.fn();

  render(<Schema onChange={handleChange} />, {initialState: {}});

  let rows = screen.getAllByRole(/schema-row/i);
  expect(rows).toHaveLength(1); // Root row is always visible
  let schemaContainer = within(rows[0]).getByRole('row-schema');
  expect(schemaContainer).toHaveTextContent('object');
  let addRowBtns = within(rows[0]).getAllByLabelText(/add row/i);
  fireEvent.click(addRowBtns[0]);
  rows = screen.getAllByRole(/schema-row/i);
  expect(rows).toHaveLength(2);

  // Following assertions are on child rows added by clicking add-row btn
  addRowBtns = within(rows[1]).queryAllByLabelText(/add row/i);
  // Since added row is of schema string, it does not have any add row button
  expect(addRowBtns).toHaveLength(0);
  // Assert the schema is of type string
  schemaContainer = within(rows[1]).getByRole('row-schema');
  expect(schemaContainer).toHaveTextContent('string');
});

const MockSchemaDropdown = ({
  children,
  schema,
  handleOnClick,
  usePortal,
  ...props
}) => {
  return (
    <Popover2
      {...props}
      transitionDuration={0}
      hoverOpenDelay={0}
      hoverCloseDelay={0}
      content={<SchemaSelectors schema={schema} onClick={handleOnClick} />}
      usePortal={false}>
      {children}
    </Popover2>
  );
};

jest.mock('../../elements/schema-dropdown', () => ({
  __esModule: true,
  default: (props) => <MockSchemaDropdown {...props} />,
}));

it('renders string schema when string schema passed', async () => {
  const mockStore = configureStore(schemaStoreObject);
  const handleChange = jest.fn();
  // there should be no add-row button
  const wrapper = mount(
    <Provider store={mockStore}>
      <Schema initschema={{type: 'string'}} onChange={handleChange} />,
    </Provider>,
  );
  const row = wrapper.find(SchemaRow);
  expect(row).toHaveLength(1);
  expect(handleChange).toHaveBeenCalledWith({
    examples: {},
    title: '',
    type: 'string',
  });
  const addRowBtn = row.find({icon: 'plus'}).filter('[aria-label="add row"]');
  expect(addRowBtn).toHaveLength(0);
  const popoverWrapper = row.find('MockSchemaDropdown');
  let targetNode = popoverWrapper.find(`.${Classes.POPOVER2_TARGET}`);
  await act(async () => {
    targetNode.simulate('click');
  });
  wrapper.update();
  expect(targetNode.getDOMNode()).toHaveClass(Classes.POPOVER2_OPEN);
  const contentNode = wrapper.find(`.${Classes.POPOVER2_CONTENT}`);
  contentNode.find('.schema-object').simulate('click');
  expect(handleChange).toHaveBeenCalledWith({
    examples: {},
    properties: {},
    required: [],
    title: '',
    type: 'object',
  });
});

it('Changes schema inside row', () => {
  const handleChange = jest.fn();

  render(<Schema schema={{type: 'string'}} onChange={handleChange} />, {
    initialState: {user: 'Redux User'},
  });

  let rows = screen.getAllByRole(/schema-row/i);
  expect(rows).toHaveLength(1); // Root row is always visible
  let addRowBtns = within(rows[0]).getAllByLabelText(/add row/i);
  fireEvent.click(addRowBtns[0]);
  rows = screen.getAllByRole(/schema-row/i);
  expect(rows).toHaveLength(2);
});