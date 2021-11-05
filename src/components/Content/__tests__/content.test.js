import React from 'react';
import userEvent from '@testing-library/user-event';
import {Classes} from '@blueprintjs/core';
import {Classes as PopoverClasses} from '@blueprintjs/popover2';
import {
  act,
  render,
  screen,
  StoreCreator,
  within,
} from '../../../../test-utils';
import Content from '../index';
import {fireEvent, prettyDOM} from '@testing-library/dom';

describe('Content tests', () => {
  describe('Schema tests', () => {
    it('tests default created schema', async () => {
      const {stores, creator} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      render(<Content />, {providerProps: {value: stores}});
      expect(screen.getByRole('title')).toHaveValue('AbcdModel');
      expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
      const schemaRows = screen.getAllByRole(/schema-row/);
      expect(schemaRows).toHaveLength(1);
      expect(schemaRows[0]).toHaveTextContent(/object/);
    });

    it('can change title field', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      render(<Content />, {providerProps: {value: stores}});
      act(() => {
        fireEvent.change(screen.getByRole(/title/), {
          target: {value: 'MyTitle'},
        });
        fireEvent.blur(screen.getByRole(/title/));
      });
      asserts.oas(model.relativeJsonPath.concat('title')).toBe('MyTitle');
      asserts.oas(model.relativeJsonPath.concat('description')).toBeNull();
    });

    it('can change description field', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      render(<Content />, {providerProps: {value: stores}});
      act(() => {
        fireEvent.change(screen.getByPlaceholderText(/Description/), {
          target: {value: 'abc'},
        });
        fireEvent.blur(screen.getByPlaceholderText(/Description/));
      });
      asserts.oas(model.relativeJsonPath.concat('title')).toBe('AbcdModel');
      asserts.oas(model.relativeJsonPath.concat('description')).toBe('abc');
    });

    it('can change schema editor fields', () => {
      const {stores, creator, asserts} = StoreCreator();
      const model = creator.createModel('AbcdModel');
      stores.uiStore.setActiveNode(model);
      render(<Content />, {providerProps: {value: stores}});
      const addSchemaRowBtn = screen
        .getByRole(/schema-row/)
        .querySelector('.bp3-icon.bp3-icon-plus');

      act(() => {
        userEvent.click(addSchemaRowBtn);
      });

      asserts
        .oas(model.relativeJsonPath.concat(['properties']))
        .toStrictEqual({field_1: {type: 'string'}});

      asserts
        .oas(model.relativeJsonPath.concat(['required']))
        .toContain('field_1');
    });
  });

  describe('Request Body tests', () => {
    it('tests default created requestBody', async () => {
      const {stores, creator} = StoreCreator();
      const body = creator.createRequestBody('MyReqBody');
      stores.uiStore.setActiveNode(body);
      render(<Content />, {providerProps: {value: stores}});
      expect(screen.getByPlaceholderText(/description/)).toHaveValue('');
      const schemaRows = screen.getAllByRole(/schema-row/);
      expect(schemaRows).toHaveLength(1);
      expect(schemaRows[0]).toHaveTextContent(/object/);
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/json');
      expect(screen.getByRole(/combobox/)).toHaveValue('application/json');
    });

    it('replace selected content type on selecting', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createRequestBody('MyReqBodyb');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(
          screen.getByPlaceholderText(/Create or choose existing/),
        );
        const popover = document.querySelector('.bp3-popover.bp3-minimal');
        expect(popover).not.toBeNull();
        await userEvent.click(
          within(popover).getByTestId('application/xml'),
          undefined,
          {
            skipPointerEventsCheck: true,
          },
        );
      });
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        1,
      );
      const doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/xml');
      expect(Object.keys(doc)).toHaveLength(1);
    });

    it('can add more content type', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createRequestBody('MyReqBodyb');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        const popover = document.querySelector('.bp3-popover.bp3-minimal');
        expect(popover).not.toBeNull();
        await userEvent.click(
          within(popover).getByTestId('application/xml'),
          undefined,
          {
            skipPointerEventsCheck: true,
          },
        );
      });
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        2,
      );
      const doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).toHaveProperty('application/xml');
      expect(Object.keys(doc)).toHaveLength(2);
    });

    it('should delete requestBody when deleting the default content type', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createRequestBody('MyReqBodyc');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getByTitle} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByTitle('remove'));
      });
      const doc = asserts.oas(body.relativeJsonPath, true);
      expect(doc).toBeNull();
      // There is no longer any schema box (i.e info node is present)
      expect(screen.queryAllByRole(/schema-row/)).toHaveLength(0);
    });

    it('should revert to sorted content type on delete', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createRequestBody('MyReqBodyd');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getByTitle} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        userEvent.keyboard('{Esc}');
      });
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      let doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).toHaveProperty('application/xml');
      await act(async () => {
        await userEvent.click(getByTitle('remove'));
      });
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        1,
      );
      doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).not.toHaveProperty('application/xml');
    });

    it('switching content type changes the schema', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createRequestBody('ReqBodye');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getAllByRole, getByTitle} = render(
        <Content />,
        {
          providerProps: {value: stores},
        },
      );
      const addSchemaRowBtn = getByRole(/schema-row/).querySelector(
        '.bp3-icon.bp3-icon-plus',
      );
      act(() => {
        userEvent.click(addSchemaRowBtn);
      });
      asserts
        .oas(
          body.relativeJsonPath.concat([
            'content',
            'application/json',
            'schema',
            'properties',
          ]),
        )
        .toStrictEqual({field_1: {type: 'string'}});

      expect(getAllByRole(/schema-row/)).toHaveLength(2);
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        userEvent.keyboard('{Esc}');
      });
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      const addSchemaRowBtn2 = getByRole(/schema-row/).querySelector(
        '.bp3-icon.bp3-icon-plus',
      );
      act(() => {
        userEvent.click(addSchemaRowBtn2);
        userEvent.click(addSchemaRowBtn2);
      });
      asserts
        .oas(
          body.relativeJsonPath.concat([
            'content',
            'application/xml',
            'schema',
            'properties',
          ]),
        )
        .toStrictEqual({field_1: {type: 'string'}, field_2: {type: 'string'}});

      expect(getAllByRole(/schema-row/)).toHaveLength(3);
      act(() => {
        userEvent.selectOptions(getByRole(/combobox/), 'application/json');
      });
      expect(getAllByRole(/schema-row/)).toHaveLength(2);
    });
  });

  describe('Responses tests', () => {
    it('tests default created response', async () => {
      const {stores, creator} = StoreCreator();
      const body = creator.createResponse('MyResp');
      stores.uiStore.setActiveNode(body);
      render(<Content />, {providerProps: {value: stores}});
      expect(screen.getByPlaceholderText(/description/)).toHaveValue('');
      const schemaRows = screen.getAllByRole(/schema-row/);
      expect(schemaRows).toHaveLength(1);
      expect(schemaRows[0]).toHaveTextContent(/object/);
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/json');
      expect(screen.getByRole(/combobox/)).toHaveValue('application/json');
    });

    it('replace selected content type on selecting', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createResponse('MyRespb');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(
          screen.getByPlaceholderText(/Create or choose existing/),
        );
        const popover = document.querySelector('.bp3-popover.bp3-minimal');
        expect(popover).not.toBeNull();
        await userEvent.click(
          within(popover).getByTestId('application/xml'),
          undefined,
          {
            skipPointerEventsCheck: true,
          },
        );
      });
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        1,
      );
      const doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/xml');
      expect(Object.keys(doc)).toHaveLength(1);
    });

    it('can add more content type', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createResponse('MyReqBodyb');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        const popover = document.querySelector('.bp3-popover.bp3-minimal');
        expect(popover).not.toBeNull();
        await userEvent.click(
          within(popover).getByTestId('application/xml'),
          undefined,
          {
            skipPointerEventsCheck: true,
          },
        );
      });
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        2,
      );
      const doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).toHaveProperty('application/xml');
      expect(Object.keys(doc)).toHaveLength(2);
    });

    it('should delete response when deleting the default content type', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createResponse('MyReqBodyc');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getByTitle} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByTitle('remove'));
      });
      const doc = asserts.oas(body.relativeJsonPath, true);
      expect(doc).toBeNull();
      // There is no longer any schema box (i.e info node is present)
      expect(screen.queryAllByRole(/schema-row/)).toHaveLength(0);
    });

    it('should revert to sorted content type on delete', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createResponse('MyReqBodyd');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getByTitle} = render(<Content />, {
        providerProps: {value: stores},
      });
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        userEvent.keyboard('{Esc}');
      });
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      let doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).toHaveProperty('application/xml');
      await act(async () => {
        await userEvent.click(getByTitle('remove'));
      });
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        1,
      );
      doc = asserts.oas(body.relativeJsonPath.concat(['content']), true);
      expect(doc).toHaveProperty('application/json');
      expect(doc).not.toHaveProperty('application/xml');
    });

    it('switching content type changes the schema', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const body = creator.createResponse('ReqBodye');
      stores.uiStore.setActiveNode(body);
      const {container, getByRole, getAllByRole, getByTitle} = render(
        <Content />,
        {
          providerProps: {value: stores},
        },
      );
      const addSchemaRowBtn = getByRole(/schema-row/).querySelector(
        '.bp3-icon.bp3-icon-plus',
      );
      act(() => {
        userEvent.click(addSchemaRowBtn);
      });
      asserts
        .oas(
          body.relativeJsonPath.concat([
            'content',
            'application/json',
            'schema',
            'properties',
          ]),
        )
        .toStrictEqual({field_1: {type: 'string'}});

      expect(getAllByRole(/schema-row/)).toHaveLength(2);
      await act(async () => {
        await userEvent.click(getByRole('button', {name: 'Add Body'}));
        userEvent.keyboard('{Esc}');
      });
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveTextContent('application/json');
      const addSchemaRowBtn2 = getByRole(/schema-row/).querySelector(
        '.bp3-icon.bp3-icon-plus',
      );
      act(() => {
        userEvent.click(addSchemaRowBtn2);
        userEvent.click(addSchemaRowBtn2);
      });
      asserts
        .oas(
          body.relativeJsonPath.concat([
            'content',
            'application/xml',
            'schema',
            'properties',
          ]),
        )
        .toStrictEqual({field_1: {type: 'string'}, field_2: {type: 'string'}});

      expect(getAllByRole(/schema-row/)).toHaveLength(3);
      act(() => {
        userEvent.selectOptions(getByRole(/combobox/), 'application/json');
      });
      expect(getAllByRole(/schema-row/)).toHaveLength(2);
    });
  });

  describe('Parameters tests', () => {
    describe('Query parameters', () => {
      it('tests default created parameter', async () => {
        const {stores, creator} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        expect(screen.getByLabelText(/name/)).toHaveValue('abc');
        expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
        expect(screen.getByRole(/combobox/)).toHaveValue('string');
      });

      it('can change name', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        const nameField = screen.getByLabelText(/name/);
        expect(nameField).toHaveValue('abc');
        await act(async () => {
          await fireEvent.change(nameField, {
            target: {value: 'defg'},
          });
          await fireEvent.focusOut(nameField);
        });
        expect(nameField).toHaveValue('defg');
        expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
        expect(screen.getByRole(/combobox/)).toHaveValue('string');
        asserts.oas('components.parameters.abc').toStrictEqual({
          in: 'query',
          name: 'defg',
          description: '',
          schema: {type: 'string'},
        });
      });

      it('can change description', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        const descriptionField = screen.getByPlaceholderText(/Description/);
        expect(descriptionField).toHaveValue('');
        await act(async () => {
          await fireEvent.change(descriptionField, {
            target: {value: 'defg'},
          });
          await fireEvent.focusOut(descriptionField);
        });
        expect(screen.getByLabelText(/name/)).toHaveValue('abc');
        expect(descriptionField).toHaveValue('defg');
        expect(screen.getByRole(/combobox/)).toHaveValue('string');
        asserts.oas('components.parameters.abc').toStrictEqual({
          in: 'query',
          name: 'abc',
          description: 'defg',
          schema: {type: 'string'},
        });
      });

      it('can change schema type', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        const schemaType = screen.getByRole('combobox');
        await act(async () => {
          await userEvent.selectOptions(schemaType, 'number');
        });
        expect(screen.getByLabelText(/name/)).toHaveValue('abc');
        expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
        expect(screen.getByRole(/combobox/)).toHaveValue('number');
        asserts.oas('components.parameters.abc').toStrictEqual({
          in: 'query',
          name: 'abc',
          description: '',
          schema: {type: 'number'},
        });
      });

      it('cannot change required property', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        const checkbox = screen.getByTitle(/required/);
        expect(checkbox).toBeDisabled();
        expect(screen.getByLabelText(/name/)).toHaveValue('abc');
        expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
        expect(screen.getByRole(/combobox/)).toHaveValue('string');
        asserts.oas('components.parameters.abc').toStrictEqual({
          in: 'query',
          name: 'abc',
          required: false,
          schema: {type: 'string'},
        });
      });

      it('has AdvancedProperties', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        let popover = document.querySelector(`.${PopoverClasses.POPOVER2}`);
        expect(popover).toBeNull();
        const advPropBtn = screen.getByTitle('advanced properties');
        await act(async () => {
          userEvent.click(advPropBtn);
        });
        popover = document.querySelector(`.${PopoverClasses.POPOVER2}`);
        expect(popover).toHaveTextContent(/other properties/);
        expect(screen.getByLabelText(/name/)).toHaveValue('abc');
        expect(screen.getByPlaceholderText(/Description/)).toHaveValue('');
        expect(screen.getByLabelText(/schema/)).toHaveValue('string');
        asserts.oas('components.parameters.abc').toStrictEqual({
          in: 'query',
          name: 'abc',
          required: false,
          schema: {type: 'string'},
        });
      });

      it('deletes on delete button', async () => {
        const {stores, creator, asserts} = StoreCreator();
        const queryparam = creator.createParameter('abc', 'query');
        stores.uiStore.setActiveNode(queryparam);
        render(<Content />, {
          providerProps: {value: stores},
        });
        const deleteBtn = screen.getByLabelText('delete');
        await act(async () => {
          userEvent.click(deleteBtn);
        });
        asserts.oas('components.parameters.abc').toBeNull();
      });
    });
  });
});
