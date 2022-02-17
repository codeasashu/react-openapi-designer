import React from 'react';
import {
  render,
  StoreCreator,
  userEvent,
  ContentUtils,
} from '../../../../../../test-utils';
import Options from '../../../options';

describe('Delete button', () => {
  const user = userEvent.setup();

  it('is not present on overview page', () => {
    const {stores} = StoreCreator();
    const node = stores.graphStore.getNodeByUri('/p/reference.yaml');
    stores.uiStore.setActiveNode(node);
    render(<Options relativeJsonPath={[]} node={node} />, {
      providerProps: {value: stores},
    });
    expect(ContentUtils.options().deleteBtn()).not.toBeInTheDocument();
  });

  describe('on path', () => {
    let _stores, relativeJsonPath;
    let deleteCb = jest.fn();
    beforeEach(() => {
      const {stores, creator} = StoreCreator();
      const node = creator.createPath('/user/abc', {post: 'Hello'});
      stores.uiStore.setActiveNode(node);
      relativeJsonPath = node.relativeJsonPath;
      render(
        <Options
          relativeJsonPath={relativeJsonPath}
          node={node}
          onDelete={deleteCb}
        />,
        {
          providerProps: {value: stores},
        },
      );
      _stores = stores;
    });

    it('can add tags to path', async () => {
      expect(ContentUtils.options().deleteBtn()).toBeInTheDocument();
      await user.click(ContentUtils.options().deleteBtn());
      await user.click(ContentUtils.options().confirmDeleteBtn());
      expect(deleteCb).toHaveBeenCalledOnce();
      expect(_stores.uiStore.activeNode.relativeJsonPath).toStrictEqual([
        'paths',
        '/user/abc',
        'post',
      ]);
    });
  });
});
