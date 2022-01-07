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

describe('Parameters tests', () => {
  const headerBtn = () => screen.getByRole(/button/, {name: 'header'});
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
});
