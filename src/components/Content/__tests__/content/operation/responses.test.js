import React from 'react';
import {
  render,
  StoreCreator,
  userEvent,
  ContentUtils,
} from '../../../../../../test-utils';
import Responses from '../../../operation/Responses';
import {Classes} from '@blueprintjs/core';

jest.mock('../../../../../../app.config.js', () => {
  return {
    __esModule: true,
    ...{default: {store: {schema: {delay: 0}}}},
  };
});

let _schemaPath;
let _parameterPath;
let _parameterIn;
let _examplesPath;

let mockSchemaTestId = ContentUtils.MOCKSCHEMA_TESTID;

// eslint-disable-next-line react/display-name
jest.mock('../../../../Editor/JsonSchema', () => (e) => {
  _schemaPath = e.schemaPath;
  _examplesPath = e.examplesPath;
  return <div data-testid={mockSchemaTestId}>abc</div>;
});

jest.mock(
  '../../../../Editor/JsonSchema/OtherProperties/parameters',
  // eslint-disable-next-line react/display-name
  () => (e) => {
    _parameterPath = e.relativeJsonPath;
    _parameterIn = e.parameterIn;
    return <div data-testid="other-properties-button">def</div>;
  },
);

describe('Responses tests', () => {
  const user = userEvent.setup();
  let store, relativeJsonPath;

  beforeEach(async () => {
    const {stores, creator} = StoreCreator();
    const node = creator.createPath('/user/abc', {post: 'Hello'});
    stores.uiStore.setActiveNode(node);
    relativeJsonPath = node.relativeJsonPath.concat('responses');
    render(<Responses responsesPath={relativeJsonPath} />, {
      providerProps: {value: stores},
    });
    store = stores;
  });

  it('has default values', async () => {
    expect(ContentUtils.statusCodesButtons()).toHaveLength(0);
    expect(ContentUtils.addResponseButton()).toBeInTheDocument();
    expect(ContentUtils.deleteResponseButton()).not.toBeInTheDocument();
    expect(ContentUtils.statusCodeDropdown()).not.toBeInTheDocument();
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      default: {description: ''},
    });
  });

  it('add default 200 response', async () => {
    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(1);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.deleteResponseButton()).toBeInTheDocument();
    expect(ContentUtils.statusCodeDropdown()).toBeInTheDocument();
    expect(ContentUtils.responseBody().description()).toHaveValue('OK');

    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
    });
  });

  it('tests next status codes', async () => {
    // Tests next status code added to the previous ones
    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(1);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(2);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(3);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(ContentUtils.statusCodesButtons(2)).toHaveTextContent('400');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
      400: {description: 'Bad Request'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(4);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(ContentUtils.statusCodesButtons(2)).toHaveTextContent('400');
    expect(ContentUtils.statusCodesButtons(3)).toHaveTextContent('401');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
      400: {description: 'Bad Request'},
      401: {description: 'Unauthorized'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(5);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(ContentUtils.statusCodesButtons(2)).toHaveTextContent('400');
    expect(ContentUtils.statusCodesButtons(3)).toHaveTextContent('401');
    expect(ContentUtils.statusCodesButtons(4)).toHaveTextContent('403');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
      400: {description: 'Bad Request'},
      401: {description: 'Unauthorized'},
      403: {description: 'Forbidden'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(6);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(ContentUtils.statusCodesButtons(2)).toHaveTextContent('400');
    expect(ContentUtils.statusCodesButtons(3)).toHaveTextContent('401');
    expect(ContentUtils.statusCodesButtons(4)).toHaveTextContent('403');
    expect(ContentUtils.statusCodesButtons(5)).toHaveTextContent('404');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
      400: {description: 'Bad Request'},
      401: {description: 'Unauthorized'},
      403: {description: 'Forbidden'},
      404: {description: 'Not Found'},
    });

    await user.click(ContentUtils.addResponseButton());
    expect(ContentUtils.statusCodesButtons()).toHaveLength(7);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('200');
    expect(ContentUtils.statusCodesButtons(1)).toHaveTextContent('201');
    expect(ContentUtils.statusCodesButtons(2)).toHaveTextContent('400');
    expect(ContentUtils.statusCodesButtons(3)).toHaveTextContent('401');
    expect(ContentUtils.statusCodesButtons(4)).toHaveTextContent('403');
    expect(ContentUtils.statusCodesButtons(5)).toHaveTextContent('404');
    expect(ContentUtils.statusCodesButtons(6)).toHaveTextContent('500');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      200: {description: 'OK'},
      201: {description: 'Created'},
      400: {description: 'Bad Request'},
      401: {description: 'Unauthorized'},
      403: {description: 'Forbidden'},
      404: {description: 'Not Found'},
      500: {description: 'Internal Server Error'},
    });
  });

  describe('code suggestions', () => {
    beforeEach(async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.statusCodeDropdown());
    });

    it('can change filter code suggestions', async () => {
      await user.type(ContentUtils.statusCodeInput(), '200');
      // There is always "Add code" button to the suggestions, hence expected
      // dropdown count will be matching count + 1
      expect(ContentUtils.statusCodeSuggestions()).toHaveLength(2);
      expect(ContentUtils.createStatusCodeButton()).toBeInTheDocument();
    });

    it('has active code disabled in suggestions', async () => {
      await user.type(ContentUtils.statusCodeInput(), '20');
      expect(ContentUtils.statusCodeSuggestion(/200:/)).toHaveClass(
        Classes.DISABLED,
      );
      expect(ContentUtils.statusCodeSuggestion(/201:/)).not.toHaveClass(
        Classes.DISABLED,
      );
    });

    it('does not have create button on invalid code inputs', async () => {
      await user.type(ContentUtils.statusCodeInput(), '20');
      expect(ContentUtils.createStatusCodeButton()).not.toBeInTheDocument();
    });
  });

  it('can change status codes', async () => {
    await user.click(ContentUtils.addResponseButton());
    await user.click(ContentUtils.statusCodeDropdown());
    // await user.type(ContentUtils.statusCodeInput(), '201');
    await user.click(ContentUtils.statusCodeSuggestion(/201:/));
    expect(ContentUtils.statusCodesButtons()).toHaveLength(1);
    expect(ContentUtils.statusCodesButtons(0)).toHaveTextContent('201');
    expect(store).toHaveSchemaAt(relativeJsonPath, {
      201: {description: 'Created'},
    });
  });

  describe('body tests', () => {
    it('does not have content type without a body', async () => {
      await user.click(ContentUtils.addResponseButton());
      expect(ContentUtils.addResponseBodyButton(200)).toBeInTheDocument();
      expect(ContentUtils.contentTypeSelect(200)).not.toBeInTheDocument();
    });

    it('has default application/json content type', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseBodyButton(200));
      expect(ContentUtils.contentTypeSuggestionInput(200)).toHaveValue(
        'application/json',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveValue(
        'application/json',
      );
    });

    it('changes current content type on changing suggestion', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseBodyButton(200));
      await user.click(ContentUtils.contentTypeSuggestionInput(200));
      await ContentUtils.clickContentTypeInSuggest('application/xml', 200);
      expect(ContentUtils.contentTypeSelect(200)).toHaveValue(
        'application/xml',
      );
    });

    it('can add more content type', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseBodyButton(200)); // adds json
      await user.click(ContentUtils.addResponseBodyButton(200)); // adds xml
      // Adding more than 1 content type opens up suggestion box to choose
      expect(ContentUtils.getSuggestions()).toBeInTheDocument();
      await user.click(ContentUtils.addResponseBodyButton(200)); // adds formdata
      expect(ContentUtils.getSuggestions()).toBeInTheDocument();
      // await user.click(ContentUtils.contentTypeSuggestionInput(200));
      // await ContentUtils.clickContentTypeInSuggest('application/xml', 200);
      expect(ContentUtils.contentTypeSelect(200)).toHaveValue(
        'multipart/form-data',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'application/json',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'application/xml',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'multipart/form-data',
      );
    });

    it('can delete content type', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseBodyButton(200)); // adds json
      await user.click(ContentUtils.addResponseBodyButton(200)); // adds xml
      expect(ContentUtils.contentTypeSelect(200)).toHaveValue(
        'application/xml',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'application/json',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'application/xml',
      );
      await user.click(ContentUtils.deleteContentTypeButton());
      expect(ContentUtils.contentTypeSelect(200)).toHaveValue(
        'application/json',
      );
      expect(ContentUtils.contentTypeSelect(200)).toHaveTextContent(
        'application/json',
      );
      expect(ContentUtils.contentTypeSelect(200)).not.toHaveTextContent(
        'application/xml',
      );
    });

    it('has schema body', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseBodyButton(200));
      expect(ContentUtils.responseBody(200).mockSchema()).toBeInTheDocument();
      expect(_schemaPath).toStrictEqual([
        ...relativeJsonPath,
        '200',
        'content',
        'application/json',
        'schema',
      ]);
      expect(_examplesPath).toStrictEqual([
        ...relativeJsonPath,
        '200',
        'content',
        'application/json',
        'examples',
      ]);
    });

    it('can change description', async () => {
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.addResponseButton());
      await user.click(ContentUtils.statusCodesButtons(0));
      expect(ContentUtils.responseBody(200).description()).toHaveValue('OK');
      await user.clear(ContentUtils.responseBody(200).description());
      await user.type(ContentUtils.responseBody(200).description(), 'MyDes');
      expect(ContentUtils.responseBody(200).description()).toHaveValue('MyDes');
      expect(store).toHaveSchemaAt(relativeJsonPath, {
        200: {description: 'MyDes'},
        201: {description: 'Created'},
      });

      await user.click(ContentUtils.statusCodesButtons(1));
      await user.clear(ContentUtils.responseBody(201).description());
      await user.type(ContentUtils.responseBody(201).description(), 'MyDep');
      expect(ContentUtils.responseBody(201).description()).toHaveValue('MyDep');
      await user.click(ContentUtils.statusCodesButtons(0));
      expect(ContentUtils.responseBody(200).description()).toHaveValue('MyDes');
      expect(store).toHaveSchemaAt(relativeJsonPath, {
        200: {description: 'MyDes'},
        201: {description: 'MyDep'},
      });
    });

    describe('header tests', () => {
      it('maintains header rows on switching responses', async () => {
        await user.click(ContentUtils.addResponseButton());
        await user.click(ContentUtils.addResponseButton());
        await user.click(ContentUtils.statusCodesButtons(0));
        await user.click(ContentUtils.headers(200).addHeaderButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(2);
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
              'header-1': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          201: {
            description: 'Created',
          },
        });

        await user.click(ContentUtils.statusCodesButtons(1));
        expect(ContentUtils.headers(201).headerRows()).toHaveLength(0);
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
              'header-1': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
            },
          },
          201: {
            description: 'Created',
          },
        });
      });

      it('can add header', async () => {
        await user.click(ContentUtils.addResponseButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(0);
        await user.click(ContentUtils.headers(200).addHeaderButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(2);
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(ContentUtils.headers(200).headerRequiredInput(1)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
              'header-1': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });
      });

      it('can change header name', async () => {
        await user.click(ContentUtils.addResponseButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(0);
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(1);
        await user.clear(ContentUtils.headers(200).headerNameInput(0));
        await user.type(ContentUtils.headers(200).headerNameInput(0), 'Abc');
        await user.keyboard('{Tab}');
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              Abc: {
                description: '',
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });
      });

      it('can delete header', async () => {
        await user.click(ContentUtils.addResponseButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
              'header-1': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });

        await user.click(ContentUtils.headers(200).headerDeleteBtn(0));
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-1': {
                description: '',
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });
      });

      it('has validations', async () => {
        await user.click(ContentUtils.addResponseButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(_parameterPath).toStrictEqual([
          ...relativeJsonPath,
          '200',
          'headers',
          'header-0',
        ]);
        expect(_parameterIn).toBeUndefined();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });
      });

      it('can change header description', async () => {
        await user.click(ContentUtils.addResponseButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(0);
        await user.click(ContentUtils.headers(200).addHeaderButton());
        expect(ContentUtils.headers(200).headerRows()).toHaveLength(1);
        await user.clear(ContentUtils.headers(200).headerDescInput(0));
        await user.type(ContentUtils.headers(200).headerDescInput(0), 'Abc');
        await user.keyboard('{Tab}');
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: 'Abc',
                schema: {
                  type: 'string',
                },
              },
            },
          },
        });
      });

      it('can change header schema', async () => {
        await user.click(ContentUtils.addResponseButton());
        await user.click(ContentUtils.headers(200).addHeaderButton());
        await user.selectOptions(
          ContentUtils.headers(200).headerSchemaInput(0),
          'number',
        );
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'number',
                },
              },
            },
          },
        });

        await user.selectOptions(
          ContentUtils.headers(200).headerSchemaInput(0),
          'any',
        );
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {},
              },
            },
          },
        });

        await user.selectOptions(
          ContentUtils.headers(200).headerSchemaInput(0),
          'integer',
        );
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'integer',
                },
              },
            },
          },
        });

        await user.selectOptions(
          ContentUtils.headers(200).headerSchemaInput(0),
          'boolean',
        );
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'boolean',
                },
              },
            },
          },
        });

        await user.selectOptions(
          ContentUtils.headers(200).headerSchemaInput(0),
          'array',
        );
        expect(ContentUtils.headers(200).headerRequiredInput(0)).toBeDisabled();
        expect(store).toHaveSchemaAt(relativeJsonPath, {
          200: {
            description: 'OK',
            headers: {
              'header-0': {
                description: '',
                schema: {
                  type: 'array',
                },
              },
            },
          },
        });
      });
    });
  });
});
