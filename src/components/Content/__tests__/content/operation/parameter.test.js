import {Classes} from '@blueprintjs/core';
import React from 'react';
import {
  screen,
  userEvent,
  StoreCreator,
  ContentUtils,
  render,
} from '../../../../../../test-utils.js';
import Parameters from '../../../operation/parameters';

let _parameterPath;

jest.mock(
  '../../../../Editor/JsonSchema/OtherProperties/parameters',
  // eslint-disable-next-line react/display-name
  () => (e) => {
    _parameterPath = e.relativeJsonPath;
    return <div data-testid="other-properties-button">def</div>;
  },
);

describe('Parameters tests', () => {
  const user = userEvent.setup();
  let store, relativeJsonPath, _creator;

  beforeEach(async () => {
    const {stores, creator} = StoreCreator();
    const node = creator.createPath('/user/abc', {post: 'Hello'});
    stores.uiStore.setActiveNode(node);
    relativeJsonPath = node.relativeJsonPath.concat('parameters');
    render(<Parameters parametersPath={relativeJsonPath} />, {
      providerProps: {value: stores},
    });
    store = stores;
    _creator = creator;
  });

  it('has 4 buttons', async () => {
    expect(ContentUtils.parameters().addQueryBtn()).toBeInTheDocument();
    expect(ContentUtils.parameters().addSecurityBtn()).toBeInTheDocument();
    expect(ContentUtils.parameters().addCookieBtn()).toBeInTheDocument();
    expect(ContentUtils.parameters().addHeaderBtn()).toBeInTheDocument();
  });

  describe('Header parameters', () => {
    beforeEach(async () => {
      await user.click(ContentUtils.parameters().addHeaderBtn());
    });

    it('can add', async () => {
      expect(ContentUtils.parameters().headerRows()).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}},
      ]);
    });

    it('can change name', async () => {
      await user.type(ContentUtils.parameters().header(0).nameField(), 'Abc');
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().header(0).nameField()).toHaveValue(
        'Abc',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}, name: 'Abc'},
      ]);
      await user.clear(ContentUtils.parameters().header(0).nameField());
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().header(0).nameField()).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}, name: ''},
      ]);
    });

    it('can change description', async () => {
      await user.type(
        ContentUtils.parameters().header(0).descriptionField(),
        'Def',
      );
      await user.keyboard('{Tab}');
      expect(
        ContentUtils.parameters().header(0).descriptionField(),
      ).toHaveValue('Def');
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}, description: 'Def'},
      ]);

      await user.clear(ContentUtils.parameters().header(0).descriptionField());
      await user.keyboard('{Tab}');
      expect(
        ContentUtils.parameters().header(0).descriptionField(),
      ).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}, description: ''},
      ]);
    });

    it('can change schema', async () => {
      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'number',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'number'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'integer',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'integer'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'boolean',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'boolean'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'any',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'array',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'array'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().header(0).schemaInput(),
        'string',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}},
      ]);
    });

    it('can toggle required', async () => {
      await user.click(ContentUtils.parameters().header(0).requiredBtn());
      expect(ContentUtils.parameters().header(0).requiredBtn()).toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}, required: true},
      ]);

      await user.click(ContentUtils.parameters().header(0).requiredBtn());
      expect(ContentUtils.parameters().header(0).requiredBtn()).not.toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}},
      ]);
    });

    it('can has valid validations props', async () => {
      expect(_parameterPath).toStrictEqual([...relativeJsonPath, '0']);
    });

    it('can delete header', async () => {
      await user.click(ContentUtils.parameters().addHeaderBtn());
      await user.click(ContentUtils.parameters().addHeaderBtn());
      await user.click(ContentUtils.parameters().header(0).deleteBtn());
      expect(ContentUtils.parameters().headerRows()).toHaveLength(2);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}},
        {in: 'header', schema: {type: 'string'}},
      ]);
      await user.click(ContentUtils.parameters().header(0).deleteBtn());
      expect(ContentUtils.parameters().headerRows()).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'header', schema: {type: 'string'}},
      ]);
      // Deleting last element deletes the section
      await user.click(ContentUtils.parameters().header(0).deleteBtn());
      expect(screen.queryByLabelText('header')).not.toBeInTheDocument();
      expect(store).toHaveSchemaAt(relativeJsonPath, []);
    });
  });

  describe('Query parameters', () => {
    let rows;

    beforeEach(async () => {
      await user.click(ContentUtils.parameters().addQueryBtn());
      rows = ContentUtils.parameters().queryRows();
    });

    it('can add', async () => {
      expect(rows).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}},
      ]);
    });

    it('can change name', async () => {
      await user.type(ContentUtils.parameters().query(0).nameField(), 'Abc');
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().query(0).nameField()).toHaveValue('Abc');
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}, name: 'Abc'},
      ]);
      await user.clear(ContentUtils.parameters().query(0).nameField());
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().query(0).nameField()).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}, name: ''},
      ]);
    });

    it('can change description', async () => {
      await user.type(
        ContentUtils.parameters().query(0).descriptionField(),
        'Def',
      );
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().query(0).descriptionField()).toHaveValue(
        'Def',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}, description: 'Def'},
      ]);

      await user.clear(ContentUtils.parameters().query(0).descriptionField());
      await user.keyboard('{Tab}');
      expect(
        ContentUtils.parameters().query(0).descriptionField(),
      ).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}, description: ''},
      ]);
    });

    it('can change schema', async () => {
      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'number',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'number'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'integer',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'integer'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'boolean',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'boolean'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'any',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'array',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'array'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().query(0).schemaInput(),
        'string',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}},
      ]);
    });

    it('can toggle required', async () => {
      await user.click(ContentUtils.parameters().query(0).requiredBtn());
      expect(ContentUtils.parameters().query(0).requiredBtn()).toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}, required: true},
      ]);

      await user.click(ContentUtils.parameters().query(0).requiredBtn());
      expect(ContentUtils.parameters().query(0).requiredBtn()).not.toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}},
      ]);
    });

    it('can has valid validations props', async () => {
      expect(_parameterPath).toStrictEqual([...relativeJsonPath, '0']);
    });

    it('can delete query', async () => {
      await user.click(ContentUtils.parameters().addQueryBtn());
      await user.click(ContentUtils.parameters().addQueryBtn());
      await user.click(ContentUtils.parameters().query(0).deleteBtn());
      expect(ContentUtils.parameters().queryRows()).toHaveLength(2);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}},
        {in: 'query', schema: {type: 'string'}},
      ]);
      await user.click(ContentUtils.parameters().query(0).deleteBtn());
      expect(ContentUtils.parameters().queryRows()).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'query', schema: {type: 'string'}},
      ]);
      // Deleting last element deletes the section
      await user.click(ContentUtils.parameters().query(0).deleteBtn());
      expect(screen.queryByLabelText('query')).not.toBeInTheDocument();
      expect(store).toHaveSchemaAt(relativeJsonPath, []);
    });
  });

  describe('Cookie parameters', () => {
    let rows;

    beforeEach(async () => {
      await user.click(ContentUtils.parameters().addCookieBtn());
      rows = ContentUtils.parameters().cookieRows();
    });

    it('can add', async () => {
      expect(rows).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}},
      ]);
    });

    it('can change name', async () => {
      await user.type(ContentUtils.parameters().cookie(0).nameField(), 'Abc');
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().cookie(0).nameField()).toHaveValue(
        'Abc',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}, name: 'Abc'},
      ]);
      await user.clear(ContentUtils.parameters().cookie(0).nameField());
      await user.keyboard('{Tab}');
      expect(ContentUtils.parameters().cookie(0).nameField()).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}, name: ''},
      ]);
    });

    it('can change description', async () => {
      await user.type(
        ContentUtils.parameters().cookie(0).descriptionField(),
        'Def',
      );
      await user.keyboard('{Tab}');
      expect(
        ContentUtils.parameters().cookie(0).descriptionField(),
      ).toHaveValue('Def');
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}, description: 'Def'},
      ]);

      await user.clear(ContentUtils.parameters().cookie(0).descriptionField());
      await user.keyboard('{Tab}');
      expect(
        ContentUtils.parameters().cookie(0).descriptionField(),
      ).not.toHaveValue();
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}, description: ''},
      ]);
    });

    it('can change schema', async () => {
      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'number',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'number'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'integer',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'integer'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'boolean',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'boolean'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'any',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'array',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'array'}},
      ]);

      await user.selectOptions(
        ContentUtils.parameters().cookie(0).schemaInput(),
        'string',
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}},
      ]);
    });

    it('can toggle required', async () => {
      await user.click(ContentUtils.parameters().cookie(0).requiredBtn());
      expect(ContentUtils.parameters().cookie(0).requiredBtn()).toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}, required: true},
      ]);

      await user.click(ContentUtils.parameters().cookie(0).requiredBtn());
      expect(ContentUtils.parameters().cookie(0).requiredBtn()).not.toHaveClass(
        Classes.INTENT_WARNING,
      );
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}},
      ]);
    });

    it('can has valid validations props', async () => {
      expect(_parameterPath).toStrictEqual([...relativeJsonPath, '0']);
    });

    it('can delete cookie', async () => {
      await user.click(ContentUtils.parameters().addCookieBtn());
      await user.click(ContentUtils.parameters().addCookieBtn());
      await user.click(ContentUtils.parameters().cookie(0).deleteBtn());
      expect(ContentUtils.parameters().cookieRows()).toHaveLength(2);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}},
        {in: 'cookie', schema: {type: 'string'}},
      ]);
      await user.click(ContentUtils.parameters().cookie(0).deleteBtn());
      expect(ContentUtils.parameters().cookieRows()).toHaveLength(1);
      expect(store).toHaveSchemaAt(relativeJsonPath, [
        {in: 'cookie', schema: {type: 'string'}},
      ]);
      // Deleting last element deletes the section
      await user.click(ContentUtils.parameters().cookie(0).deleteBtn());
      expect(screen.queryByLabelText('cookie')).not.toBeInTheDocument();
      expect(store).toHaveSchemaAt(relativeJsonPath, []);
    });
  });

  describe('Security parameters', () => {
    let securityPath;

    beforeEach(() => {
      securityPath = [...relativeJsonPath.slice(0, -1), 'security'];
    });

    it('has context menu', async () => {
      await user.click(ContentUtils.parameters().addSecurityBtn());
      const contextMenuItems = ContentUtils.parameters()
        .security()
        .contextMenuItems();
      expect(contextMenuItems).toHaveLength(2);
      expect(contextMenuItems[0]).toHaveTextContent('Edit global security');
      expect(contextMenuItems[1]).toHaveTextContent(
        'Disable security for operation',
      );
      expect(store).toHaveSchemaAt(securityPath, null);
    });

    it('toggles security for operation', async () => {
      await user.click(ContentUtils.parameters().addSecurityBtn());
      expect(store).toHaveSchemaAt(securityPath, null);
      await user.click(
        ContentUtils.parameters().security().contextMenuItems(1),
      );
      expect(store).toHaveSchemaAt(securityPath, []);
      await user.click(ContentUtils.parameters().addSecurityBtn());
      await user.click(
        ContentUtils.parameters().security().contextMenuItems(1),
      );
      expect(
        ContentUtils.parameters().security().contextMenu(),
      ).toHaveTextContent('Remove NO security override');
      expect(store).toHaveSchemaAt(securityPath, null);
    });

    it('allows adding global security', async () => {
      // return stores.graphStore.graph.patchSourceNodeProp(parentNodeId, ["info"], operations);
      const navigationSpy = jest.spyOn(
        store.designTreeStore,
        'handleNodeClick',
      );
      await user.click(ContentUtils.parameters().addSecurityBtn());
      await user.click(
        ContentUtils.parameters().security().contextMenuItems(0),
      );
      const overviewNode = store.graphStore.getNodeByUri(
        '/p/reference.yaml/info',
      );
      expect(store).toHaveSchemaAt(securityPath, null);
      expect(navigationSpy).toHaveBeenCalledWith(overviewNode);
    });

    it('can add global security in operation', async () => {
      _creator.createSecurity('apiKey', 'Api Key-1');
      await user.click(ContentUtils.parameters().addSecurityBtn());
      const contextMenuItems = ContentUtils.parameters()
        .security()
        .contextMenuItems();
      expect(contextMenuItems).toHaveLength(3);
      expect(contextMenuItems[0]).toHaveTextContent('Edit global security');
      expect(contextMenuItems[1]).toHaveTextContent('Add operation security');
      expect(contextMenuItems[2]).toHaveTextContent(
        'Disable security for operation',
      );
      await user.click(contextMenuItems[1]);
      expect(
        ContentUtils.parameters().security().securitySelects(),
      ).toHaveLength(1);
      await user.click(
        ContentUtils.parameters().security().securityDeleteBtns(0),
      );
      expect(
        ContentUtils.parameters().security().securitySelects(),
      ).toHaveLength(0);
    });
  });
});
