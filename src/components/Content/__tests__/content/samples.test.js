import React from 'react';
import userEvent from '@testing-library/user-event';
import {render, screen, StoreCreator, waitFor} from '../../../../../test-utils';
import Content from '../../index';

describe('Curl tests', () => {
  const getCurlBtn = () => screen.queryByRole('button', {name: /Samples/});
  const getCurlCode = () => document.querySelector('.App');

  it('Does not show curl btn on non-operation nodes', () => {
    const {stores, creator} = StoreCreator();
    const {rerender} = render(<Content />, {providerProps: {value: stores}});
    expect(getCurlBtn()).not.toBeInTheDocument();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    rerender(<Content />, {providerProps: {value: stores}});
    expect(getCurlBtn()).toBeInTheDocument();
  });

  it('Have curl sample', () => {
    const {stores, creator} = StoreCreator();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    render(<Content />, {providerProps: {value: stores}});
    expect(getCurlBtn()).toBeInTheDocument();
    userEvent.click(getCurlBtn());
    waitFor(() => expect(getCurlCode()).toBeInTheDocument());
    expect(getCurlCode()).toHaveTextContent(/Send API Request/);
  });
});
