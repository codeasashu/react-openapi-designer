import React from 'react';
import {
  waitFor,
  render,
  initStore,
  userEvent,
  ContentUtils,
} from '../../../../../../test-utils';
import Options from '../../../options';

describe('Tags', () => {
  const user = userEvent.setup();

  describe('global tag', () => {
    let _stores;
    beforeEach(() => {
      const {stores, rootNode} = initStore();
      render(<Options relativeJsonPath={[]} node={rootNode} />, {
        providerProps: {value: stores},
      });
      _stores = stores;
    });

    it('can add tag', async () => {
      await user.click(ContentUtils.options().tagsBtn());
      await user.type(ContentUtils.options().tagSearchInput(), 'ab');
      await user.click(ContentUtils.options().tagSuggestOptions(0));
      await user.type(ContentUtils.options().tagSearchInput(), 'cc');
      await user.click(ContentUtils.options().tagSuggestOptions(0));
      expect(_stores).toHaveSchemaAt(['tags'], [{name: 'ab'}, {name: 'cc'}]);
    });
  });

  it('does not show up in readonly mode', async () => {
    const {stores, rootNode} = initStore({}, {readOnly: true});
    render(<Options relativeJsonPath={[]} node={rootNode} />, {
      providerProps: {value: stores},
    });
    expect(ContentUtils.options().tagsBtn()).not.toBeInTheDocument();
  });

  describe('empty tag', () => {
    let _stores;
    beforeEach(() => {
      const {stores, findNode} = initStore({
        paths: {'/user/abc': {post: {summary: 'Hello'}}},
      });
      const node = findNode.path('~1user~1abc');
      stores.uiStore.setActiveNode(node);
      render(<Options relativeJsonPath={node.relativeJsonPath} node={node} />, {
        providerProps: {value: stores},
      });
      _stores = stores;
    });
    it('shows empty global tags suggestions in path node', async () => {
      await user.click(ContentUtils.options().tagsBtn());
      await user.click(ContentUtils.options().tagSearchInput());
      await waitFor(
        () => {
          expect(ContentUtils.options().tagSuggestOptions(0)).toHaveTextContent(
            'No results.',
          );
        },
        {timeout: 1000},
      );
      // await SchemaUtils.waitFor(100);
    });

    describe('in multiple nodes', () => {
      beforeEach(async () => {
        await user.click(ContentUtils.options().tagsBtn());
        await user.type(ContentUtils.options().tagSearchInput(), 'ab');
        await user.click(ContentUtils.options().tagSuggestOptions(0));
        await user.type(ContentUtils.options().tagSearchInput(), 'cc');
        await user.click(ContentUtils.options().tagSuggestOptions(0));
      });

      it('shows global tags suggestions in path node', async () => {
        expect(_stores).toHaveSchemaAt(
          ['paths', '/user/abc', 'post', 'tags'],
          null,
        );
        await user.click(ContentUtils.options().tagsBtn());
        await user.click(ContentUtils.options().tagSearchInput());
        expect(ContentUtils.options().tagSuggestOptions(0)).toHaveTextContent(
          'ab',
        );
        expect(_stores).toHaveSchemaAt(
          ['paths', '/user/abc', 'post', 'tags'],
          null,
        );
      });
    });
  });

  describe('Path tags', () => {
    let _stores, relativeJsonPath;
    beforeEach(() => {
      const {stores, findNode} = initStore({
        paths: {'/user/abc': {post: {summary: 'Hello'}}},
      });
      const node = findNode.path('~1user~1abc');
      // const node = creator.createPath('/user/abc', {post: 'Hello'});
      stores.uiStore.setActiveNode(node);
      relativeJsonPath = node.relativeJsonPath;
      render(<Options relativeJsonPath={relativeJsonPath} node={node} />, {
        providerProps: {value: stores},
      });
      _stores = stores;
    });

    it('can add tags to path', async () => {
      expect(_stores).toHaveSchemaAt([...relativeJsonPath, 'tags'], null);
      await user.click(ContentUtils.options().tagsBtn());
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('');
      expect(ContentUtils.options().tagSearchInput()).toHaveValue('');
      // await user.click(ContentUtils.options().tagSearchInput());
      await user.type(ContentUtils.options().tagSearchInput(), 'ab');
      expect(ContentUtils.options().tagSuggestOptions(0)).toHaveTextContent(
        'Create "ab"',
      );
      // The tag is not selected by default
      expect(ContentUtils.options().tagSuggestOptions(0)).not.toHaveClass(
        'bp4-selected',
      );
      expect(_stores).toHaveSchemaAt([...relativeJsonPath, 'tags'], null);
      // await user.keyboard('{Enter}'); // This is not working due to bug with bp4 library
      await user.click(ContentUtils.options().tagSuggestOptions(0));
      expect(ContentUtils.options().tagsElements(0)).toHaveTextContent('ab');
      await user.click(ContentUtils.options().tagsBtn());

      // The tag is selected ater being clicked
      expect(ContentUtils.options().tagSuggestOptions(0)).toHaveClass(
        'bp4-selected',
      );
      expect(_stores).toHaveSchemaAt([...relativeJsonPath, 'tags'], ['ab']);
      await user.keyboard('{Esc}');
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('ab');
    });

    it('can remove tags from path', async () => {
      await user.click(ContentUtils.options().tagsBtn());
      await user.type(ContentUtils.options().tagSearchInput(), 'ab');
      await user.click(ContentUtils.options().tagSuggestOptions(0));
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('ab');

      await user.type(ContentUtils.options().tagSearchInput(), 'cd');
      await user.click(ContentUtils.options().tagSuggestOptions(0));
      expect(ContentUtils.options().tagsElements()).toHaveLength(2);
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('ab + 1');
      expect(_stores).toHaveSchemaAt(
        [...relativeJsonPath, 'tags'],
        ['ab', 'cd'],
      );
      await user.click(ContentUtils.options().tagsElementRemoveBtn(0));
      expect(_stores).toHaveSchemaAt([...relativeJsonPath, 'tags'], ['cd']);
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('cd');
      expect(ContentUtils.options().tagsElements()).toHaveLength(1);
      await user.click(ContentUtils.options().tagsElementRemoveBtn(0));
      expect(_stores).toHaveSchemaAt([...relativeJsonPath, 'tags'], []);
      expect(ContentUtils.options().tagsElements()).toHaveLength(0);
      expect(ContentUtils.options().tagsBtn()).toHaveTextContent('');
    });
  });
});
