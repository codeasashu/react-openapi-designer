import React from 'react';
import {
  screen,
  render,
  initStore,
  userEvent,
  SidebarUtils,
  SchemaUtils,
} from '../../../../test-utils';

import {NodeTypes} from '../../../datasets/tree';
import {Classes} from '@blueprintjs/core';
import Sidebar from '../Sidebar';
import {waitFor} from '@testing-library/dom';

describe('Sidebar tests', () => {
  const user = userEvent.setup();

  let _stores;

  beforeEach(() => {
    const {stores} = initStore();
    render(<Sidebar />, {
      providerProps: {value: stores},
    });
    _stores = stores;
  });

  it('renders sidebar menus', async () => {
    expect(SidebarUtils.menuitems()).toHaveLength(7);
    expect(SidebarUtils.menuitems(0)).toHaveTextContent('API Overview');
    expect(SidebarUtils.menuitems(1)).toHaveTextContent('Paths');
    expect(SidebarUtils.menuitems(2)).toHaveTextContent('Models');
    expect(SidebarUtils.menuitems(3)).toHaveTextContent('Request Bodies');
    expect(SidebarUtils.menuitems(4)).toHaveTextContent('Responses');
    expect(SidebarUtils.menuitems(5)).toHaveTextContent('Parameters');
    expect(SidebarUtils.menuitems(6)).toHaveTextContent('Examples');

    // Assert icons
    expect(
      SidebarUtils.menuitems(0).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'star');
    expect(
      SidebarUtils.menuitems(1).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
    expect(
      SidebarUtils.menuitems(2).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
    expect(
      SidebarUtils.menuitems(3).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
    expect(
      SidebarUtils.menuitems(4).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
    expect(
      SidebarUtils.menuitems(5).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
    expect(
      SidebarUtils.menuitems(6).querySelector(`.${Classes.ICON}`),
    ).toHaveAttribute('icon', 'folder-open');
  });

  describe('context menu tests', () => {
    it('does not have on overview', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(0),
      });
      expect(SidebarUtils.contextMenu()).not.toBeInTheDocument();
    });

    it('on paths', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(1);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('New Path');
    });

    it('on path item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('path'), '/user/abc{Enter}');
      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(2),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete path',
        );
        expect(SidebarUtils.contextMenuItems(2)).toHaveTextContent(
          'Delete Operation',
        );
      });
    });

    it('on models', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(1);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('New Model');
    });

    it('on model item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');

      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(3),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete model',
        );
      });
    });

    it('on request bodies', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(3),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(1);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent(
        'New Request Body',
      );
    });

    it('on request body item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(3),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('requestBody'), 'Abc{Enter}');

      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(4),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete requestBody',
        );
      });
    });

    it('on responses', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(4),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(1);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent(
        'New Response',
      );
    });

    it('on response item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(4),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('response'), 'Abc{Enter}');

      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(5),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete response',
        );
      });
    });

    it('on parameters', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(5),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(4);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent(
        'New Query parameter',
      );
      expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
        'New Path parameter',
      );
      expect(SidebarUtils.contextMenuItems(2)).toHaveTextContent(
        'New Header parameter',
      );
      expect(SidebarUtils.contextMenuItems(3)).toHaveTextContent(
        'New Cookie parameter',
      );
    });

    it('on parameter item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(5),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('parameter'), 'Abc{Enter}');
      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(6),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete parameter',
        );
      });

      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(5),
      });
      await user.click(SidebarUtils.contextMenuItems(1));
      await user.type(SidebarUtils.newItemInput('parameter'), 'Def{Enter}');
      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(7),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete parameter',
        );
      });

      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(5),
      });
      await user.click(SidebarUtils.contextMenuItems(2));
      await user.type(SidebarUtils.newItemInput('parameter'), 'Ghi{Enter}');
      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(8),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete parameter',
        );
      });

      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(5),
      });
      await user.click(SidebarUtils.contextMenuItems(3));
      await user.type(SidebarUtils.newItemInput('parameter'), 'Pqr{Enter}');
      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(9),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete parameter',
        );
      });
    });

    it('on examples', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(6),
      });
      expect(SidebarUtils.contextMenu()).toBeInTheDocument();
      expect(SidebarUtils.contextMenuItems()).toHaveLength(1);
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('New Example');
    });

    it('on example item', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(6),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('example'), 'Abc{Enter}');

      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(7),
        });
        expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
        expect(SidebarUtils.contextMenuItems(1)).toHaveTextContent(
          'Delete example',
        );
      });
    });
  });

  describe('height tests', () => {
    it('has correct height for path item', async () => {
      expect(SidebarUtils.menuitems(1)).toHaveStyle({top: '45px'});
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('path'), '/user{Enter}');
      expect(SidebarUtils.menuitems(2)).toHaveStyle({top: '75px'});
      expect(SidebarUtils.menuitems(3)).toHaveStyle({top: '125px'});
    });

    it('has correct height for model item', async () => {
      expect(SidebarUtils.menuitems(2)).toHaveStyle({top: '75px'});
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');
      expect(SidebarUtils.menuitems(3)).toHaveStyle({top: '105px'});
    });
  });

  describe('add new item', () => {
    it('on path', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      expect(SidebarUtils.newItemInput('path')).toHaveValue('');
      await user.type(SidebarUtils.newItemInput('path'), '/user/abc{Enter}');
      expect(SidebarUtils.menuitems()).toHaveLength(8);
      expect(SidebarUtils.menuitems(2)).toHaveTextContent('cba/resu/get');
      expect(_stores).toHaveSchemaAt(['paths'], {
        '/user/abc': {
          get: {
            operationId: 'get-user-abc',
            summary: 'Your GET endpoint',
            responses: {
              default: {
                description: '',
              },
            },
            tags: [],
          },
        },
      });
    });

    it('on model', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      expect(SidebarUtils.newItemInput('model')).toHaveValue('');
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');
      expect(SidebarUtils.menuitems()).toHaveLength(8);
      expect(SidebarUtils.menuitems(3)).toHaveTextContent('Abc');
      expect(_stores).toHaveSchemaAt(['components', 'schemas'], {
        Abc: {
          type: 'object',
          properties: {},
          title: 'Abc',
        },
      });
    });

    it('on requestBody', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(3),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      expect(SidebarUtils.newItemInput('requestBody')).toHaveValue('');
      await user.type(SidebarUtils.newItemInput('requestBody'), 'Abc{Enter}');
      expect(SidebarUtils.menuitems()).toHaveLength(8);
      expect(SidebarUtils.menuitems(4)).toHaveTextContent('Abc');

      expect(_stores).toHaveSchemaAt(['components', 'requestBodies'], {
        Abc: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      });
    });

    it('on response', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(4),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      expect(SidebarUtils.newItemInput('response')).toHaveValue('');
      await user.type(SidebarUtils.newItemInput('response'), 'Abc{Enter}');
      expect(SidebarUtils.menuitems()).toHaveLength(8);
      expect(SidebarUtils.menuitems(5)).toHaveTextContent('Abc');

      expect(_stores).toHaveSchemaAt(['components', 'responses'], {
        Abc: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      });
    });

    describe('on parameter', () => {
      it('on query parameter', async () => {
        // Query
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(5),
        });
        await user.click(SidebarUtils.contextMenuItems(0));
        expect(SidebarUtils.newItemInput('parameter')).toHaveValue('');
        await user.type(SidebarUtils.newItemInput('parameter'), 'Abc{Enter}');
        expect(SidebarUtils.menuitems()).toHaveLength(8);
        expect(SidebarUtils.menuitems(6)).toHaveTextContent('Abc');
        expect(SidebarUtils.menuitems(6)).toHaveTextContent('query');
        expect(_stores).toHaveSchemaAt(['components', 'parameters'], {
          Abc: {
            in: 'query',
            name: 'Abc',
            required: false,
            schema: {
              type: 'string',
            },
          },
        });

        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(5),
        });
        await user.click(SidebarUtils.contextMenuItems(1));
        await user.type(SidebarUtils.newItemInput('parameter'), 'Def{Enter}');
        expect(SidebarUtils.menuitems()).toHaveLength(9);
        expect(SidebarUtils.menuitems(7)).toHaveTextContent('Def');
        expect(SidebarUtils.menuitems(7)).toHaveTextContent('path');
        expect(_stores).toHaveSchemaAt(['components', 'parameters'], {
          Abc: {
            in: 'query',
            name: 'Abc',
            required: false,
            schema: {
              type: 'string',
            },
          },
          Def: {
            in: 'path',
            name: 'Def',
            required: true,
            schema: {
              type: 'string',
            },
          },
        });

        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(5),
        });
        await user.click(SidebarUtils.contextMenuItems(2));
        await user.type(SidebarUtils.newItemInput('parameter'), 'Pqr{Enter}');
        expect(SidebarUtils.menuitems()).toHaveLength(10);
        expect(SidebarUtils.menuitems(8)).toHaveTextContent('Pqr');
        expect(SidebarUtils.menuitems(8)).toHaveTextContent('header');
        expect(_stores).toHaveSchemaAt(['components', 'parameters'], {
          Abc: {
            in: 'query',
            name: 'Abc',
            required: false,
            schema: {
              type: 'string',
            },
          },
          Def: {
            in: 'path',
            name: 'Def',
            required: true,
            schema: {
              type: 'string',
            },
          },
          Pqr: {
            in: 'header',
            name: 'Pqr',
            required: false,
            schema: {
              type: 'string',
            },
          },
        });

        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(5),
        });
        await user.click(SidebarUtils.contextMenuItems(3));
        await user.type(SidebarUtils.newItemInput('parameter'), 'Xyz{Enter}');
        expect(SidebarUtils.menuitems()).toHaveLength(11);
        expect(SidebarUtils.menuitems(9)).toHaveTextContent('Xyz');
        expect(SidebarUtils.menuitems(9)).toHaveTextContent('cookie');
        expect(_stores).toHaveSchemaAt(['components', 'parameters'], {
          Abc: {
            in: 'query',
            name: 'Abc',
            required: false,
            schema: {
              type: 'string',
            },
          },
          Def: {
            in: 'path',
            name: 'Def',
            required: true,
            schema: {
              type: 'string',
            },
          },
          Pqr: {
            in: 'header',
            name: 'Pqr',
            required: false,
            schema: {
              type: 'string',
            },
          },
          Xyz: {
            in: 'cookie',
            name: 'Xyz',
            required: false,
            schema: {
              type: 'string',
            },
          },
        });
      });
    });
  });

  describe('rename child', () => {
    it('can rename model', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');

      await SchemaUtils.waitFor(100);
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(3),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.clear(SidebarUtils.newItemInput('model'));
      await user.type(SidebarUtils.newItemInput('model'), 'Def{Enter}');

      expect(_stores).toHaveSchemaAt(['components', 'schemas'], {
        Def: {
          type: 'object',
          properties: {},
          title: 'Abc',
        },
      });
    });

    it('can rename path', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('path'), '/user{Enter}');

      expect(_stores).toHaveSchemaAt(['paths'], {
        '/user': {
          get: {
            operationId: 'get-user',
            summary: 'Your GET endpoint',
            responses: {
              default: {
                description: '',
              },
            },
            tags: [],
          },
        },
      });
      await SchemaUtils.waitFor(100);
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      expect(SidebarUtils.contextMenuItems(0)).toHaveTextContent('Rename');
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.clear(SidebarUtils.newItemInput('path'));
      await user.type(SidebarUtils.newItemInput('path'), '/abc{Enter}');

      expect(_stores).toHaveSchemaAt(['paths'], {
        '/abc': {
          get: {
            operationId: 'get-user',
            summary: 'Your GET endpoint',
            responses: {
              default: {
                description: '',
              },
            },
            tags: [],
          },
        },
      });
    });
  });

  describe('delete child', () => {
    it('can delete model', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');

      await SchemaUtils.waitFor(100);
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(3),
      });
      await user.click(SidebarUtils.contextMenuItems(1));
      expect(_stores).toHaveSchemaAt(['components', 'schemas'], {});
    });

    it('can delete path', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('path'), '/user{Enter}');
      await SchemaUtils.waitFor(100);
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(1));

      expect(_stores).toHaveSchemaAt(['paths'], {});
    });

    it('can delete path operation', async () => {
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(1),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('path'), '/user{Enter}');
      await SchemaUtils.waitFor(100);

      expect(_stores).toHaveSchemaAt(['paths'], {
        '/user': {
          get: {
            operationId: 'get-user',
            summary: 'Your GET endpoint',
            responses: {
              default: {
                description: '',
              },
            },
            tags: [],
          },
        },
      });
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.hover(SidebarUtils.contextMenuItems(2));
      await waitFor(() => screen.getByText('GET'));
      expect(SidebarUtils.contextSubMenuItems(2, 0)).toHaveTextContent('GET');
      await user.click(SidebarUtils.contextSubMenuItems(2, 0));
      expect(_stores).toHaveSchemaAt(['paths'], {
        '/user': {},
      });
    });
  });

  describe('activeSymbol tests', () => {
    it('changes UI activeSymbolNode on item clicks', async () => {
      expect(_stores.uiStore.activeSymbolNode).toBeUndefined();
      await user.pointer({
        keys: '[MouseRight>]',
        target: SidebarUtils.menuitems(2),
      });
      await user.click(SidebarUtils.contextMenuItems(0));
      await user.type(SidebarUtils.newItemInput('model'), 'Abc{Enter}');
      await waitFor(async () => {
        await user.click(SidebarUtils.menuitems(3));
        expect(_stores.uiStore.activeSymbolNode.type).toBe(NodeTypes.Model);
        expect(_stores.uiStore.activeSymbolNode.uri).toBe(
          '/p/reference.yaml/components/schemas/Abc',
        );
      });

      await waitFor(async () => {
        await user.pointer({
          keys: '[MouseRight>]',
          target: SidebarUtils.menuitems(1),
        });
        await user.click(SidebarUtils.contextMenuItems(0));
        await user.type(SidebarUtils.newItemInput('path'), '/user{Enter}');
        await user.click(SidebarUtils.menuitems(2));
        expect(_stores.uiStore.activeSymbolNode.type).toBe(NodeTypes.Operation);
        expect(_stores.uiStore.activeSymbolNode.uri).toBe(
          '/p/reference.yaml/paths/~1user/get',
        );
      });

      await waitFor(async () => {
        await user.click(SidebarUtils.menuitems(4));
        expect(_stores.uiStore.activeSymbolNode.type).toBe(NodeTypes.Model);
        expect(_stores.uiStore.activeSymbolNode.uri).toBe(
          '/p/reference.yaml/components/schemas/Abc',
        );
      });
    });
  });
});
