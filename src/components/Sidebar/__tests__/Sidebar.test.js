import React from 'react';
import {Classes, ContextMenu, Menu, Popover} from '@blueprintjs/core';
import {Classes as PopoverClasses} from '@blueprintjs/popover2';
import {act, render, screen, within, Stores} from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar';
import {wait} from '@testing-library/user-event/dist/utils';
import {NodeTypes} from '../../../utils/tree';
import {isArray, cloneDeep} from 'lodash';
import {toJS} from 'mobx';

describe('Sidebar tests', () => {
  const assertIcon = (elem, icon) => {
    expect(elem).toBeDefined();
    expect(elem).toHaveAttribute('icon', icon);
  };

  beforeEach(() => {
    const popover = getPopover();
    expect(popover).toBeNull();
  });

  it('Renders all sidebar items', () => {
    render(<Sidebar />);
    const items = screen.getAllByRole(/menuitem/);
    expect(items).toHaveLength(7);
    expect(items[0]).toHaveClass('TreeListItem DesignTreeListItem');
    expect(items[0]).toHaveTextContent(/API Overview/);
    expect(items[1]).toHaveTextContent(/Paths/);
    expect(items[2]).toHaveTextContent(/Models/);
    expect(items[3]).toHaveTextContent(/Request Bodies/);
    expect(items[4]).toHaveTextContent(/Responses/);
    expect(items[5]).toHaveTextContent(/Parameters/);
    expect(items[6]).toHaveTextContent(/Examples/);

    // Assert icons
    assertIcon(getIconElement(items[0]), 'star');
    assertIcon(getIconElement(items[1]), 'folder-open');
    assertIcon(getIconElement(items[2]), 'folder-open');
    assertIcon(getIconElement(items[3]), 'folder-open');
    assertIcon(getIconElement(items[4]), 'folder-open');
    assertIcon(getIconElement(items[5]), 'folder-open');
    assertIcon(getIconElement(items[6]), 'folder-open');

    // Asserting that sidebar have 7 list items automatically means it doesn't
    // have any child items (or else they would appear as additional list items
  });

  it('right click on model option', async () => {
    render(<Sidebar />);

    const items = await screen.queryAllByRole(/menuitem/);
    const modelContainer = items[2];
    await act(async () => {
      await rightClick(modelContainer);
    });
    const popover = getPopover();
    const menuItems = getContextMenuItems();

    assertContextMenuWasRendered(1);
    expect(menuItems[0]).toHaveTextContent(/New Model/);
  });

  it('Prompts for new item when right click menu is clicked', async () => {
    render(<Sidebar />);

    let sidebarItems = await screen.queryAllByRole(/menuitem/);
    expect(sidebarItems).toHaveLength(7);
    await act(async () => {
      await rightClick(sidebarItems[2]);
    });

    const menuItems = getContextMenuItems();
    const createModelButton = await within(menuItems[0]).getByText(/New Model/);
    expect(createModelButton).toBeDefined();
    await userEvent.click(createModelButton);

    // Clicking on "New Model" should add an editable row in the sidebar tree
    const editableItems = await screen.queryAllByRole(/edititem/);
    expect(editableItems).toHaveLength(1);

    // The new item is just next to the current "right-clicked" item
    const editableInput = getEditableInput(editableItems[0], true);
    expect(editableInput).toBeInTheDocument();
    expect(editableInput).toHaveValue('');

    // No editable text is present inside other sidebar items
    const _editableInput = getEditableInput(sidebarItems[4]);
    expect(_editableInput).toBeNull();
  });

  it('Does not have context menu in API Overview', async () => {
    render(<Sidebar />);
    let overviewItem = getNodeFromSidebar(NodeTypes.Overview);
    await act(async () => {
      await rightClick(overviewItem);
    });

    const popover = getPopover();
    expect(popover).toBeNull();
  });

  it('Adds new item when entered in editable text', async (done) => {
    render(<Sidebar />);
    const assertNewItem = async (nodeType, menuItemName, newItemName) => {
      const sidebarItem = getNodeFromSidebar(nodeType);
      const addNewBtnLabel = getAddButtonLabel(nodeType);
      await clickAddNewItem(sidebarItem, menuItemName);

      // Find editable text
      const editableItem = await screen.getAllByRole(/edititem/);
      expect(editableItem).toHaveLength(1);
      const editableInput = getEditableInput(editableItem[0]);
      await act(async () => {
        // Enter the new item name and press enter
        try {
          userEvent.type(editableInput, `${newItemName}`);
          userEvent.keyboard('{Enter}');
        } catch (err) {
          done(err);
        }
      });
      // Assert that item is in the menu
      const newSidebarItems = await screen.queryAllByText(newItemName);
      expect(newSidebarItems).toHaveLength(1);
      //done()
    };

    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    await assertNewItem(NodeTypes.Models, 'New Model', 'xyzd');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    await assertNewItem(
      NodeTypes.RequestBodies,
      'New Request Body',
      'requestBody123',
    );
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(9);
    await assertNewItem(NodeTypes.Responses, 'New Response', 'UserResponse');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(10);
    done();
  });

  it('Set clicked menuitem as active ui node', async () => {
    const stores = new Stores();
    render(<Sidebar />, {providerProps: {value: stores}});
    expect(stores.uiStore.activeSymbolNode).toBeUndefined();
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Models, 'UserModel');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    expect(childNode).toHaveTextContent(/UserModel/);
    await act(async () => {
      await userEvent.click(childNode);
    });
    expect(stores.uiStore.activeSymbolNode.type).toBe(NodeTypes.Model);
    expect(stores.uiStore.activeSymbolNode.uri).toBe(
      '/p/reference.yaml/components/schemas/UserModel',
    );
  });

  it('Allows renaming and deleting node', async () => {
    render(<Sidebar />);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Models, 'UserModel');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    expect(childNode).toHaveTextContent(/UserModel/);
    await act(async () => {
      await rightClick(childNode);
    });
    assertContextMenuWasRendered(2);
    const menuItems = getContextMenuItems();
    expect(menuItems[0]).toHaveTextContent(/Rename/);
    expect(menuItems[1]).toHaveTextContent(/Delete model/);
  });

  it('Has operation and context menu in path node', async () => {
    render(<Sidebar />);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Paths, '/users');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    expect(childNode).toHaveTextContent('sresu/get');
    expect(within(childNode).getAllByRole('button')).toHaveLength(1);
    expect(within(childNode).getByRole('button')).toHaveTextContent('get');
    await act(async () => {
      await rightClick(childNode);
    });
    assertContextMenuWasRendered(3);
    const menuItems = getContextMenuItems();
    expect(menuItems[0]).toHaveTextContent(/Rename/);
    expect(menuItems[1]).toHaveTextContent(/Delete path/);
    expect(menuItems[2]).toHaveTextContent(/Delete Operation/);
  });

  it('Can rename node', async () => {
    render(<Sidebar />);
    const assertRename = async (nodeType) => {
      const childName = `${generateRandomName()}${nodeType}`;
      const renamedChildName = `${generateRandomName()}${nodeType}`;
      const childNode = await addChildNode(nodeType, childName);
      const newSidebarItems = await screen.queryAllByText(childName);
      expect(newSidebarItems).toHaveLength(1);
      await act(async () => {
        await rightClick(childNode);
      });
      const menuItems = getContextMenuItems();
      await act(async () => {
        await userEvent.click(menuItems[0].querySelector('a'));
      });
      const editItem = getNodeFromSidebar(
        getChildNodeType(nodeType),
      ).querySelector('input');
      expect(editItem).toHaveValue(childName);
      await act(async () => {
        await userEvent.type(editItem, `${renamedChildName}{Enter}`);
      });
      expect(screen.queryByText(childName)).toBeNull();
      expect(screen.queryByText(renamedChildName)).toBeInTheDOM();
    };

    await assertRename(NodeTypes.Models);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    await assertRename(NodeTypes.RequestBodies);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(9);
    await assertRename(NodeTypes.Responses);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(10);
  });

  it('Can delete node', async () => {
    render(<Sidebar />);
    const assertDelete = async (nodeType) => {
      expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
      const childName = `${generateRandomName()}${nodeType}`;
      const childNode = await addChildNode(nodeType, childName);
      const newSidebarItems = await screen.queryAllByText(childName);
      expect(newSidebarItems).toHaveLength(1);
      expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
      await act(async () => {
        await rightClick(childNode);
      });
      const menuItems = getContextMenuItems();
      await act(async () => {
        await userEvent.click(menuItems[1].querySelector('a'));
      });
      expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    };

    await assertDelete(NodeTypes.Models);
    await assertDelete(NodeTypes.RequestBodies);
    await assertDelete(NodeTypes.Responses);
  });

  it('Can rename path', async () => {
    render(<Sidebar />);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Paths, '/users');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    await act(async () => {
      await rightClick(childNode);
    });
    const menuItems = getContextMenuItems();
    // Delete path
    act(() => {
      userEvent.click(menuItems[0].querySelector('a'));
    });

    const editItem = getNodeFromSidebar(NodeTypes.Path).querySelector('input');
    expect(editItem).toHaveValue(`/users`);
    await act(async () => {
      await userEvent.type(editItem, `/abc{Enter}`);
    });
    const pathnode = getNodeFromSidebar(NodeTypes.Path);
    expect(screen.queryByText('/users')).toBeNull();
    expect(screen.queryByText('cba/')).toBeInTheDOM();

    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
  });

  it('Can delete path', async () => {
    render(<Sidebar />);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Paths, '/users');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    await act(async () => {
      await rightClick(childNode);
    });
    const menuItems = getContextMenuItems();
    // Delete path
    act(() => {
      userEvent.click(menuItems[1].querySelector('a'));
    });
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
  });

  it('Can delete operation', async () => {
    render(<Sidebar />);
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(7);
    const childNode = await addChildNode(NodeTypes.Paths, '/users');
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
    await act(async () => {
      await rightClick(childNode);
    });
    const menuItems = getContextMenuItems();
    // Delete operation
    act(() => {
      userEvent.click(menuItems[2].querySelector('a'));
    });
    expect(screen.getAllByRole(/menuitem/)).toHaveLength(8);
  });
});

const getIconElement = (elem) =>
  elem.querySelector('.TreeListItem__icon > span');

function generateRandomName(length = 4) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function rightClick(element) {
  await userEvent.click(element, {buttons: 2});
}

function getAddButtonLabel(nodeType) {
  switch (nodeType) {
    case NodeTypes.Paths:
      return 'New Path';
    case NodeTypes.Models:
      return 'New Model';
    case NodeTypes.RequestBodies:
      return 'New Request Body';
    case NodeTypes.Responses:
      return 'New Response';
    case NodeTypes.Paths:
      return 'New Path';
    default:
      return null;
  }
}

function getChildNodeType(parentNodeType) {
  switch (parentNodeType) {
    case NodeTypes.Models:
      return NodeTypes.Model;
    case NodeTypes.RequestBodies:
      return NodeTypes.RequestBody;
    case NodeTypes.Responses:
      return NodeTypes.Response;
    case NodeTypes.Paths:
      return NodeTypes.Path;
    default:
      return null;
  }
}

async function addChildNode(nodeType, name) {
  const parentNode = await getNodeFromSidebar(nodeType);
  const addNewBtnLabel = getAddButtonLabel(nodeType);
  await clickAddNewItem(parentNode, addNewBtnLabel);

  const editableItem = await screen.getAllByRole(/edititem/);
  expect(editableItem).toHaveLength(1);
  const editableInput = getEditableInput(editableItem[0]);
  await act(async () => {
    // Enter the new item name and press enter
    await userEvent.type(editableInput, `${name}{Enter}`);
  });
  return getNodeFromSidebar(getChildNodeType(nodeType));
}

async function clickAddNewItem(menuItem, addBtnLabel) {
  await act(async () => {
    await rightClick(menuItem);
  });

  const popover = getPopover();
  const menuItems = getContextMenuItems();
  expect(menuItems).toHaveLength(1);
  const addNewBtn = within(menuItems[0]).getByText(addBtnLabel);
  await act(async () => {
    await userEvent.click(addNewBtn);
  });
}

function getNodeFromSidebar(nodeType) {
  return screen.getByLabelText(nodeType);
}

function getContextMenuItems() {
  const popover = getPopover();
  return within(popover).queryAllByRole('listitem');
}

function getEditableInput(containerElem, shouldRaiseException = false) {
  //return containerElem.querySelector('.DesignTreeListItem__input');
  return shouldRaiseException
    ? within(containerElem).getByRole(/textbox/)
    : within(containerElem).queryByRole(/textbox/);
}

function getPopover() {
  return document.querySelector(
    `.${PopoverClasses.POPOVER2}.${Classes.MINIMAL}`,
  );
}

function getContextMenu() {
  return document.querySelector(`.${PopoverClasses.CONTEXT_MENU2}`);
}

function assertContextMenuWasRendered(expectedLength = 0) {
  const menu = getContextMenu();
  expect(menu).not.toBeNull();
  // popover is rendered in a Portal
  const popover = getPopover();
  expect(popover).not.toBeNull();

  const menuItems = getContextMenuItems();
  expect(menuItems.length).toBe(expectedLength);
}
