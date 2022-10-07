import React from 'react';
import {render, initStore, ContentUtils} from '../../../../../../test-utils';
import Options from '../../../options';

describe('Other button', () => {
  describe('Sample buttons', () => {
    it('is not present on overview page', () => {
      const {stores, node} = initStore();
      render(<Options relativeJsonPath={[]} node={node} />, {
        providerProps: {value: stores},
      });
      expect(ContentUtils.options().samplesBtn()).not.toBeInTheDocument();
    });

    it('is not present on path page', () => {
      const {stores, findNode} = initStore({
        paths: {'/user/abc': {post: {summary: 'Hello'}}},
      });
      const node = findNode.path('~1user~1abc');
      stores.uiStore.setActiveNode(node);
      render(<Options relativeJsonPath={node.relativeJsonPath} node={node} />, {
        providerProps: {value: stores},
      });
      expect(ContentUtils.options().samplesBtn()).not.toBeInTheDocument();
    });

    it('is present on operation page', () => {
      const {stores, findNode} = initStore({
        paths: {'/user/abc': {post: {summary: 'Hello'}}},
      });
      const node = findNode.path('~1user~1abc/post');
      stores.uiStore.setActiveNode(node);
      render(<Options relativeJsonPath={node.relativeJsonPath} node={node} />, {
        providerProps: {value: stores},
      });
      expect(ContentUtils.options().samplesBtn()).toBeInTheDocument();
    });
  });
});
