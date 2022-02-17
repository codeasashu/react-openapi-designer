import React from 'react';
import {
  ContentUtils,
  render,
  userEvent,
  initStore,
} from '../../../../../../test-utils';
import Path from '../../../path';

let _operationPath, _operation;

const operationTestId = 'path-operation-111';
const otherPropertiesTestId = 'other-properties-222';

jest.mock(
  '../../../operation/operation',
  // eslint-disable-next-line react/display-name
  () => (e) => {
    _operation = e.operation;
    _operationPath = e.relativeJsonPath;
    return <div data-testid={operationTestId}>def</div>;
  },
);

let _parameterPath;

jest.mock(
  '../../../../Editor/JsonSchema/OtherProperties/parameters',
  // eslint-disable-next-line react/display-name
  () => (e) => {
    _parameterPath = e.relativeJsonPath;
    return <div data-testid={otherPropertiesTestId}>def</div>;
  },
);

describe('Path tests', () => {
  const user = userEvent.setup();
  let store, relativeJsonPath, rerender_node, _getParsedOasData;

  const re_renderer = (store, node, rerender) => {
    return () => {
      rerender(<Path relativeJsonPath={node.relativeJsonPath} node={node} />, {
        providerProps: {value: store},
      });
      return node;
    };
  };

  beforeEach(async () => {
    const {stores, findNode, getData} = initStore({
      paths: {'/user/abc': {post: {summary: 'Hello'}}},
    });
    const node = findNode.path('~1user~1abc/post');
    stores.uiStore.setActiveNode(node);
    relativeJsonPath = node.relativeJsonPath;
    const {rerender} = render(
      <Path relativeJsonPath={relativeJsonPath} node={node} />,
      {
        providerProps: {value: stores},
      },
    );
    rerender_node = re_renderer(store, node, rerender);
    store = stores;
    _getParsedOasData = getData;
  });

  it('has valid methods', async () => {
    expect(ContentUtils.path().methodTabs()).toHaveLength(8);
    expect(ContentUtils.path().methodTab('get')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('post')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('put')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('patch')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('delete')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('head')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('options')).toBeInTheDocument();
    expect(ContentUtils.path().methodTab('trace')).toBeInTheDocument();

    expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');
    expect(ContentUtils.path().pathParamsBtn()).toBeInTheDocument();
    expect(ContentUtils.path().hostnameSelect()).toBeInTheDocument();
    expect(ContentUtils.path().operationNameInput()).toHaveValue('Hello');
    expect(ContentUtils.path().operationTab('post')).toHaveClass('active');

    expect(relativeJsonPath).toStrictEqual(['paths', '/user/abc', 'post']);
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      summary: 'Hello',
    });
  });

  it('can change operation name', async () => {
    await user.clear(ContentUtils.path().operationNameInput(), 'Abc');
    await user.type(ContentUtils.path().operationNameInput(), 'Abc');
    expect(ContentUtils.path().operationNameInput()).toHaveValue('Abc');
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'summary'], 'Abc');
  });

  it('can switch methods', async () => {
    expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');
    let parsedData = _getParsedOasData(relativeJsonPath.slice(0, -1));
    expect(Object.keys(parsedData)).toStrictEqual(['post']);
    await user.click(ContentUtils.path().methodTab('get'));
    await user.click(ContentUtils.path().addOperationBtn('get'));
    // Get method has been added
    expect(ContentUtils.path().activeMethodTab()).toHaveTextContent('get');
    expect(ContentUtils.path().operationTab('get')).toHaveClass('active');
    expect(ContentUtils.path().operationTab('post')).not.toHaveClass('active');
    expect(store).toHaveSchemaAt([...relativeJsonPath.slice(0, -1), 'get'], {
      operationId: 'get-user-abc',
      responses: {200: {description: 'OK'}},
      summary: '',
    });
    parsedData = _getParsedOasData(relativeJsonPath.slice(0, -1));
    expect(Object.keys(parsedData)).toStrictEqual(['post', 'get']);
    expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');

    await user.click(ContentUtils.path().methodTab('post'));
    expect(ContentUtils.path().operationTab('get')).not.toHaveClass('active');
    expect(ContentUtils.path().operationTab('post')).toHaveClass('active');
    parsedData = _getParsedOasData(relativeJsonPath.slice(0, -1));
    expect(Object.keys(parsedData)).toStrictEqual(['post', 'get']);
    expect(store).toHaveSchemaAt([...relativeJsonPath.slice(0, -1), 'get'], {
      operationId: 'get-user-abc',
      responses: {200: {description: 'OK'}},
      summary: '',
    });
    expect(store).toHaveSchemaAt([...relativeJsonPath.slice(0, -1), 'post'], {
      summary: 'Hello',
    });

    // Changing methods should not change url in path input
    expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');
  });

  it('renders operation component with correct props', async () => {
    expect(_operationPath).toStrictEqual(['paths', '/user/abc', 'post']);
    expect(_operation).toStrictEqual({
      summary: 'Hello',
    });
  });

  describe('path params tests', () => {
    let _node, parsedData;

    it('render other properties', async () => {
      await user.click(ContentUtils.path().pathParamsBtn());
      await user.click(ContentUtils.path().addPathParamRowBtn());
      expect(_parameterPath).toStrictEqual([
        'paths',
        '/user/abc',
        'parameters',
        0,
      ]);
      await user.click(ContentUtils.path().addPathParamRowBtn());
      expect(_parameterPath).toStrictEqual([
        'paths',
        '/user/abc',
        'parameters',
        1,
      ]);
    });

    it('adds path params', async () => {
      // Expect post is selected and add GET too in the current path node
      // so that we can assert later that the methods don't get affected
      // by changing path params
      expect(ContentUtils.path().operationTab('post')).toHaveClass('active');
      await user.click(ContentUtils.path().methodTab('get'));
      await user.click(ContentUtils.path().addOperationBtn('get'));

      expect(
        ContentUtils.path().addOperationBtn('get'),
      ).not.toBeInTheDocument();
      await user.click(ContentUtils.path().methodTab('post'));
      expect(
        ContentUtils.path().addOperationBtn('post'),
      ).not.toBeInTheDocument();

      await user.click(ContentUtils.path().pathParamsBtn());
      await user.click(ContentUtils.path().addPathParamRowBtn());
      expect(ContentUtils.path().pathParamRows()).toHaveLength(1);
      await user.click(ContentUtils.path().addPathParamRowBtn());
      expect(ContentUtils.path().pathParamRows()).toHaveLength(2);
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');

      parsedData = _getParsedOasData(relativeJsonPath.slice(0, -2));
      expect(Object.keys(parsedData)).toStrictEqual(['/user/abc']);

      await user.type(ContentUtils.path().pathParamInputName(0), 'a');
      await user.keyboard('{Tab}');
      // Since changing path params updates current rendered path, rerender
      _node = rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc/{a}');
      parsedData = _getParsedOasData(relativeJsonPath.slice(0, -2));
      expect(Object.keys(parsedData)).toStrictEqual(['/user/abc/{a}']);
      expect(store).toHaveSchemaAt(
        [..._node.relativeJsonPath.slice(0, -1), 'parameters'],
        [
          {in: 'path', name: 'a', required: true, schema: {type: 'string'}},
          {in: 'path', name: '', required: true, schema: {type: 'string'}},
        ],
      );

      expect(ContentUtils.path().operationTab('post')).toHaveClass('active');
      await user.click(ContentUtils.path().methodTab('get'));
      expect(
        ContentUtils.path().addOperationBtn('get'),
      ).not.toBeInTheDocument();
      await user.click(ContentUtils.path().methodTab('post'));
      expect(
        ContentUtils.path().addOperationBtn('post'),
      ).not.toBeInTheDocument();

      await user.type(ContentUtils.path().pathParamInputName(1), 'bc');
      await user.keyboard('{Tab}');
      _node = rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc/{a}/{bc}');
      parsedData = _getParsedOasData(relativeJsonPath.slice(0, -2));
      expect(Object.keys(parsedData)).toStrictEqual(['/user/abc/{a}/{bc}']);
      expect(ContentUtils.path().operationTab('post')).toHaveClass('active');
      await user.click(ContentUtils.path().methodTab('get'));
      expect(
        ContentUtils.path().addOperationBtn('get'),
      ).not.toBeInTheDocument();
      await user.click(ContentUtils.path().methodTab('post'));
      expect(
        ContentUtils.path().addOperationBtn('post'),
      ).not.toBeInTheDocument();
      expect(store).toHaveSchemaAt(
        [..._node.relativeJsonPath.slice(0, -1), 'parameters'],
        [
          {in: 'path', name: 'a', required: true, schema: {type: 'string'}},
          {in: 'path', name: 'bc', required: true, schema: {type: 'string'}},
        ],
      );

      await user.click(ContentUtils.path().removePathParamRowBtn(1));
      _node = rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc/{a}');
      expect(ContentUtils.path().pathParamRows()).toHaveLength(1);
      expect(store).toHaveSchemaAt(
        [..._node.relativeJsonPath.slice(0, -1), 'parameters'],
        [{in: 'path', name: 'a', required: true, schema: {type: 'string'}}],
      );

      await user.click(ContentUtils.path().removePathParamRowBtn(0));
      rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');
      // The tabs exists and both methods do not have "Add operation" buttons
      // meaning they have existing operation body
      expect(ContentUtils.path().operationTab('post')).toHaveClass('active');
      await user.click(ContentUtils.path().methodTab('get'));
      expect(
        ContentUtils.path().addOperationBtn('get'),
      ).not.toBeInTheDocument();
      await user.click(ContentUtils.path().methodTab('post'));
      expect(
        ContentUtils.path().addOperationBtn('post'),
      ).not.toBeInTheDocument();
      expect(store).toHaveSchemaAt(
        [...relativeJsonPath.slice(0, -1), 'parameters'],
        [],
      );
    });

    it('cannot add empty path params', async () => {
      await user.click(ContentUtils.path().pathParamsBtn());

      // Add 3 blank param rows
      await user.click(ContentUtils.path().addPathParamRowBtn());
      await user.click(ContentUtils.path().addPathParamRowBtn());
      await user.click(ContentUtils.path().addPathParamRowBtn());
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');
      // await user.type(ContentUtils.path().pathParamInputName(0), 'a');
      await user.keyboard('{Tab}');
      rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc');

      await user.type(ContentUtils.path().pathParamInputName(1), 'bc');
      await user.keyboard('{Tab}');
      rerender_node();
      expect(ContentUtils.path().pathInput()).toHaveValue('/user/abc/{bc}');

      const parsedData = _getParsedOasData(relativeJsonPath.slice(0, -2));
      expect(Object.keys(parsedData)).toStrictEqual(['/user/abc/{bc}']);
    });
  });

  it('matches snapshot', async () => {
    const {stores, findNode} = initStore({
      paths: {'/user/abc': {post: {summary: 'Hello'}}},
    });
    const node = findNode.path('~1user~1abc');
    stores.uiStore.setActiveNode(node);
    const {asFragment} = render(
      <Path relativeJsonPath={node.relativeJsonPath} node={node} />,
      {
        providerProps: {value: stores},
      },
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
