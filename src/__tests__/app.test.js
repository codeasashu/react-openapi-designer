import React from 'react';
import {act, screen} from '../../test-utils';
import {fireEvent, render} from '@testing-library/react';
import App from '../app';

describe('App tests', () => {
  function getSidebar(container) {
    return container.querySelector('.SidebarTreeList');
  }

  it('can toggle fullscreen', () => {
    const {container, getByLabelText} = render(<App />);
    expect(getSidebar(container)).toBeInTheDocument();
    act(() => {
      fireEvent.click(getByLabelText('toggle fullscreen'));
    });
    expect(getSidebar(container)).toBeNull();
    act(() => {
      fireEvent.click(getByLabelText('toggle fullscreen'));
    });
    expect(getSidebar(container)).toBeInTheDocument();
  });

  it('matches snapshots', () => {
    const {asFragment} = render(<App />);
    expect(asFragment).toMatchSnapshot();
  });
});
