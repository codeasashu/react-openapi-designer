import React from 'react';
import {
  act,
  render,
  screen,
  StoreCreator,
  within,
} from '../../../../../test-utils';
import Content from '../../index';
import {fireEvent} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {
  NodeCategories,
  nodeOperations,
  NodeTypes,
} from '../../../../datasets/tree';

describe('Parameters tests', () => {
  const headerBtn = () => screen.getByRole(/button/, {name: 'header'});
  const securityBtn = () => screen.getByRole(/button/, {name: 'security'});

  const securityContextMenuitems = () => {
    const menu = document.querySelector(`ul[data-testid="security-ctxmenu"]`);
    return within(menu).queryAllByRole(/listitem/);
  };

  const getListItemsFor = (label) => {
    const triggerBtn = headerBtn();
    return triggerBtn.parentNode.nextElementSibling.querySelector(
      `[aria-label="${label}"]`,
    );
  };

  const getListItems = (method = 'get') =>
    within(screen.getByRole(`operation-${method}`)).queryAllByRole(/listitem/);

  describe('Header params tests', () => {
    it('creates default header paramter from operation', () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      userEvent.click(headerBtn());
      const listItems = within(screen.getByRole('operation-get')).getAllByRole(
        /listitem/,
      );
      expect(listItems.length).toBe(1);
      asserts
        .oas(['paths', '/user/abc', 'get', 'parameters'])
        .toStrictEqual([{in: 'header', schema: {type: 'string'}}]);
    });

    it('can delete empty param', () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      userEvent.click(headerBtn());
      const listItems = getListItems();
      const deleteBtn = within(listItems[0]).getByRole('button', {
        name: 'delete',
      });
      userEvent.click(deleteBtn);
      expect(getListItems().length).toBe(0);
      asserts
        .oas(['paths', '/user/abc', 'get', 'parameters'])
        .toStrictEqual([]);
    });
  });

  describe('Security parameters', () => {
    it('does not allow adding operation security when no component security is present', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      expect(menuitems.length).toBe(2);
      expect(menuitems[0]).toHaveTextContent(/Edit global security/);
      expect(menuitems[1]).toHaveTextContent(/Disable security for operation/);
    });

    it('allows adding operation security when component security is present', async () => {
      const {stores, storeActions, creator, asserts} = StoreCreator();
      storeActions.patchSourceNodeProp(
        nodeOperations.Replace,
        ['components', 'securitySchemes'],
        {Abc: []},
      );
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      expect(menuitems.length).toBe(3);
      expect(menuitems[0]).toHaveTextContent(/Edit global security/);
      expect(menuitems[1]).toHaveTextContent(/Add operation security/);
      expect(menuitems[2]).toHaveTextContent(/Disable security for operation/);
    });

    it('allows adds operation security when added from operation', async () => {
      const {stores, storeActions, creator, asserts} = StoreCreator();
      storeActions.patchSourceNodeProp(
        nodeOperations.Replace,
        ['components', 'securitySchemes'],
        {Abc: {type: 'apiKey', in: 'query', name: 'Api Key'}},
        //{Abc: {type: 'http', scheme: 'basic'}},
        //{Abc: {type: 'http', scheme: 'bearer'}},
        //{Abc: {type: 'http', scheme: 'digest'}},
      );
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      userEvent.click(menuitems[1].querySelector('a'));
      asserts
        .oas(['paths', '/user/abc', 'get', 'security'])
        .toStrictEqual([{Abc: []}]);
      const selects = within(getListItemsFor('security')).getAllByRole(
        /combobox/,
      );
      expect(selects.length).toBe(1);
      expect(selects[0]).toHaveValue('Abc');
    });

    it('can disable operation security', async () => {
      const {stores, storeActions, creator, asserts} = StoreCreator();
      storeActions.patchSourceNodeProp(
        nodeOperations.Replace,
        ['components', 'securitySchemes'],
        {Abc: {type: 'apiKey', in: 'query', name: 'Api Key'}},
      );
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      userEvent.click(menuitems[2].querySelector('a'));
      asserts.oas(['paths', '/user/abc', 'get', 'security']).toStrictEqual([]);
      const selects = within(getListItemsFor('security')).queryAllByRole(
        /combobox/,
      );
      expect(selects.length).toBe(0);
    });

    it('can enables operation security', async () => {
      const {stores, storeActions, creator, asserts} = StoreCreator();
      storeActions.patchSourceNodeProp(
        nodeOperations.Replace,
        ['components', 'securitySchemes'],
        {Abc: {type: 'apiKey', in: 'query', name: 'Api Key'}},
      );
      const path = creator.createPath('/user/abc');
      storeActions.patchSourceNodeProp(
        nodeOperations.Add,
        ['paths', '/user/abc', 'get', 'security'],
        [],
      );

      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      expect(menuitems[2]).toHaveTextContent(/Remove NO security override/);
      userEvent.click(menuitems[2].querySelector('a'));
      asserts.oas(['paths', '/user/abc', 'get']).not.toHaveProperty('security');
      expect(getListItemsFor('security')).toBeNull();
    });

    it('redirects to info page on clicking global security', async () => {
      const {stores, storeActions, creator, asserts} = StoreCreator();
      storeActions.patchSourceNodeProp(
        nodeOperations.Replace,
        ['components', 'securitySchemes'],
        {Abc: {type: 'apiKey', in: 'query', name: 'Api Key'}},
      );
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});

      await act(async () => {
        await userEvent.click(securityBtn());
      });

      const menuitems = securityContextMenuitems();
      expect(stores.uiStore.activeNode.type).toBe(NodeTypes.Operation);
      expect(stores.uiStore.activeNode.category).toBe(NodeCategories.SourceMap);
      userEvent.click(menuitems[0].querySelector('a'));
      //
      expect(stores.uiStore.activeNode.type).toBe('file');
      expect(stores.uiStore.activeNode.category).toBe(NodeCategories.Source);
    });
  });
});
