import {prettyDOM} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {render, screen, StoreCreator, within} from '../../../../../test-utils';
import Schema from '../../oasSchema';

describe('Schema examples tests', () => {
  const getTabs = () => {
    return within(
      document.querySelector('.json-schema-react-editor'),
    ).getAllByRole('tab');
  };
  const getExampleTextarea = (name) => {
    return screen.getByRole(/tabpanel/, {name}).querySelector('textarea');
  };

  const getExampleInput = (name) => {
    return screen.getByRole(/tabpanel/, {name}).querySelector('input');
  };

  const formatExampleJson = (expected) => {
    return JSON.stringify(expected, null, 4);
  };

  const assertTabLength = (expected) => {
    const tabs = getTabs();
    expect(tabs.length).toBe(expected);
  };

  const assertSchemRowsLength = (expected) => {
    expect(screen.queryAllByRole(/schema-row/).length).toBe(expected);
  };

  const getAddRowBtn = () => {
    return screen
      .getByRole(/schema-row/)
      .querySelector('.bp3-icon.bp3-icon-plus');
  };

  const getAddExampleBtn = () => {
    return within(screen.getByRole(/tablist/)).queryByRole(/button/);
  };

  const getJsonPath = (relativeJsonPath, mediaType = 'application/json') => {
    const jsonPath = relativeJsonPath.concat(['content', mediaType]);
    return {
      schemaPath: jsonPath.concat('schema'),
      examplesPath: jsonPath.concat('examples'),
    };
  };

  it('adds examples to response', () => {
    const {stores, creator, asserts} = StoreCreator();
    const response = creator.createResponse('Resp1');
    stores.uiStore.setActiveNode(response);
    const {activeNode} = stores.uiStore;
    const {schemaPath, examplesPath} = getJsonPath(activeNode.relativeJsonPath);
    render(<Schema relativeJsonPath={schemaPath} />, {
      providerProps: {value: stores},
    });

    assertSchemRowsLength(1);
    assertTabLength(1);
    // Add some fields to object
    userEvent.click(getAddRowBtn());

    assertSchemRowsLength(2);
    // Click add example
    userEvent.click(getAddExampleBtn());
    assertTabLength(2);

    asserts.oas(examplesPath).toStrictEqual({
      'example-1': {
        value: {
          field_1: 'string',
        },
      },
    });
    asserts.oas(schemaPath).toStrictEqual({
      properties: {
        field_1: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['field_1'],
    });

    const tabs = getTabs();
    userEvent.click(within(tabs[1]).getByText('example-1'));
    expect(getExampleTextarea('example-1')).toHaveValue(
      formatExampleJson({field_1: 'string'}),
    );
    expect(getExampleInput('example-1')).toHaveValue('example-1');
  });

  it('can change name of examples', () => {
    const {stores, creator, asserts} = StoreCreator();
    const response = creator.createResponse('Resp1');
    stores.uiStore.setActiveNode(response);
    const {activeNode} = stores.uiStore;
    const {schemaPath, examplesPath} = getJsonPath(activeNode.relativeJsonPath);
    render(<Schema relativeJsonPath={schemaPath} />, {
      providerProps: {value: stores},
    });

    // Add field to schema
    userEvent.click(getAddRowBtn());
    // Generate example
    userEvent.click(getAddExampleBtn());
    const tabs = getTabs();
    userEvent.click(within(tabs[1]).getByText('example-1'));
    userEvent.type(
      getExampleInput('example-1'),
      '{selectall}{backspace}example-4',
    );
    userEvent.tab();
    expect(getExampleInput('example-4')).toHaveValue('example-4');
    asserts.oas(examplesPath).toStrictEqual({
      'example-4': {
        value: {
          field_1: 'string',
        },
      },
    });
    asserts.oas(schemaPath).toStrictEqual({
      properties: {
        field_1: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['field_1'],
    });
  });

  it('can change contents of examples', () => {
    const {stores, creator, asserts} = StoreCreator();
    const response = creator.createResponse('Resp1');
    stores.uiStore.setActiveNode(response);
    const {activeNode} = stores.uiStore;
    const {schemaPath, examplesPath} = getJsonPath(activeNode.relativeJsonPath);
    render(<Schema relativeJsonPath={schemaPath} />, {
      providerProps: {value: stores},
    });

    // Add field to schema
    userEvent.click(getAddRowBtn());
    // Generate example
    userEvent.click(getAddExampleBtn());
    const tabs = getTabs();
    userEvent.click(within(tabs[1]).getByText('example-1'));
    userEvent.clear(getExampleTextarea('example-1'));
    userEvent.type(
      getExampleTextarea('example-1'),
      '{"a": "b"}'.replace(/[{[]/g, '$&$&'),
    );
    // below line is only a hacky way to shift focus from textarea to trigger
    // blur event from it
    userEvent.click(getExampleInput('example-1'));
    expect(getExampleInput('example-1')).toHaveValue('example-1');
    asserts.oas(examplesPath).toStrictEqual({
      'example-1': {
        value: {
          a: 'b',
        },
      },
    });
    asserts.oas(schemaPath).toStrictEqual({
      properties: {
        field_1: {
          type: 'string',
        },
      },
      type: 'object',
      required: ['field_1'],
    });
  });
});
