/* eslint-disable jest/no-disabled-tests */
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

describe('String property tests', () => {
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
  });

  it('default behaviour', async () => {
    expect(1).toHaveName('');
    expect(1).isStringRow();
    expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
    await user.click(SchemaUtils.addPropertyButton(0));
    expect(2).isStringRow({moveUp: true});
    expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
    expect(currentNode).toHaveObjectSchema({
      properties: {'': {type: 'string'}},
    });
  });

  describe('Name tests', () => {
    it('can add name', async () => {
      await SchemaUtils.inputName('abcd', 1);
      expect(1).toHaveName('abcd');
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'string'}},
      });
    });

    it('can change name', async () => {
      expect(1).toHaveName('');
      await SchemaUtils.inputName('abcd', 1);
      expect(1).toHaveName('abcd');
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'string'}},
      });

      await SchemaUtils.inputName('def', 1);
      expect(1).toHaveName('def');
      expect(currentNode).toHaveObjectSchema({
        properties: {def: {type: 'string'}},
      });
    });

    it('add new field on Enter', async () => {
      await SchemaUtils.inputName('abcd', 1, {enter: true});
      expect(1).toHaveName('abcd');
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      expect(currentNode).toHaveObjectSchema({
        properties: {abcd: {type: 'string'}, '': {type: 'string'}},
      });
    });
  });

  describe('Action button tests', () => {
    describe('move buttons', () => {
      it('moveUp button 2 child', async () => {
        await user.click(SchemaUtils.addPropertyButton(0));
        await SchemaUtils.inputName('abc', 1);
        await SchemaUtils.inputName('pqr', 2);
        expect(SchemaUtils.actionButtons.moveUp(1)).toBeDisabled();
        expect(SchemaUtils.actionButtons.moveDown(1)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveUp(2)).toBeEnabled();
        expect(SchemaUtils.actionButtons.moveDown(2)).toBeDisabled();
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}, pqr: {type: 'string'}},
        });

        await user.click(SchemaUtils.actionButtons.moveDown(1));
        expect(1).toHaveName('pqr');
        expect(2).toHaveName('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}, pqr: {type: 'string'}},
        });

        await user.click(SchemaUtils.actionButtons.moveUp(2));
        expect(1).toHaveName('abc');
        expect(2).toHaveName('pqr');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}, pqr: {type: 'string'}},
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
            abc: {type: 'string'},
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
        expect(1).toHaveName('pqr');
        expect(2).toHaveName('abc');
        expect(3).toHaveName('lmn');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'string'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });

        await user.click(SchemaUtils.actionButtons.moveDown(2));
        expect(1).toHaveName('pqr');
        expect(2).toHaveName('lmn');
        expect(3).toHaveName('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'string'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });

        await user.click(SchemaUtils.actionButtons.moveUp(2));
        expect(1).toHaveName('lmn');
        expect(2).toHaveName('pqr');
        expect(3).toHaveName('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {
            abc: {type: 'string'},
            pqr: {type: 'string'},
            lmn: {type: 'string'},
          },
        });
      });
    });

    it('has working delete button', async () => {
      expect(SchemaUtils.actionButtons.delete(1)).toBeEnabled();
      await user.click(SchemaUtils.actionButtons.delete(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(1);
      expect(currentNode).toHaveObjectSchema();
    });

    it('has working duplicate button', async () => {
      await SchemaUtils.inputName('abc', 1);
      await user.click(SchemaUtils.actionButtons.duplicate(1));
      expect(SchemaUtils.getSchemaRows()).toHaveLength(3);
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'string'}, 'abc - copy': {type: 'string'}},
      });
    });

    it('has working required button', async () => {
      await SchemaUtils.inputName('abc', 1);
      await user.click(SchemaUtils.actionButtons.required(1));
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'string'}},
        required: ['abc'],
      });
      // Toggle required
      await user.click(SchemaUtils.actionButtons.required(1));
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'string'}},
      });
    });

    it('has working description button', async () => {
      await SchemaUtils.inputName('abc', 1);
      await user.click(SchemaUtils.actionButtons.description(1));
      await SchemaUtils.inputDescription('def', 1);
      expect(SchemaUtils.getSchemaRows()).toHaveLength(2);
      expect(currentNode).toHaveObjectSchema({
        properties: {abc: {type: 'string', description: 'def'}},
      });
    });

    describe('Other properties tests', () => {
      beforeEach(async () => {
        // Opening "other properties" popup generates a console error
        // which can be ignored for now. Fix this later.
        console.error = jest.fn();
        await SchemaUtils.inputName('abc', 1);
        await user.click(SchemaUtils.actionButtons.otherProperties(1));
      });

      it('has default fields for string', async () => {
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '',
        );
        expect(SchemaUtils.otherProperties().popover).toHaveTextContent(
          'other properties',
        );
        expect(SchemaUtils.otherProperties().popover).toHaveTextContent(
          'string properties',
        );
        expect(SchemaUtils.otherProperties().default).toHaveValue('');
        expect(SchemaUtils.otherProperties().behaviour).toHaveValue(
          'Read/Write',
        );
        expect(SchemaUtils.otherProperties().enum).toHaveValue('');
        expect(SchemaUtils.otherProperties().example).toHaveValue('');
        expect(SchemaUtils.otherProperties().pattern).toHaveValue('');
        expect(SchemaUtils.otherProperties().minLength).toHaveValue(null);
        expect(SchemaUtils.otherProperties().maxLength).toHaveValue(null);
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '',
        );
      });

      it('can set/unset "default" property', async () => {
        expect(SchemaUtils.otherProperties().default).toHaveValue('');
        await user.type(SchemaUtils.otherProperties().default, 'mydefault');
        expect(SchemaUtils.otherProperties().default).toHaveValue('mydefault');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', default: 'mydefault'}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '1',
        );
        await user.clear(SchemaUtils.otherProperties().default);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '',
        );
      });

      it('can set/unset "deprecated" property', async () => {
        await user.click(SchemaUtils.otherProperties().deprecated);
        expect(SchemaUtils.otherProperties().deprecated).toBeChecked();
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', deprecated: true}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '1',
        );
        await user.click(SchemaUtils.otherProperties().deprecated);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '',
        );
      });

      it('can set/unset "behavior" property', async () => {
        await user.selectOptions(
          SchemaUtils.otherProperties().behaviour,
          'Read Only',
        );
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', readOnly: true}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '1',
        );
        await user.selectOptions(
          SchemaUtils.otherProperties().behaviour,
          'Write Only',
        );
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', writeOnly: true}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '1',
        );
        await user.selectOptions(
          SchemaUtils.otherProperties().behaviour,
          'Read/Write',
        );
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
        expect(SchemaUtils.actionButtons.otherProperties(1)).toHaveTextContent(
          '1',
        );
      });

      it.skip('can set/unset "enum" property', async () => {
        // Can't be tested due to https://github.com/palantir/blueprint/issues/4165
        await user.type(SchemaUtils.otherProperties().enum, 'abc{Enter}');
        expect(SchemaUtils.otherProperties().enum).toHaveValue('abc');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', enum: ['abc']}},
        });
      });

      it('can set/unset "format" property', async () => {
        await user.click(SchemaUtils.otherProperties().format);
        await SchemaUtils.clickSuggestion('date');
        expect(SchemaUtils.otherProperties().format).toHaveValue('date');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', format: 'date'}},
        });

        await user.click(SchemaUtils.otherProperties().format);
        await SchemaUtils.clickSuggestion('none');
        expect(SchemaUtils.otherProperties().format).toHaveValue('none');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
      });

      it('can set/unset "example" property', async () => {
        await user.type(SchemaUtils.otherProperties().example, 'example1');
        expect(SchemaUtils.otherProperties().example).toHaveValue('example1');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', example: 'example1'}},
        });
        await user.clear(SchemaUtils.otherProperties().example);
        expect(SchemaUtils.otherProperties().example).toHaveValue('');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
      });

      it('can set/unset "pattern" property', async () => {
        await user.type(
          SchemaUtils.otherProperties().pattern,
          '^[[A-Za-Z0-9]+',
        );
        expect(SchemaUtils.otherProperties().pattern).toHaveValue(
          '^[A-Za-Z0-9]+',
        );
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', pattern: '^[A-Za-Z0-9]+'}},
        });

        await user.clear(SchemaUtils.otherProperties().pattern);
        expect(SchemaUtils.otherProperties().pattern).toHaveValue('');
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
      });

      it('can set/unset "minLength" property', async () => {
        await user.type(SchemaUtils.otherProperties().minLength, '5');
        expect(SchemaUtils.otherProperties().minLength).toHaveValue(5);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', minLength: 5}},
        });

        await user.clear(SchemaUtils.otherProperties().minLength);
        expect(SchemaUtils.otherProperties().minLength).toHaveValue(null);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
      });

      it('can set/unset "maxLength" property', async () => {
        await user.type(SchemaUtils.otherProperties().maxLength, '10');
        expect(SchemaUtils.otherProperties().maxLength).toHaveValue(10);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string', maxLength: 10}},
        });

        await user.clear(SchemaUtils.otherProperties().maxLength);
        expect(SchemaUtils.otherProperties().maxLength).toHaveValue(null);
        expect(currentNode).toHaveObjectSchema({
          properties: {abc: {type: 'string'}},
        });
      });
    });
  });
});
