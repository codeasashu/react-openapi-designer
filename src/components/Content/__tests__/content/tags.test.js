import {fireEvent, within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {Classes} from '@blueprintjs/select';
import {act, render, StoreCreator, screen} from '../../../../../test-utils';
import Content from '../../index';

//const path = creator.createPath('/user/abc');
//stores.uiStore.setActiveNode(path);
//const {container} = render(<Content />, {providerProps: {value: stores}});

describe('Tags tests', () => {
  const getTagBtn = () => screen.getByRole('button', {name: /tags/});

  const getPopover = () => {
    return document.querySelector(`.tagpopover`);
  };

  const getTagsInsideSelect = () => {
    return getPopover().querySelectorAll('.bp3-tag');
  };

  const getNoResultDropdown = () => {
    return document.querySelector('.tagsuggest-noresult');
  };

  const getSuggestionsPopup = () => {
    return document.querySelector(`.${Classes.MULTISELECT_POPOVER}`);
  };

  it('can add global tags', async () => {
    const {stores} = StoreCreator();
    render(<Content />, {providerProps: {value: stores}});
    expect(getTagBtn()).toBeInTheDocument();

    userEvent.click(getTagBtn());
    expect(getTagsInsideSelect()).toHaveLength(0);

    // Add a tag
    await userEvent.type(within(getPopover()).getByRole(/textbox/), 'cxtag', {
      delay: 1,
    });
    userEvent.keyboard('{Enter}');

    expect(getTagsInsideSelect()).toHaveLength(1);
    expect(getTagsInsideSelect()[0]).toHaveTextContent(/cxtag/);
    expect(getNoResultDropdown()).not.toBeInTheDocument();

    // Tags are also added to suggestions
    expect(within(getSuggestionsPopup()).getAllByRole(/listitem/)).toHaveLength(
      1,
    );
    expect(
      within(getSuggestionsPopup()).getAllByRole(/listitem/)[0],
    ).toHaveTextContent(/cxtag/);
  });

  it('has no suggestions when no global tags are present', async () => {
    const {stores} = StoreCreator();

    render(<Content />, {providerProps: {value: stores}});
    expect(getTagBtn()).toBeInTheDocument();

    userEvent.click(getTagBtn());
    expect(getTagsInsideSelect()).toHaveLength(0);

    // Check list dropdown
    await act(async () => {
      await userEvent.click(within(getPopover()).getByRole(/textbox/));
    });

    expect(getTagsInsideSelect()).toHaveLength(0);
    expect(getNoResultDropdown()).toBeInTheDocument();
    expect(getNoResultDropdown()).toHaveTextContent(/No results./);
  });

  it('shows global tags suggestions in path node', async () => {
    const {stores, creator} = StoreCreator();

    const {rerender} = render(<Content />, {providerProps: {value: stores}});
    // Add a tag
    userEvent.click(getTagBtn());
    await userEvent.type(within(getPopover()).getByRole(/textbox/), 'cxtag', {
      delay: 1,
    });
    userEvent.keyboard('{Enter}');

    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);

    rerender(<Content />, {providerProps: {value: stores}});
    userEvent.click(getTagBtn());
    expect(getTagsInsideSelect()).toHaveLength(0);
    expect(within(getSuggestionsPopup()).getAllByRole(/listitem/)).toHaveLength(
      1,
    );
    expect(
      within(getSuggestionsPopup()).getAllByRole(/listitem/)[0],
    ).toHaveTextContent(/cxtag/);
  });
});
