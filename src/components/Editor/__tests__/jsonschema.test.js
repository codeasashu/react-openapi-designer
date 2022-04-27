import { prettyDOM } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {fireEvent, render, screen, StoreCreator, within, act} from '../../../../test-utils';
// import {prettyDOM} from '@testing-library/dom';
import SchemaDesigner from '../JsonSchema';

describe('Schema editor tests', () => {

  const getTreeRow = (level=null, container=document) => {
    const treeList = container.getElementsByClassName('TreeList')
    if(treeList.length <= 0) {
      return null;
    }
    if(level === null) {
      return within(treeList[0]).getAllByTestId(/tree-row-/);
    }
    const childRowIdentifier = (level === -1) ? '[]' : `["children",${level}]`;
    return within(treeList[0]).getByTestId(`tree-row-${childRowIdentifier}`);
  };

  describe('schema tests', () => {
    it('renders default object schema', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      const {activeNode} = stores.uiStore;
      render(<SchemaDesigner
        schemaPath={activeNode.relativeJsonPath}
        examplesPath={activeNode.relativeJsonPath.concat('x-examples')}
        className="mt-6" />, {
        providerProps: {value: stores},
      });
      expect(screen.getAllByRole(/menuitem/).length).toBe(1);
      expect(screen.getByRole(/menuitem/)).toHaveTextContent(/object/);
      asserts.oas(activeNode.relativeJsonPath).toStrictEqual({
        properties: {},
        title: 'AbcdModel',
        type: 'object',
      });
    });

    it('adds string property on add btn', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('def');
      stores.uiStore.setActiveNode(model);
      const {activeNode} = stores.uiStore;
      render(<SchemaDesigner
        schemaPath={activeNode.relativeJsonPath}
        examplesPath={activeNode.relativeJsonPath.concat('x-examples')}
        className="mt-6" />, {
        providerProps: {value: stores},
      });
      expect(getTreeRow().length).toBe(1);
      userEvent.click(within(getTreeRow(-1)).getByTestId('add-property-btn'));
      expect(getTreeRow().length).toBe(2);
      expect(getTreeRow(0)).toHaveTextContent(/string/)
      userEvent.type(within(getTreeRow(0)).getByTestId("namefield"), "aabc")
      userEvent.tab()
      // Wait for 500ms for changes to propagate
      await new Promise((r) => setTimeout(r, 500));
      asserts.oas("components.schemas.def").toStrictEqual({
        type: "object",
        title: "def",
        properties: {
          "aabc": {
            type: "string"
          }
        }
      });
    });
  });
});
