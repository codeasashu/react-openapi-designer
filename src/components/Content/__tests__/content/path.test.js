import React from 'react';
import userEvent from '@testing-library/user-event';
import {fireEvent, prettyDOM} from '@testing-library/dom';
import {
  act,
  render,
  screen,
  StoreCreator,
  within,
} from '../../../../../test-utils';
import Content from '../../index';

describe('Path content test', () => {
  const getTitleNode = () => screen.getByPlaceholderText(/Operation Name/);
  const getMethodTabs = () => screen.getAllByRole(/tab/);
  const getPathNameNode = () => screen.getByLabelText(/path/);
  const getOperationNode = (method) => screen.getByRole(`operation-${method}`);
  const getParameters = (method, paramType) => {
    return (
      within(getOperationNode(method)).queryAllByLabelText(paramType) || []
    );
  };

  const getParamInput = (method, paramType) => {
    const inpContainer = within(
      within(getOperationNode(method)).getByLabelText(paramType),
    );
    return {
      name: inpContainer.getByPlaceholderText(/Name/),
    };
  };

  const getRequestBodyNode = () => screen.getByLabelText(/request-body/);
  const getResponseStatusNode = () =>
    screen.getByLabelText(/response-statuscode/);

  const assertTitle = (expected) => {
    expect(getTitleNode()).toHaveValue(expected);
  };

  const assertMethodName = (expected) => {
    const methodTabNodes = getMethodTabs();
    const activeMethodNode = methodTabNodes.find((tabNode) => {
      return tabNode.classList.contains('selected-tab');
    });
    expect(activeMethodNode).toHaveTextContent(expected);
  };

  const assertPathName = (expected) => {
    expect(getPathNameNode()).toHaveValue(expected);
  };

  const assertOperationId = (method, expected) => {
    expect(
      within(getOperationNode(method)).getByRole(/operation-id/),
    ).toHaveTextContent(expected);
  };

  const assertDescription = (method, expected) => {
    expect(
      within(getOperationNode(method)).getByPlaceholderText(
        /Endpoint description.../,
      ),
    ).toHaveTextContent(expected);
  };

  const assertParameterLength = (method, paramType, expected) => {
    const params = getParameters(method, paramType);
    expect(params).toHaveLength(expected);
  };

  const assertBody = (method) => {
    const requestBodyNode = getRequestBodyNode();
    const descriptionNode =
      within(requestBodyNode).getByPlaceholderText(/description/);
    const schemaRows = within(requestBodyNode).getAllByRole(/schema-row/);
    return {
      description: (expected) => {
        expect(descriptionNode).toHaveValue(expected);
      },
      schemaRowLength: (expected) => {
        expect(schemaRows).toHaveLength(expected);
      },
    };
  };

  const assertResponseStatusCode = (codes = []) => {
    expect(within(getResponseStatusNode()).getAllByRole(/button/)).toHaveLength(
      codes.length + 1, // 1 for "Add response button" + length of existing status code
    );
  };

  const assertParameter = async (method, paramType, targetJson) => {};

  it('tests default created schema', async () => {
    const {stores, creator, asserts} = StoreCreator();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    const {container, asFragment} = render(<Content />, {
      providerProps: {value: stores},
    });

    expect(asFragment).toMatchSnapshot();
    assertTitle('Your GET endpoint');
    assertMethodName('get');
    assertPathName('/user/abc');
    assertOperationId('get', 'get-user-abc');
    assertDescription('get', '');
    assertParameterLength('get', 'header', 0);
    assertParameterLength('get', 'query', 0);
    assertParameterLength('get', 'security', 0);
    assertParameterLength('get', 'cookie', 0);
    assertResponseStatusCode([]);
    expect(screen.queryByPlaceholderText(/Response description/)).toBeNull();
    const doc = asserts.oas(path.relativeJsonPath, true);
    expect(doc).toStrictEqual({
      operationId: 'get-user-abc',
      responses: {},
      summary: 'Your GET endpoint',
      tags: [],
    });
  });

  it('can change summary of path', async () => {
    const {stores, creator, asserts} = StoreCreator();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    const {container} = render(<Content />, {providerProps: {value: stores}});
    assertTitle('Your GET endpoint');
    await act(async () => {
      await fireEvent.change(getTitleNode(), {
        target: {value: 'Abcd'},
      });
    });
    assertTitle('Abcd');
    const doc = asserts.oas(path.relativeJsonPath, true);
    expect(doc).toStrictEqual({
      operationId: 'get-user-abc',
      responses: {},
      summary: 'Abcd',
      tags: [],
    });
  });

  it('can add parameters to path', async () => {
    const {stores, creator, asserts} = StoreCreator();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    const {container} = render(<Content />, {providerProps: {value: stores}});
    act(() => {
      fireEvent.click(screen.getByRole(/header/, {text: 'Header'}));
    });

    assertParameterLength('get', 'header', 1);
    assertParameterLength('get', 'query', 0);
    assertParameterLength('get', 'security', 0);
    assertParameterLength('get', 'cookie', 0);

    expect(asserts.oas(path.relativeJsonPath, true)).toStrictEqual({
      operationId: 'get-user-abc',
      parameters: [
        {
          in: 'header',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {},
      summary: 'Your GET endpoint',
      tags: [],
    });

    // Assert Header param
    await act(async () => {
      await fireEvent.change(getParamInput('get', 'header').name, {
        target: {value: 'Abcd'},
      });
      fireEvent.focusOut(getParamInput('get', 'header').name);
    });
    expect(
      asserts.oas(path.relativeJsonPath.concat('parameters'), true),
    ).toContainObject({
      in: 'header',
      name: 'Abcd',
      schema: {
        type: 'string',
      },
    });
    assertParameterLength('get', 'header', 1);

    //Add query parameters
    act(() => {
      fireEvent.click(screen.getByRole(/query/, {text: /Query/}));
    });

    await act(async () => {
      await fireEvent.change(getParamInput('get', 'query').name, {
        target: {value: 'ppp'},
      });
      fireEvent.focusOut(getParamInput('get', 'query').name);
    });

    expect(
      asserts.oas(path.relativeJsonPath.concat('parameters'), true),
    ).toContainObject({
      in: 'query',
      name: 'ppp',
      schema: {
        type: 'string',
      },
    });
    assertParameterLength('get', 'header', 1);
  });

  it('can add request body', async () => {
    const {stores, creator, asserts} = StoreCreator();
    const path = creator.createPath('/user/abc');
    stores.uiStore.setActiveNode(path);
    render(<Content />, {providerProps: {value: stores}});
    const requestBodyNode = getRequestBodyNode();
    const addBtn = within(requestBodyNode).getByRole(/button/, {
      name: /Add Body/,
    });
    act(() => {
      fireEvent.click(addBtn);
    });
    expect(
      within(requestBodyNode).getByPlaceholderText(/description/),
    ).toHaveValue('');
    const schemaRows = within(requestBodyNode).getAllByRole(/schema-row/);
    expect(schemaRows).toHaveLength(1);
    expect(schemaRows[0]).toHaveTextContent(/object/);
    expect(
      within(requestBodyNode).getByPlaceholderText(/Create or choose existing/),
    ).toHaveValue('application/json');
    expect(within(requestBodyNode).getByRole(/combobox/)).toHaveValue(
      'application/json',
    );
    expect(
      asserts.oas(path.relativeJsonPath.concat('requestBody'), true),
    ).toStrictEqual({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    });
  });

  describe('Responses', () => {
    it('does not have responses node by default', () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});
      const responseStatusNode = getResponseStatusNode();
      const responsesNode = screen.getByRole(/responses/);
      expect(responsesNode.querySelectorAll('.response').length).toBe(0);
      expect(
        within(responseStatusNode).queryByRole(/button/, {
          name: /200/,
        }),
      ).toBeNull();
    });

    it('can add responses', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      render(<Content />, {providerProps: {value: stores}});
      const responseStatusNode = getResponseStatusNode();
      const responsesNode = screen.getByRole(/responses/);
      const addBtn = within(responseStatusNode).getByRole(/button/, {
        name: /Response/,
      });
      act(() => {
        fireEvent.click(addBtn);
      });
      expect(
        Object.keys(
          asserts.oas(path.relativeJsonPath.concat('responses'), true),
        ),
      ).toStrictEqual(['200']);

      expect(
        within(responsesNode).getByPlaceholderText(/description/),
      ).toHaveValue('');

      expect(
        within(responseStatusNode).getByRole(/button/, {
          name: /200/,
        }),
      ).toBeInTheDocument();

      const addBodyBtn = within(responsesNode).getByRole(/button/, {
        name: /Add Body/,
      });
      act(() => {
        fireEvent.click(addBodyBtn);
      });

      const schemaRows = within(responsesNode).getAllByRole(/schema-row/);
      expect(schemaRows).toHaveLength(1);
      expect(schemaRows[0]).toHaveTextContent(/object/);
      expect(
        within(responsesNode).getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/json');
      expect(within(responsesNode).getByRole(/combobox/)).toHaveValue(
        'application/json',
      );
    });

    it('replace selected content type on selecting', async () => {
      const {stores, creator, asserts} = StoreCreator();
      const path = creator.createPath('/user/abc');
      stores.uiStore.setActiveNode(path);
      const {asFragment, getByRole} = render(<Content />, {
        providerProps: {value: stores},
      });
      const responseStatusNode = getResponseStatusNode();
      const responsesNode = screen.getByRole(/responses/);
      const addBtn = within(responseStatusNode).getByRole(/button/, {
        name: /Response/,
      });
      act(() => {
        fireEvent.click(addBtn);
      });
      const addBodyBtn = within(responsesNode).getByRole(/button/, {
        name: /Add Body/,
      });
      act(() => {
        fireEvent.click(addBodyBtn);
      });

      await act(async () => {
        await userEvent.click(
          screen.getByPlaceholderText(/Create or choose existing/),
        );
        const popover = document.querySelector('.bp3-popover.bp3-minimal');
        expect(popover).not.toBeNull();
        await userEvent.click(
          within(popover).getByTestId('application/xml'),
          undefined,
          {
            skipPointerEventsCheck: true,
          },
        );
      });
      expect(
        screen.getByPlaceholderText(/Create or choose existing/),
      ).toHaveValue('application/xml');
      expect(getByRole(/combobox/)).toHaveValue('application/xml');
      expect(getByRole(/combobox/).getElementsByTagName('option')).toHaveLength(
        1,
      );
      const doc = asserts.oas(
        path.relativeJsonPath.concat(['responses', '200', 'content']),
        true,
      );
      expect(doc).toHaveProperty('application/xml');
      expect(Object.keys(doc)).toHaveLength(1);
      expect(asFragment).toMatchSnapshot();
    });
  });
});
