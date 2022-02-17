import React from 'react';
import {
  render,
  StoreCreator,
  userEvent,
  SchemaUtils,
} from '../../../../../../test-utils';
import Schema from '../..';

jest.mock('../../../../../../app.config.js', () => {
  return {
    __esModule: true,
    ...{default: {store: {schema: {delay: 0}}}},
  };
});

describe('Object property tests', () => {
  const user = userEvent.setup();

  let currentNode;

  beforeEach(async () => {
    const {stores, addSchema, expectNode} = StoreCreator();
    const node = addSchema();
    render(
      <Schema
        schemaPath={node.relativeJsonPath}
        examplesPath={node.relativeJsonPath.concat('examples')}
      />,
      {
        providerProps: {value: stores},
      },
    );

    currentNode = expectNode;
    await user.click(SchemaUtils.addPropertyButton(0));
    await SchemaUtils.selectPropertyType(1, 'object');
  });

  it('default behaviour', async () => {
    expect(SchemaUtils.actionButtons.delete(0)).toBeDisabled();
    expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
    expect(1).isObjectRow();
  });

  describe('Nested child tests', () => {
    beforeEach(async () => {
      await user.click(SchemaUtils.addPropertyButton(1));
    });

    it('default behaviour', async () => {
      expect(SchemaUtils.nameField(1)).toHaveValue('');
      expect(2).isStringRow();
      expect(currentNode).toHaveObjectSchema({
        properties: {'': {type: 'object', properties: {'': {type: 'string'}}}},
      });
    });

    it('can change child property type', async () => {
      await SchemaUtils.inputName('abcd', 1);
      await SchemaUtils.inputName('pqr', 2);
      await SchemaUtils.selectPropertyType(2, /object/);
      expect(2).isObjectRow();
      expect(currentNode).toHaveObjectSchema({
        properties: {
          abcd: {type: 'object', properties: {pqr: {type: 'object'}}},
        },
      });
    });

    it('can collapse all childs', async () => {
      await SchemaUtils.inputName('abcd', 1);
      await SchemaUtils.inputName('pqr', 2);
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      await user.click(SchemaUtils.collapseButton(0));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(1);
      expect(currentNode).toHaveObjectSchema({
        properties: {
          abcd: {type: 'object', properties: {pqr: {type: 'string'}}},
        },
      });

      await user.click(SchemaUtils.collapseButton(0));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      expect(1).toHaveName('abcd');
      expect(2).toHaveName('pqr');
      expect(currentNode).toHaveObjectSchema({
        properties: {
          abcd: {type: 'object', properties: {pqr: {type: 'string'}}},
        },
      });

      await user.click(SchemaUtils.collapseButton(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).toHaveName('abcd');
      expect(currentNode).toHaveObjectSchema({
        properties: {
          abcd: {type: 'object', properties: {pqr: {type: 'string'}}},
        },
      });
    });

    it('can delete child', async () => {
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      await user.click(SchemaUtils.actionButtons.delete(2));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(currentNode).toHaveObjectSchema({
        properties: {'': {type: 'object'}},
      });
    });
  });

  describe('Name tests', () => {
    it('can upsert name', async () => {
      await SchemaUtils.inputName('abcd', 1);
      expect(SchemaUtils.nameField(1)).toHaveValue('abcd');
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'object'}},
      });
      // Update name
      await SchemaUtils.inputName('def', 1);
      expect(SchemaUtils.nameField(1)).toHaveValue('def');
      expect(currentNode).toHaveObjectSchema({
        properties: {def: {type: 'object'}},
      });
    });

    it('add new field on Enter', async () => {
      await SchemaUtils.inputName('abcd', 1, {enter: true});
      expect(SchemaUtils.nameField(1)).toHaveValue('abcd');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'object'}, '': {type: 'string'}},
      });
    });
  });

  describe('Property tests', () => {
    beforeEach(async () => {
      await SchemaUtils.inputName('abc', 1);
    });
    it('can change to string property', async () => {
      await SchemaUtils.selectPropertyType(1, 'string');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isStringRow();
    });

    it('can change to number property', async () => {
      await SchemaUtils.selectPropertyType(1, 'number');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isNumberRow();
    });

    it('can change to boolean property', async () => {
      await SchemaUtils.selectPropertyType(1, 'boolean');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isBooleanRow();
    });

    it('can change to integer property', async () => {
      await SchemaUtils.selectPropertyType(1, 'integer');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isIntegerRow();
    });

    it('can change to null property', async () => {
      await SchemaUtils.selectPropertyType(1, 'null');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isNullRow();
    });

    it('can change to $ref property', async () => {
      await SchemaUtils.selectPropertyType(1, '$ref');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(1).isRefRow();
    });

    describe('array properties', () => {
      beforeEach(async () => {
        await SchemaUtils.selectPropertyType(1, 'array');
      });

      it('string property', async () => {
        await SchemaUtils.selectPropertyType(1, 'string', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('string');
      });

      it('number property', async () => {
        await SchemaUtils.selectPropertyType(1, 'number', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('number');
      });

      it('integer property', async () => {
        await SchemaUtils.selectPropertyType(1, 'integer', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('integer');
      });

      it('boolean property', async () => {
        await SchemaUtils.selectPropertyType(1, 'boolean', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('boolean');
      });

      it('null property', async () => {
        await SchemaUtils.selectPropertyType(1, 'null', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('null');
      });

      it('$ref property', async () => {
        await SchemaUtils.selectPropertyType(1, '$ref', 'subtype');
        expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
        expect(1).isArrayRow('$ref');
      });
    });
  });

  describe('Action button tests', () => {
    describe('move buttons', () => {
      it('moveUp button 2 child', async () => {
        await user.click(SchemaUtils.addPropertyButton(0));
        await SchemaUtils.inputName('abc', 1);
        await SchemaUtils.inputName('pqr', 2);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'object'}, pqr: {type: 'string'}},
        });
        expect(SchemaUtils.actionButtons.moveUp(1)).toBeDisabled();
        expect(SchemaUtils.actionButtons.moveDown(1)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveUp(2)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveDown(2)).toBeDisabled();

        await user.click(SchemaUtils.actionButtons.moveDown(1));
        expect(SchemaUtils.nameField(1)).toHaveValue('pqr');
        expect(SchemaUtils.nameField(2)).toHaveValue('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'object'}, pqr: {type: 'string'}},
        });

        await user.click(SchemaUtils.actionButtons.moveUp(2));
        expect(SchemaUtils.nameField(1)).toHaveValue('abc');
        expect(SchemaUtils.nameField(2)).toHaveValue('pqr');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'object'}, pqr: {type: 'string'}},
        });
      });

      it('moveUp button 3 child', async () => {
        await user.click(SchemaUtils.addPropertyButton(0));
        await user.click(SchemaUtils.addPropertyButton(0));
        await SchemaUtils.inputName('abc', 1);
        await SchemaUtils.inputName('pqr', 2);
        await SchemaUtils.inputName('lmn', 3);
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'object'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });
        expect(SchemaUtils.actionButtons.moveUp(1)).toBeDisabled();
        expect(SchemaUtils.actionButtons.moveDown(1)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveUp(2)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveDown(2)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveUp(3)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveDown(3)).toBeDisabled();

        await user.click(SchemaUtils.actionButtons.moveDown(1));
        expect(SchemaUtils.nameField(1)).toHaveValue('pqr');
        expect(SchemaUtils.nameField(2)).toHaveValue('abc');
        expect(SchemaUtils.nameField(3)).toHaveValue('lmn');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'object'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });

        await user.click(SchemaUtils.actionButtons.moveDown(2));
        expect(SchemaUtils.nameField(1)).toHaveValue('pqr');
        expect(SchemaUtils.nameField(2)).toHaveValue('lmn');
        expect(SchemaUtils.nameField(3)).toHaveValue('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'object'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });

        await user.click(SchemaUtils.actionButtons.moveUp(2));
        expect(SchemaUtils.nameField(1)).toHaveValue('lmn');
        expect(SchemaUtils.nameField(2)).toHaveValue('pqr');
        expect(SchemaUtils.nameField(3)).toHaveValue('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'object'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });
      });
    });

    it('has working delete button', async () => {
      await SchemaUtils.inputName('abcd', 1);
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'object'}},
      });
      expect(SchemaUtils.actionButtons.delete(1)).toBeEnabled();
      await user.click(SchemaUtils.actionButtons.delete(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(1);
      expect(currentNode).toHaveObjectSchema();
    });

    it('has working duplicate button', async () => {
      await SchemaUtils.inputName('abc', 1);
      expect(SchemaUtils.actionButtons.duplicate(1)).toBeEnabled();
      await user.click(SchemaUtils.actionButtons.duplicate(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'object'}, 'abc - copy': {type: 'object'}},
      });
    });

    it('has working required button', async () => {
      await SchemaUtils.inputName('abc', 1);
      expect(SchemaUtils.actionButtons.required(1)).toBeEnabled();
      await user.click(SchemaUtils.actionButtons.required(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'object'}},
        required: ['abc'],
      });
      // Toggle required
      await user.click(SchemaUtils.actionButtons.required(1));
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'object'}},
      });
    });

    it('has working description button', async () => {
      await SchemaUtils.inputName('abc', 1);
      expect(SchemaUtils.actionButtons.description(1)).toBeEnabled();
      await user.click(SchemaUtils.actionButtons.description(1));
      await SchemaUtils.inputDescription('def', 1);
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'object', description: 'def'}},
      });
    });
  });
});
