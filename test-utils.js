import React from 'react';
import {get} from 'lodash';
import {render as rtlRender} from '@testing-library/react';
import ModelNode from './src/Stores/nodes/modelNode';
import PathNode from './src/Stores/nodes/pathNode';
//import {configureStore} from '@reduxjs/toolkit';
//import {Provider} from 'react-redux';
// Import your own reducer
//import schemaReducer from './src/redux/modules/schema';
//import dropdownReducer from './src/redux/modules/dropdown';
import {NodeTypes} from './src/datasets/tree';
import Stores from './src/Stores';
import {StoresContext} from './src/components/Context';

//const schemaStoreObject = {
//reducer: {
//schema: schemaReducer,
//dropdown: dropdownReducer,
//},
//};

//jest.mock('monaco-editor/esm/vs/editor/editor.api.js');
//

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
    default:
      return null;
  }
}

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)]),
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

function StoreCreator(stores) {
  if (!stores || stores === undefined) {
    stores = new Stores();
  }

  const node = getNodeByType(stores, NodeTypes.Paths);
  const parentNodeId = node.parentSourceNode.id;

  const getParsedOasData = (stores, path) => {
    const parsedData = stores.graphStore.rootNode.data.parsed;
    return get(parsedData, path, null);
  };

  const creator = {
    createModel: (name) => {
      const modelNode = new ModelNode({name, parentNodeId});
      //eslint-disable-next-line no-unused-vars
      const [_, nodeId] = modelNode.create(stores.graphStore);
      return stores.graphStore.graph.getNodeById(nodeId);
    },

    createPath: (path) => {
      const pathNode = new PathNode({path, parentNodeId});
      //eslint-disable-next-line no-unused-vars
      const [_, nodeId] = pathNode.create(stores.graphStore);
      return stores.graphStore.graph.getNodeById(nodeId);
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

  const asserts = {
    oas: (relativeJsonPath, noexpect = false) => {
      const oasDoc = getParsedOasData(stores, relativeJsonPath);
      //eslint-disable-next-line no-undef
      return noexpect ? oasDoc : expect(oasDoc);
    },
  };

  return {stores, creator, asserts};
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
export {render, Stores, StoreCreator};
