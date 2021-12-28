import userEvent from '@testing-library/user-event';
import React from 'react';
import {render, screen, StoreCreator, within} from '../../../../../test-utils';
import Schema from '../../oasSchema';

describe('Schema editor tests', () => {
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

  describe('schema tests', () => {
    it('renders default object schema', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      const {activeNode} = stores.uiStore;
      render(<Schema relativeJsonPath={activeNode.relativeJsonPath} />, {
        providerProps: {value: stores},
      });
      expect(screen.queryAllByRole(/schema-row/).length).toBe(1);
      expect(screen.getByRole(/schema-row/)).toHaveTextContent(/object/);
      asserts.oas(activeNode.relativeJsonPath).toStrictEqual({
        properties: {},
        title: 'AbcdModel',
        type: 'object',
      });
    });

    it('can add more fields to object', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      const {activeNode} = stores.uiStore;
      render(<Schema relativeJsonPath={activeNode.relativeJsonPath} />, {
        providerProps: {value: stores},
      });
      // Add some fields to object
      const addRowBtn = screen
        .getByRole(/schema-row/)
        .querySelector('.bp3-icon.bp3-icon-plus');
      userEvent.click(addRowBtn);
      expect(screen.queryAllByRole(/schema-row/).length).toBe(2);
      expect(screen.getAllByRole(/schema-row/)[1]).toHaveTextContent(/field_1/);
      asserts.oas(activeNode.relativeJsonPath).toStrictEqual({
        properties: {
          field_1: {
            type: 'string',
          },
        },
        title: 'AbcdModel',
        type: 'object',
        required: ['field_1'],
      });
    });
  });
});
