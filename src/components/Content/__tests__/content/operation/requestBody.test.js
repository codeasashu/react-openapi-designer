import React from 'react';
import {
  render,
  StoreCreator,
  userEvent,
  ContentUtils,
} from '../../../../../../test-utils';
import RequestBody from '../../../operation/requestBody';
// import SchemaDesigner from '../../../Editor/JsonSchema';

jest.mock('../../../../../../app.config.js', () => {
  return {
    __esModule: true,
    ...{default: {store: {schema: {delay: 0}}}},
  };
});

// jest.mock('../../../Editor/JsonSchema', () => {
//   const originalSchema = jest.requireActual('../../../Editor/JsonSchema');

//   return {
//     __esModule: true,
//     ...originalSchema,
//     default: () => jest.fn(<div>abc</div>),
//     // default: () => {
//     //   return <div data-testid="abcdef">This is the loader</div>;
//     // },
//   };
// });

let _schemaPath;
let _examplesPath;

let mockSchemaTestId = ContentUtils.MOCKSCHEMA_TESTID;

// eslint-disable-next-line react/display-name
jest.mock('../../../../Editor/JsonSchema', () => (e) => {
  _schemaPath = e.schemaPath;
  _examplesPath = e.examplesPath;
  return <div data-testid={mockSchemaTestId}>abc</div>;
});

describe('RequestBody tests', () => {
  const user = userEvent.setup();
  let store, relativeJsonPath, contentPath;

  beforeEach(async () => {
    const {stores, creator} = StoreCreator();
    const node = creator.createPath('/user/abc', {post: 'Hello'});
    stores.uiStore.setActiveNode(node);
    relativeJsonPath = node.relativeJsonPath.concat('requestBody');
    render(
      <RequestBody
        contentPath={relativeJsonPath.concat('content')}
        descriptionPath={relativeJsonPath.concat('description')}
      />,
      {
        providerProps: {value: stores},
      },
    );
    store = stores;
    contentPath = [...relativeJsonPath, 'content'];
  });

  it('has default values', async () => {
    expect(ContentUtils.requestBody().addBodyBtn()).toBeInTheDocument();
    expect(ContentUtils.requestBody().description()).not.toBeInTheDocument();
    expect(
      ContentUtils.requestBody().selectMediatype(),
    ).not.toBeInTheDocument();
    // Below 2 lines assert that schema designer has not been rendered
    expect(ContentUtils.requestBody().schemaDesigner()).not.toBeInTheDocument();
    await user.click(ContentUtils.requestBody().addBodyBtn());
    expect(ContentUtils.requestBody().description()).toBeInTheDocument();
    expect(ContentUtils.requestBody().selectMediatype()).toBeInTheDocument();
  });

  describe('content type tests', () => {
    beforeEach(async () => {
      await user.click(ContentUtils.requestBody().addBodyBtn());
    });

    it('add default json content type', async () => {
      expect(ContentUtils.requestBody().selectMediatype()).toHaveValue(
        'application/json',
      );
      expect(store).toHaveSchemaAt(contentPath, {
        'application/json': {schema: {type: 'object', properties: {}}},
      });
    });

    it('changes current content type on clicking suggestions', async () => {
      await user.click(ContentUtils.requestBody().suggestMediatypeInput());
      await ContentUtils.clickContentTypeInSuggest('application/xml');
      expect(ContentUtils.requestBody().selectMediatype()).toHaveValue(
        'application/xml',
      );
      expect(store).toHaveSchemaAt(contentPath, {
        'application/xml': {schema: {type: 'object', properties: {}}},
      });
    });

    it('can add more content type', async () => {
      await user.click(ContentUtils.requestBody().addBodyBtn()); // adds xml
      // Adding more than 1 content type opens up suggestion box to choose
      expect(ContentUtils.getSuggestions()).toBeInTheDocument();
      await user.click(ContentUtils.requestBody().addBodyBtn()); // adds formdata
      expect(ContentUtils.getSuggestions()).toBeInTheDocument();
      expect(ContentUtils.requestBody().selectMediatype()).toHaveValue(
        'multipart/form-data',
      );
      expect(ContentUtils.requestBody().selectMediatype()).toHaveTextContent(
        /application\/(xml|json)/,
      );
      expect(ContentUtils.requestBody().selectMediatype()).toHaveTextContent(
        'multipart/form-data',
      );
      expect(store).toHaveSchemaAt(contentPath, {
        'application/xml': {schema: {type: 'object', properties: {}}},
        'application/json': {schema: {type: 'object', properties: {}}},
        'multipart/form-data': {schema: {type: 'object', properties: {}}},
      });
    });

    it('can delete content type', async () => {
      await user.click(ContentUtils.requestBody().addBodyBtn()); // adds xml
      expect(store).toHaveSchemaAt(contentPath, {
        'application/xml': {schema: {type: 'object', properties: {}}},
        'application/json': {schema: {type: 'object', properties: {}}},
      });
      await user.click(ContentUtils.requestBody().deleteContentTypeButton());
      expect(store).toHaveSchemaAt(contentPath, {
        'application/json': {schema: {type: 'object', properties: {}}},
      });
      expect(ContentUtils.requestBody().selectMediatype()).toHaveValue(
        'application/json',
      );
      expect(ContentUtils.requestBody().selectMediatype()).toHaveTextContent(
        'application/json',
      );
      expect(
        ContentUtils.requestBody().selectMediatype(),
      ).not.toHaveTextContent('application/xml');
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('can add custom content type', async () => {
      await user.click(ContentUtils.requestBody().suggestMediatypeInput());
      // This won't propagate changes due to bug
      // See https://github.com/palantir/blueprint/issues/4165
      await user.type(
        ContentUtils.requestBody().suggestMediatypeInput(),
        'abcdef',
      );
      expect(ContentUtils.requestBody().selectMediatype()).toHaveTextContent(
        'abcdef',
      );
    });

    it('changes suggestion input on changing content type', async () => {
      expect(ContentUtils.requestBody().suggestMediatypeInput()).toHaveValue(
        'application/json',
      );
      await user.click(ContentUtils.requestBody().addBodyBtn()); // adds xml
      expect(
        ContentUtils.requestBody().suggestMediatypeInput(),
      ).toHaveAttribute('placeholder', 'application/xml');
    });
  });

  it('can change description', async () => {
    await user.click(ContentUtils.requestBody().addBodyBtn());
    await user.click(ContentUtils.requestBody().addBodyBtn());
    expect(ContentUtils.requestBody().description()).toHaveValue('');
    await user.clear(ContentUtils.requestBody().description());
    await user.type(ContentUtils.requestBody().description(), 'MyDes');
    expect(ContentUtils.requestBody().description()).toHaveValue('MyDes');
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'description'], 'MyDes');

    // descrption does not change on changing content type
    await user.selectOptions(
      ContentUtils.requestBody().selectMediatype(),
      'application/json',
    );
    expect(ContentUtils.requestBody().description()).toHaveValue('MyDes');
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'description'], 'MyDes');
  });

  it('has schema body', async () => {
    await user.click(ContentUtils.requestBody().addBodyBtn());
    expect(ContentUtils.requestBody().schemaDesigner()).toBeInTheDocument();
    expect(_schemaPath).toStrictEqual([
      ...contentPath,
      'application/json',
      'schema',
    ]);
    expect(_examplesPath).toStrictEqual([
      ...contentPath,
      'application/json',
      'examples',
    ]);
  });
});
