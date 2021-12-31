import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  act,
  render,
  screen,
  StoreCreator,
  within,
} from '../../../../test-utils';
import Stores from '../../../Stores';
import Content from '../../Content';

jest.useFakeTimers();

describe('Monaco editor tests', () => {
  it('renders default oas schema in yaml', async () => {
    const stores = new Stores();
    await stores.activate();
    const {creator, asserts} = StoreCreator(stores);
    const model = creator.createModel('AbcdModel');
    stores.uiStore.setActiveNode(model);
    stores.uiStore.setActiveView('code');
    render(<Content />, {providerProps: {value: stores}});

    //render(<Monaco />, {
    //providerProps: {value: stores},
    //});
    screen.debug();
  });
});
