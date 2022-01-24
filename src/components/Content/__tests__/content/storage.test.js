import userEvent from '@testing-library/user-event';
import React from 'react';
import {render, StoreCreator, screen} from '../../../../../test-utils';
import {spec as defaultSpec} from '../../../../datasets/openapi';
import {LOCALSTORAGE_KEY} from '../../../../Stores/storageStore';
import Content from '../../index';
import {waitFor} from '@testing-library/dom';

const dummyTime = 1487076708000;

describe('localstorage tests', () => {
  let mockStorage = {};
  beforeEach(() => {
    global.Date.now = jest.fn(() => dummyTime);
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
  });

  afterEach(() => {
    global.Storage.prototype.setItem.mockReset();
    global.Storage.prototype.getItem.mockReset();
    global.Date.now.mockReset();
    //dateNowSpy.mockRestore();
  });

  const getDescriptionBox = () =>
    screen.getByPlaceholderText(/API description.../);
  it('saves items into localstorage', async () => {
    jest.setTimeout(1100);
    const {stores} = StoreCreator();
    const {rerender} = render(<Content />, {providerProps: {value: stores}});
    expect(getDescriptionBox()).toHaveValue('');
    userEvent.type(getDescriptionBox(), 'Abcd{esc}');
    expect(getDescriptionBox()).toHaveValue('Abcd');
    // Wait for 1100 milliseconds, as the write to localstorage is after 1 sec
    await new Promise((r) => setTimeout(r, 1100));
    expect(global.Storage.prototype.setItem).toHaveBeenNthCalledWith(
      1,
      '__expiry',
      dummyTime + 24 * 60 * 1000,
    );
    expect(global.Storage.prototype.setItem).toHaveBeenNthCalledWith(
      2,
      LOCALSTORAGE_KEY,
      JSON.stringify({
        ...defaultSpec,
        info: {...defaultSpec.info, description: 'Abcd'},
      }),
    );
  });
});
