import React from 'react';
import {
  render,
  initStore,
  userEvent,
  ContentUtils,
} from '../../../../../../test-utils';
import Options from '../../../options';

describe('Delete button', () => {
  const user = userEvent.setup();

  it('is not present on overview page', () => {
    const {stores, node} = initStore();
    render(<Options relativeJsonPath={[]} node={node} />, {
      providerProps: {value: stores},
    });
    expect(ContentUtils.options().deleteBtn()).not.toBeInTheDocument();
  });

  it('does not show up in readonly mode', async () => {
    const {stores, rootNode} = initStore({}, {readOnly: true});
    render(<Options relativeJsonPath={[]} node={rootNode} />, {
      providerProps: {value: stores},
    });
    expect(ContentUtils.options().deleteBtn()).not.toBeInTheDocument();
  });

  describe('on path', () => {
    it('can delete path', async () => {
      const deleteCb = jest.fn();
      const {stores, findNode} = initStore({
        paths: {'/user/abc': {post: {summary: 'Hello'}}},
      });
      const node = findNode.path('~1user~1abc');
      stores.uiStore.setActiveNode(node);
      render(
        <Options
          relativeJsonPath={node.relativeJsonPath}
          node={node}
          onDelete={deleteCb}
        />,
        {
          providerProps: {value: stores},
        },
      );
      expect(ContentUtils.options().deleteBtn()).toBeInTheDocument();
      await user.click(ContentUtils.options().deleteBtn());
      await user.click(ContentUtils.options().confirmDeleteBtn());
      expect(deleteCb).toHaveBeenCalledOnce();
      expect(stores.uiStore.activeNode.relativeJsonPath).toStrictEqual([
        'paths',
        '/user/abc',
      ]);
    });

    it('can delete path with multiple methods', async () => {
      const deleteCb = jest.fn();
      const {stores, findNode} = initStore({
        paths: {
          '/user/abc': {
            get: {summary: 'Hello GET'},
            post: {summary: 'Hello POST'},
          },
        },
      });
      const node = findNode.path('~1user~1abc/get');
      stores.uiStore.setActiveNode(node);
      render(
        <Options
          relativeJsonPath={node.relativeJsonPath}
          node={node}
          onDelete={deleteCb}
        />,
        {
          providerProps: {value: stores},
        },
      );
      expect(ContentUtils.options().deleteBtn()).toBeInTheDocument();
      await user.click(ContentUtils.options().deleteBtn());
      await user.click(ContentUtils.options().confirmDeleteBtn());
      expect(deleteCb).toHaveBeenCalledWith();
      expect(stores.uiStore.activeNode.relativeJsonPath).toStrictEqual([
        'paths',
        '/user/abc',
        'get',
      ]);
    });
  });
});
