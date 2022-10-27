/* eslint-disable no-undef */
import React from 'react';
import {get, isObject} from 'lodash';
import {render as rtlRender, within, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelNode from './src/Stores/nodes/modelNode';
import PathNode from './src/Stores/nodes/pathNode';
import {Classes as PopoverClasses} from '@blueprintjs/popover2';
import {Classes as CoreClasses} from '@blueprintjs/core';
import {NodeTypes, nodeOperations} from './src/datasets/tree';
import securitySchemes from './src/datasets/securitySchemes';
import Stores from './src/Stores';
import {StoresContext} from './src/components/Context';
import basicOasData from './__jest__/fixtures/basic.json';
import StorageStore, {StorageKind} from './src/Stores/storageStore';

//const schemaStoreObject = {
//reducer: {
//schema: schemaReducer,
//dropdown: dropdownReducer,
//},
//};

//jest.mock('monaco-editor/esm/vs/editor/editor.api.js');
//
// jest.mock()
Object.defineProperty(window, 'BlobEvent', {
  writable: true,
  value: jest
    .fn()
    .mockImplementation(
      (type, eventInitDict) => new Event(type, eventInitDict),
    ),
});

Object.defineProperty(window, 'open', {
  writable: false,
  value: jest.fn(),
});

const basicObjectSchema = {title: '', type: 'object'};

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

export {LocalStorageMock};

function getNodeByType(stores, nodeType) {
  const nodeUri = getNodeUriByType(nodeType);
  if (!nodeUri) return null;
  const node = stores.graphStore.getNodeByUri(nodeUri);
  return node || null;
}

function getNodeUriByType(nodeType) {
  switch (nodeType) {
    case NodeTypes.Paths:
      return '/p/reference.yaml/paths';
    case NodeTypes.Models:
      return '/p/reference.yaml/components/schemas';
    case NodeTypes.RequestBodies:
      return '/p/reference.yaml/components/requestBodies';
    case NodeTypes.Responses:
      return '/p/reference.yaml/components/responses';
    case NodeTypes.Parameters:
      return '/p/reference.yaml/components/parameters';
    case NodeTypes.Overview:
      return '/p/reference.yaml/info';
    default:
      return '/p/reference.yaml';
  }
}

const assertRow = (type, level, opts) => {
  if (['object', 'allOf', 'oneOf', 'anyOf'].includes(type)) {
    expect(SchemaUtils.addPropertyButton(level)).toBeInTheDocument();
  } else {
    expect(SchemaUtils.addPropertyButton(level)).not.toBeInTheDocument();
  }
  expect(SchemaUtils.collapseButton(level)).not.toBeInTheDocument();
  expect(SchemaUtils.selectPropertyField(level)).toHaveTextContent(type);
  expect(SchemaUtils.actionButtons.delete(level)).not.toBeDisabled();
  expect(SchemaUtils.actionButtons.required(level)).not.toBeDisabled();
  expect(SchemaUtils.actionButtons.duplicate(level)).not.toBeDisabled();
  if (opts?.moveUp) {
    expect(SchemaUtils.actionButtons.moveUp(level)).toBeEnabled();
  } else {
    expect(SchemaUtils.actionButtons.moveUp(level)).toBeDisabled();
  }
  if (opts?.moveDown) {
    expect(SchemaUtils.actionButtons.moveDown(level)).toBeEnabled();
  } else {
    expect(SchemaUtils.actionButtons.moveDown(level)).toBeDisabled();
  }
  if (type === '$ref') {
    expect(SchemaUtils.actionButtons.description(1)).toBeDisabled();
  } else {
    expect(SchemaUtils.actionButtons.description(1)).not.toBeDisabled();
  }
};

expect.extend({
  toHaveSchemaAt(stores, relativeJsonPath, schema) {
    const parsedData = stores.graphStore.rootNode.data.parsed;
    const expectedSchema = get(parsedData, relativeJsonPath, null);
    expect(expectedSchema).toStrictEqual(schema);
    return {
      message: () =>
        `expected schema ${this.utils.printReceived(
          schema,
        )} to match ${this.utils.printExpected(expectedSchema)}`,
      pass: true,
    };
  },
  toHaveObjectSchemaAt(stores, relativeJsonPath, schema) {
    expect(stores).toHaveSchemaAt(relativeJsonPath, {
      ...basicObjectSchema,
      ...schema,
    });
    return {
      message: () =>
        `expected object schema ${this.utils.printReceived(
          schema,
        )} to match schema`,
      pass: true,
    };
  },
  toHaveSchema(nodeContainer, schema) {
    const {stores, currentNode} = nodeContainer();
    const parsedData = stores.graphStore.rootNode.data.parsed;
    const expectedSchema = get(parsedData, currentNode.relativeJsonPath, null);
    expect(expectedSchema).toStrictEqual(schema);
    return {
      message: () =>
        `expected schema ${this.utils.printReceived(
          schema,
        )} to match ${this.utils.printExpected(expectedSchema)}`,
      pass: true,
    };
  },
  toHaveObjectSchema(nodeContainer, schema) {
    expect(nodeContainer).toHaveSchema({...basicObjectSchema, ...schema});
    return {
      message: () =>
        `expected object schema ${this.utils.printReceived(
          schema,
        )} to match schema`,
      pass: true,
    };
  },
  isObjectRow(level) {
    assertRow('object', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a object row`,
      pass: true,
    };
  },
  toHaveName(level, received) {
    expect(SchemaUtils.nameField(level)).toHaveValue(received);
    return {
      message: () =>
        `expected name for level ${this.utils.printReceived(
          level,
        )} does not match ${this.utils.printReceived(received)}`,
      pass: true,
    };
  },
  isStringRow(level, args) {
    assertRow('string', level, args);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a string row`,
      pass: true,
    };
  },
  isNumberRow(level) {
    assertRow('number', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a number row`,
      pass: true,
    };
  },
  isIntegerRow(level) {
    assertRow('integer', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a integer row`,
      pass: true,
    };
  },
  isBooleanRow(level) {
    assertRow('boolean', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a boolean row`,
      pass: true,
    };
  },
  isNullRow(level) {
    assertRow('null', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a null row`,
      pass: true,
    };
  },
  isRefRow(level) {
    assertRow('$ref', level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(level)} is not a $ref row`,
      pass: true,
    };
  },
  isArrayRow(level, subtype) {
    assertRow(`array[${subtype}]`, level);
    return {
      message: () =>
        `expected row ${this.utils.printReceived(
          level,
        )} is not a array[${subtype}] row`,
      pass: true,
    };
  },
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      this.arrayContaining([expect.objectContaining(argument)]),
    );

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received,
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received,
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

const SchemaUtils = {
  getSchemaRows: (index = null) => {
    const rows = screen.getAllByRole(/schema-row/);
    return index !== null ? rows[index] : rows;
  },
  waitFor: (timeout = 1000) => {
    return new Promise((r) => setTimeout(r, timeout));
  },
  nameField: (index) => {
    return within(SchemaUtils.getSchemaRows(index)).getByPlaceholderText(
      'name',
    );
  },
  descriptionField: () => {
    const popover = SchemaUtils.getPopoverOld();
    return popover.querySelector('textarea');
  },
  inputName: async (text, index, opts = {}) => {
    const user = userEvent.setup();
    const {clear = true, enter = false} = opts;
    if (clear) {
      await user.clear(SchemaUtils.nameField(index));
    }
    await user.type(SchemaUtils.nameField(index), text);
    if (!enter) {
      await user.click(SchemaUtils.getSchemaRows(index));
    } else {
      await user.keyboard('{Enter}');
    }
    // await waitFor(500);
  },
  inputDescription: async (text, index) => {
    const user = userEvent.setup();
    await user.type(SchemaUtils.descriptionField(), text);
    await user.click(SchemaUtils.getSchemaRows(index));
    // await waitFor(500); // Wait for 500ms
  },
  collapseButton: (index) => {
    return within(SchemaUtils.getSchemaRows(index)).queryByTestId(
      /row-collapse/,
    );
  },
  addPropertyButton: (index) => {
    const row = SchemaUtils.getSchemaRows(index);
    return row.querySelector(`.${CoreClasses.ICON}.${CoreClasses.ICON}-plus`);
  },
  getPopover: () => {
    return document.querySelector(`.${PopoverClasses.POPOVER2}`);
  },
  getPopoverOld: () => {
    return document.querySelector(`.${CoreClasses.POPOVER}`);
  },
  getSuggestPopover: () => {
    return document.querySelector(
      `.${PopoverClasses.POPOVER2}.bp4-suggest-popover`,
    );
  },
  clickSuggestion: async (optionName) => {
    const user = userEvent.setup();
    const suggestionPopover = SchemaUtils.getSuggestPopover();
    const option = within(suggestionPopover).getByRole('menuitem', {
      name: optionName,
    });
    await user.click(option);
  },
  actionButtons: {
    duplicate: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('duplicate-property-button');
    },
    delete: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('remove-property-button');
    },
    required: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('required-property-button');
    },
    description: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('description-property-button');
    },
    moveUp: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('move-property-up-button');
    },
    moveDown: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('move-property-down-button');
    },
    otherProperties: (index) => {
      const row = SchemaUtils.getSchemaRows(index);
      return within(row).getByTestId('other-properties-button');
    },
  },
  otherProperties: () => {
    const user = userEvent.setup();
    const popover = SchemaUtils.getPopover();
    return {
      user,
      popover,
      format: within(popover).getByTestId('extraProps-format'),
      default: within(popover).getByTestId('extraProps-default'),
      deprecated: within(popover).getByTestId('extraProps-deprecated'),
      behaviour: within(popover).getByTestId('extraProps-behavior'),
      enum: within(popover).getByTestId('extraProps-enum'),
      example: within(popover).getByTestId('extraProps-example'),
      pattern: within(popover).getByTestId('extraProps-pattern'),
      minLength: within(popover).getByTestId('extraProps-minLength'),
      maxLength: within(popover).getByTestId('extraProps-maxLength'),
    };
  },
  getProperties: (section) => {
    const popover = SchemaUtils.getPopover();
    let testid = 'property-type-selector-basic-section';
    switch (section) {
      case 'subtype':
        testid = 'property-type-selector-subtype-section';
        break;
      case 'combine':
        testid = 'property-type-selector-subtype-section';
        break;
      case 'ref':
        testid = 'property-type-selector-subtype-section';
        break;
    }
    return within(popover).getByTestId(testid);
  },
  selectPropertyField: (index) => {
    const row = SchemaUtils.getSchemaRows(index);
    return within(row).getByTestId(/select-property-type/);
  },
  selectPropertyType: async (
    index,
    name,
    section = 'type',
    multiple = false,
  ) => {
    const user = userEvent.setup();
    await user.click(SchemaUtils.selectPropertyField(index));
    await SchemaUtils.waitFor(10);
    const propertiesDiv = SchemaUtils.getProperties(section);
    if (!multiple) {
      // Deselected all selected properties
      const selectedProperties = within(propertiesDiv).getAllByRole(
        'checkbox',
        {checked: true},
      );
      for (let selectedProperty of selectedProperties) {
        await user.click(selectedProperty);
      }
    }
    await user.click(within(propertiesDiv).getByText(name));
  },
};

const ContentUtils = {
  MOCKSCHEMA_TESTID: 'mock_jsonschema',
  getSelectPopover: () => {
    return document.querySelector(
      `.${PopoverClasses.POPOVER2}.bp4-select-popover`,
    );
  },
  getResponsesContainer: () => {
    return screen.getByRole('responses');
  },
  addResponseButton: () => {
    return within(ContentUtils.getResponsesContainer()).getByRole(/button/, {
      name: 'Response',
    });
  },
  deleteResponseButton: () => {
    return within(ContentUtils.getResponsesContainer()).queryByRole(/button/, {
      name: 'Remove',
    });
  },
  statusCodeDropdown: () => {
    return within(ContentUtils.getResponsesContainer()).queryByRole(/combobox/);
  },
  statusCodesButtons: (index = -1) => {
    const codes = within(ContentUtils.getResponsesContainer()).queryAllByTestId(
      /code/,
    );
    if (index >= 0) {
      return codes[index];
    }
    return codes;
  },
  statusCodeInput: () => {
    return within(ContentUtils.getSelectPopover()).getByPlaceholderText(
      /add code/,
    );
  },
  statusCodeSuggestions: () => {
    return within(ContentUtils.getSelectPopover()).getAllByRole('menuitem');
  },
  statusCodeSuggestion: (statuscode) => {
    return within(ContentUtils.getSelectPopover()).getByRole('menuitem', {
      name: statuscode,
    });
  },
  createStatusCodeButton: () => {
    return within(ContentUtils.getSelectPopover()).queryByRole('menuitem', {
      name: /^Create(.*)$/i,
    });
  },
  contentTypeSelect: (code = 200) => {
    return within(ContentUtils.responseBody(code).container()).queryByTestId(
      'select-mediatype',
    );
  },
  getSuggestions: () => {
    return within(SchemaUtils.getSuggestPopover()).queryByRole('listbox');
  },
  clickContentTypeInSuggest: async (optionName) => {
    const user = userEvent.setup();
    const suggestionPopover = ContentUtils.getSuggestions();
    const option = within(suggestionPopover).getByRole('menuitem', {
      name: optionName,
    });
    await user.click(option);
  },
  contentTypeSuggestionInput: (code = 200) => {
    return within(ContentUtils.responseBody(code).container()).queryByTestId(
      'suggest-mediatype-input',
    );
  },
  addResponseBodyButton: (code = 200) => {
    const responseBody = ContentUtils.responseBody(code).container();
    return within(responseBody).getByRole('button', {name: 'Add Body'});
  },
  deleteContentTypeButton: (code = 200) => {
    return within(ContentUtils.responseBody(code).container()).getByRole(
      'button',
      {
        name: 'remove',
      },
    );
  },
  responseBody: (code = 200) => {
    const container = within(
      ContentUtils.getResponsesContainer(),
    ).queryByTestId(`response-${code}`);
    return {
      container: () => container,
      mockSchema: () =>
        within(ContentUtils.getResponsesContainer()).getByTestId(
          ContentUtils.MOCKSCHEMA_TESTID,
        ),
      description: () =>
        within(container).getByPlaceholderText(/Response description/),
    };
  },
  requestBody: () => {
    const container = screen.getByLabelText(/request-body/);
    return {
      addBodyBtn: () =>
        within(container).getByRole(/button/, {name: 'Add Body'}),
      description: () =>
        within(container).queryByPlaceholderText(/Request Body description/),
      selectMediatype: () =>
        within(container).queryByTestId('select-mediatype'),
      suggestMediatypeInput: () =>
        within(container).queryByTestId('suggest-mediatype-input'),
      schemaDesigner: () =>
        within(container).queryByTestId(ContentUtils.MOCKSCHEMA_TESTID),
      deleteContentTypeButton: () =>
        within(container).getByRole('button', {name: 'remove'}),
    };
  },
  parameters: () => {
    return {
      addSecurityBtn: () => screen.getByRole('button', {name: 'Security'}),
      addHeaderBtn: () => screen.getByRole('button', {name: 'Header'}),
      addQueryBtn: () => screen.getByRole('button', {name: 'Query Param'}),
      addCookieBtn: () => screen.getByRole('button', {name: 'Cookie'}),
      rows: (label, index = -1) => {
        const rows = within(screen.getByLabelText(label)).queryAllByRole(
          /listitem/,
        );
        return index >= 0 ? rows[index] : rows;
      },
      headerRows: (index = -1) =>
        ContentUtils.parameters().rows('header', index),
      queryRows: (index = -1) => ContentUtils.parameters().rows('query', index),
      cookieRows: (index = -1) =>
        ContentUtils.parameters().rows('cookie', index),
      header: (index = 0) => {
        const row = ContentUtils.parameters().rows('header', index);
        return {
          nameField: () => within(row).getByPlaceholderText(/Name/),
          descriptionField: () =>
            within(row).getByPlaceholderText(/Description/),
          schemaInput: () => within(row).getByRole(/combobox/),
          requiredBtn: () =>
            within(row).getByRole(/button/, {name: 'required'}),
          deleteBtn: () => within(row).getByRole(/button/, {name: 'delete'}),
        };
      },
      query: (index = 0) => {
        const row = ContentUtils.parameters().queryRows(index);
        return {
          nameField: () => within(row).getByPlaceholderText(/Name/),
          descriptionField: () =>
            within(row).getByPlaceholderText(/Description/),
          schemaInput: () => within(row).getByRole(/combobox/),
          requiredBtn: () =>
            within(row).getByRole(/button/, {name: 'required'}),
          deleteBtn: () => within(row).getByRole(/button/, {name: 'delete'}),
        };
      },
      cookie: (index = 0) => {
        const row = ContentUtils.parameters().cookieRows(index);
        return {
          nameField: () => within(row).getByPlaceholderText(/Name/),
          descriptionField: () =>
            within(row).getByPlaceholderText(/Description/),
          schemaInput: () => within(row).getByRole(/combobox/),
          requiredBtn: () =>
            within(row).getByRole(/button/, {name: 'required'}),
          deleteBtn: () => within(row).getByRole(/button/, {name: 'delete'}),
        };
      },
      security: () => {
        const container = within(screen.queryByLabelText('security'));
        return {
          contextMenu: () =>
            within(
              document.querySelector(
                `.${PopoverClasses.POPOVER2}.bp4-popover2-placement-right`,
              ),
            ).getByRole('menu'),
          contextMenuItems: (index = -1) => {
            const items = within(
              ContentUtils.parameters().security().contextMenu(),
            ).queryAllByRole('menuitem');
            return index === -1 ? items : items[index];
          },
          securitySelects: (index = -1) => {
            const selects = container.queryAllByRole(/combobox/);
            return index === -1 ? selects : selects[index];
          },
          securityDeleteBtns: (index = -1) => {
            const deleteBtns = container.queryAllByRole(/button/, {
              name: 'delete',
            });
            return index === -1 ? deleteBtns : deleteBtns[index];
          },
        };
      },
    };
  },
  headers: (code = 200) => {
    const container = within(
      ContentUtils.getResponsesContainer(),
    ).queryByTestId(`response-${code}`);
    return {
      addHeaderButton: () => within(container).getByTestId('add-header-btn'),
      headerRows: (index = -1) => {
        const rows = within(container).queryAllByTestId(/header-parameter/);
        return index >= 0 ? rows[index] : rows;
      },
      headerNameInput: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByPlaceholderText(/Name/);
      },
      headerDescInput: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByPlaceholderText(/Description/);
      },
      headerSchemaInput: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByRole(/combobox/);
      },
      headerRequiredInput: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByRole(/button/, {name: 'required'});
      },
      headerOtherPropsBtn: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByTestId(/other-properties-button/);
      },
      headerDeleteBtn: (index = 0) => {
        const row = ContentUtils.headers(code).headerRows(index);
        return within(row).getByRole(/button/, {name: 'delete'});
      },
    };
  },

  options: () => {
    const optionsContainer = document.querySelector('.PanelActionBar');

    return {
      tagsBtn: () => within(optionsContainer).queryByLabelText('tags'),
      tagsPopup: () =>
        document.querySelector(
          `.${PopoverClasses.POPOVER2}.bp4-popover2-placement-bottom .tag-suggest`,
        ),
      tagsSuggestPopup: () =>
        document.querySelector(
          `.${PopoverClasses.POPOVER2}.bp4-multi-select-popover`,
        ),
      tagSearchInput: () =>
        within(ContentUtils.options().tagsPopup()).getByRole(/textbox/),
      tagsElements: (index = -1) => {
        const tags = ContentUtils.options()
          .tagsPopup()
          .getElementsByClassName(CoreClasses.TAG);
        return index === -1 ? tags : tags[index];
      },
      tagsElementRemoveBtn: (index = 0) => {
        const tag = ContentUtils.options().tagsElements(index);
        return within(tag).getByRole(/button/, {name: 'Remove Tag'});
      },
      tagSuggestOptions: (index = -1) => {
        const rows = within(
          ContentUtils.options().tagsSuggestPopup(),
        ).getAllByRole(/menuitem/);
        return index === -1 ? rows : rows[index];
      },
      deleteBtn: () =>
        within(optionsContainer).queryByRole('button', {name: 'delete'}),
      confirmDeleteBtn: () =>
        within(optionsContainer).queryByRole('button', {name: 'Are you sure?'}),
      samplesBtn: () =>
        within(optionsContainer).queryByRole('button', {name: 'Samples'}),
    };
  },

  path: () => {
    const pathParamsContainer = screen.queryByTestId('path-params');
    return {
      methodTabs: () => screen.getAllByRole('tab'),
      methodTab: (name) => screen.getByRole('tab', {name}),
      activeMethodTab: () => screen.getByRole('tab', {selected: true}),
      operationTab: (method = 'get') =>
        screen.getByTestId(`operation-tabpanel-${method.toLowerCase()}`),
      pathInput: () => screen.getByLabelText('path'),
      pathParamsBtn: () => screen.getByRole('button', {name: 'path params'}),
      pathParamInputName: (level) => {
        const row = ContentUtils.path().pathParamRows(level);
        return within(row).getByRole('textbox', {name: 'name'});
      },
      addPathParamRowBtn: () =>
        within(pathParamsContainer).getByRole('button', {name: 'add row'}),
      removePathParamRowBtn: (level = 0) => {
        const row = ContentUtils.path().pathParamRows(level);
        return within(row).getByRole('button', {name: 'delete'});
      },
      pathParamRows: (level = -1) => {
        const rows = within(pathParamsContainer).queryAllByRole('listitem');
        return level === -1 ? rows : rows[level];
      },
      hostnameSelect: () => screen.getByRole('button', {name: /localhost/}),
      operationNameInput: () => screen.getByPlaceholderText('Operation Name'),
      addOperationBtn: (method = 'get') =>
        within(
          screen.getByRole(`operation-${method.toLowerCase()}`),
        ).queryByRole('button', {name: `${method.toUpperCase()} Operation`}),
    };
  },

  overview: () => {
    return {
      nameInput: () => screen.getByPlaceholderText('Name'),
      versionInput: () => screen.getByLabelText('version'),
      descriptionInput: () => screen.getByPlaceholderText(/API description/),
      addServerBtn: () => screen.getByRole('button', {name: 'add server'}),
      serverRows: (index = -1) => {
        const rows = screen.queryAllByTestId(/server-row-/);
        return index === -1 ? rows : rows[index];
      },
      serverRowsUrlInput: (index = 0) => {
        const row = ContentUtils.overview().serverRows(index);
        return within(row).getByRole(/textbox/, {name: 'server url'});
      },
      serverRowsNameInput: (index = 0) => {
        const row = ContentUtils.overview().serverRows(index);
        return within(row).getByRole(/textbox/, {name: 'server name'});
      },
      serverRowsDeleteBtn: (index = 0) => {
        const row = ContentUtils.overview().serverRows(index);
        return within(row).getByRole(/button/, {name: 'remove'});
      },
      addSecurityBtn: () => screen.getByRole('button', {name: 'add security'}),
      securityRows: (index = -1) => {
        const rows = screen.queryAllByTestId(/security-row-/);
        return index === -1 ? rows : rows[index];
      },
      securityRowTypeInput: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).getByRole(/combobox/, {name: 'security kind'});
      },
      securityRowKeyInput: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).getByRole(/textbox/, {name: 'key'});
      },
      securityRowNameInput: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).getByRole(/textbox/, {name: 'name'});
      },
      securityRowApiSecuritySelect: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).queryByRole(/combobox/, {name: 'api security'});
      },
      securityRowHttpSecuritySelect: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).queryByRole(/combobox/, {name: 'http security'});
      },
      securityRowDescriptionBtn: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).queryByRole(/button/, {name: 'add description'});
      },
      securityRowDescriptionInput: () => {
        return within(
          document.querySelector(
            `.${PopoverClasses.POPOVER2}.bp4-popover2-placement-left`,
          ),
        ).getByRole('textbox', {name: 'description'});
      },
      removeSecurityRowBtn: (index = 0) => {
        const row = ContentUtils.overview().securityRows(index);
        return within(row).getByRole('button', {name: 'delete'});
      },
      contactNameInput: () => screen.getByPlaceholderText(/Contact Name/),
      contactUrlInput: () => screen.getByPlaceholderText(/Contact Url/),
      contactEmailInput: () => screen.getByPlaceholderText(/Contact Email/),
      contactTosInput: () =>
        screen.getByPlaceholderText(/Terms of Service URL/),
      // license
      license: () => {
        const container = screen.getByTestId('license');
        return {
          nameInput: () => within(container).getByPlaceholderText(/License/),
          type: () => within(container).getByTestId('licenseKind'),
          url: () => within(container).getByTestId('licenseUrl'),
          identifier: () => within(container).getByTestId('licenseIdentifier'),
        };
      },
    };
  },
};

const SidebarUtils = {
  container: () => document.querySelector('.TreeList.SidebarTreeList'),
  menuitems: (index = -1) => {
    const items = within(SidebarUtils.container()).getAllByRole(/menuitem/);
    return index === -1 ? items : items[index];
  },
  contextMenu: () =>
    document.querySelector(
      `.${PopoverClasses.POPOVER2}.bp4-context-menu2-popover2`,
    ),
  contextMenuItems: (index = -1) => {
    const container = SidebarUtils.contextMenu();
    const items = within(container).getAllByRole(/menuitem/);
    return index === -1 ? items : items[index];
  },
  contextSubMenuItems: (index = 0, submenuindex = -1) => {
    const item = SidebarUtils.contextMenuItems(index)
      .closest('li')
      .querySelector(`.${CoreClasses.POPOVER}.bp4-submenu`);
    const items = within(item).getAllByRole(/menuitem/);
    return index === -1 ? items : items[submenuindex];
  },
  newItemInput: (name) => {
    const editItem = screen.getByRole(/edititem/, {name});
    return within(editItem).getByRole(/textbox/);
  },
};

function initStore(data = {}, options = {}) {
  if (!isObject(data)) {
    data = {};
  }
  data = {...basicOasData, ...data};

  const mockBrowserStore = {reloadWindow: jest.fn()};
  const storage = new StorageStore(
    {browserStore: mockBrowserStore},
    {storage: StorageKind.local},
  );
  storage.save(data);
  options = {...options, storage: StorageKind.local};
  const stores = new Stores(options);
  const rootNode = stores.graphStore.rootNode;

  const getData = (path) => {
    const parsedData = stores.graphStore.rootNode.data.parsed;
    return get(parsedData, path, null);
  };

  const findNode = {
    overview: () =>
      stores.graphStore.getNodeByUri(getNodeUriByType(NodeTypes.Overview)),
    path: (internalPath = '') => {
      const pathh = getNodeUriByType(NodeTypes.Paths) + '/' + internalPath;
      return stores.graphStore.getNodeByUri(pathh);
      // return pathh;
    },
  };

  return {stores, getNodeByType, rootNode, findNode, getData};
}

function StoreCreator(stores) {
  if (!stores || stores === undefined) {
    stores = new Stores();
  }

  let currentNode;

  const node = getNodeByType(stores, NodeTypes.Paths);
  const parentNodeId = node.parentSourceNode.id;

  const getParsedOasData = (stores, path) => {
    const parsedData = stores.graphStore.rootNode.data.parsed;
    return get(parsedData, path, null);
  };

  const creator = {
    createOverview: () => {
      return stores.graphStore.getNodeByUri('/p/reference.yaml');
    },
    createModel: (name) => {
      const modelNode = new ModelNode({name, parentNodeId});
      //eslint-disable-next-line no-unused-vars
      const [_, nodeId] = modelNode.create(stores.graphStore);
      return stores.graphStore.graph.getNodeById(nodeId);
    },

    createSecurity: (kind, name, props = {}) => {
      const value = {...securitySchemes[kind], ...props};
      const operations = [
        {
          op: nodeOperations.Add,
          path: ['components', 'securitySchemes'],
          value: {[name]: value},
        },
      ];

      const {activeSourceNode} = stores.uiStore;
      return stores.graphStore.graph.patchSourceNodeProp(
        activeSourceNode.id,
        'data.parsed',
        operations,
      );
    },

    createPath: (path, methods = {}) => {
      // const methods = Object.assign({
      //   get: 'Your GET endpoint ',
      //   ...methodOpts,
      // });
      const pathNode = new PathNode({path, parentNodeId, methods});
      //eslint-disable-next-line no-unused-vars
      const [_, nodeId] = pathNode.create(stores.graphStore);
      currentNode = stores.graphStore.graph.getNodeById(nodeId);
      return currentNode;
    },

    createRequestBody: (name) => {
      stores.oasStore.addSharedRequestBody({
        sourceNodeId: parentNodeId,
        name,
      });
      return stores.graphStore.graph.getNodeByUri(
        `/p/reference.yaml/components/requestBodies/${name}`,
      );
    },
    createResponse: (name) => {
      stores.oasStore.addSharedResponse({
        sourceNodeId: parentNodeId,
        name,
      });
      return stores.graphStore.graph.getNodeByUri(
        `/p/reference.yaml/components/responses/${name}`,
      );
    },
    createParameter: (name, paramType) => {
      stores.oasStore.addSharedParameter({
        sourceNodeId: parentNodeId,
        name,
        parameterType: paramType,
      });
      return stores.graphStore.graph.getNodeByUri(
        `/p/reference.yaml/components/parameters/${name}`,
      );
    },
  };

  const storeActions = {
    patchSourceNodeProp: (op, path, value) => {
      const sourceNode = stores.uiStore.activeSourceNode;
      const operation = {
        op,
        path,
        value,
      };
      stores.graphStore.graph.patchSourceNodeProp(
        sourceNode.id,
        'data.parsed',
        [operation],
      );
    },
  };

  const asserts = {
    oas: (relativeJsonPath, noexpect = false) => {
      const oasDoc = getParsedOasData(stores, relativeJsonPath);
      //eslint-disable-next-line no-undef
      return noexpect ? oasDoc : expect(oasDoc);
    },
  };

  const assertSchema = (schema, nodePath = null) => {
    if (!nodePath) {
      nodePath = currentNode.relativeJsonPath;
    }
    asserts.oas(nodePath).toStrictEqual(schema);
  };

  const assertBasicSchema = (schema = {}, nodePath = null) => {
    return assertSchema({...basicObjectSchema, ...schema}, nodePath);
  };

  const expectNode = () => {
    return {stores, currentNode};
  };

  const addSchema = () => {
    const model = creator.createModel('');
    stores.uiStore.setActiveNode(model);
    currentNode = stores.uiStore.activeNode;
    return currentNode;
  };

  return {
    stores,
    creator,
    addSchema,
    asserts,
    expectNode,
    storeActions,
    assertSchema,
    getParsedOasData,
    assertBasicSchema,
  };
}

function render(ui, {providerProps = null, ...renderOptions} = {}) {
  if (providerProps === null) {
    providerProps = {value: new Stores()};
  }
  // eslint-disable-next-line react/prop-types
  function Wrapper({children}) {
    return (
      <StoresContext.Provider {...providerProps}>
        {children}
      </StoresContext.Provider>
    );
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
}

// re-export everything
export * from '@testing-library/react';
// override render method
export {
  render,
  Stores,
  StoreCreator,
  userEvent,
  SchemaUtils,
  ContentUtils,
  SidebarUtils,
  basicOasData,
  initStore,
};
