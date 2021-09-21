export const icons = {
  overview: {
    default: 'star',
    color: 'var(--icon-color)',
  },
  paths: {
    color: '#eba439',
    default: 'folder-close',
    expanded: 'folder-open',
  },
  model: {
    default: 'cube',
    color: '#ef932b',
  },
  response: {
    color: '#0f79c5',
    default: 'exchange',
  },
  parameter: {
    default: 'paragraph',
    color: '#1a4f75',
  },
  example: {
    default: 'credit-card',
    color: '#e53e3e',
  },
  requestBody: {
    color: '#6e44b1',
    default: 'dot',
  },
};

export const treeTypes = {
  Overview: 'overview',
  Path: 'path',
  Paths: 'paths',
  Model: 'model',
  Models: 'models',
  Response: 'response',
  Responses: 'responses',
  RequestBody: 'requestBody',
  RequestBodies: 'requestBodies',
  Parameter: 'parameter',
  Parameters: 'parameters',
  Examples: 'examples',
  Example: 'example',
};

export const defaultSchema = {
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer'},
  array: {type: 'array', items: {type: 'string'}},
  object: {
    title: '',
    type: 'object',
    properties: {},
    required: [],
    examples: {},
  },
};

export const defaultSecuritySchemes = {
  http: {
    type: 'http',
    scheme: 'basic',
  },
  apiKey: {
    type: 'apiKey',
    in: 'query',
    name: 'Api Key',
  },
  openIdConnect: {
    type: 'openIdConnect',
    openIdConnectUrl: '',
  },
};

export const defaultOperation = {
  summary: '',
  requestBody: {
    description: 'Patch user properties to update.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            a: {type: 'string'},
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Example response',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              a: {type: 'string'},
            },
          },
        },
      },
    },
    default: {
      description: '',
    },
  },
};

export const exampleDoc = {
  openapi: '3.0.0',
  info: {
    title: 'app1',
    version: '1.0',
    summary: 'App API summary',
    description: 'App API Description',
    contact: {
      name: 'Ashutosh',
      url: 'abc url',
      email: 'ashu@fdj.com',
    },
    termsOfService: 'abc',
    license: {
      name: 'Asshu license',
      identifier: '0BSD',
    },
  },
  paths: {
    '/users/id/{abc}': {
      parameters: [{in: 'path', schema: {type: 'string'}, name: 'abc'}],
      get: {...defaultOperation, summary: 'abcd', operationId: 'get-users-id'},
    },
    '/users/abc': {
      get: {...defaultOperation, summary: 'pqr', operationId: 'get-users-abc'},
    },
  },
  components: {
    schemas: {
      Users: {
        description: '',
        type: 'object',
        properties: {
          a: {type: 'string'},
        },
      },
    },
    responses: {
      testresp: {
        description: 'Example response',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                a: {type: 'string'},
              },
            },
          },
        },
      },
    },
    parameters: {
      test: {
        name: 'test12',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
        },
        description: 'test',
      },
    },
    examples: {},
    requestBodies: {},
    headers: {},
    securitySchemes: {
      'API Key - 1': {
        name: 'API Key test',
        type: 'apiKey',
        in: 'header',
        description: 'kljkl',
      },
      'API Key - 2': {
        type: 'http',
        scheme: 'basic',
        description: 'basic scheme',
      },
      'API Key - 3': {
        type: 'openIdConnect',
        openIdConnectUrl: 'oidurl',
        description: 'oid desc',
      },
    },
    links: {},
    callbacks: {},
  },
  tags: [],
  servers: [
    {
      description: 'ppap',
    },
    {
      url: 'abc s1',
      description: 'ppap2',
    },
  ],
};

export const ModuleNames = {
  info: 'info',
  paths: 'paths',
  models: 'schemas',
  parameters: 'parameters',
  responses: 'responses',
  components: 'components',
};

export const getModuleFromJsonPointer = (items: []) => {
  if (!items || items.length <= 0) {
    return ModuleNames.info;
  }
  if (items[0] === ModuleNames.paths) {
    return ModuleNames.paths;
  }
  if (items[0] === ModuleNames.components) {
    if (items[1] === ModuleNames.models) {
      return ModuleNames.models;
    }
    if (items[1] === ModuleNames.parameters) {
      return ModuleNames.parameters;
    }
    if (items[1] === ModuleNames.responses) {
      return ModuleNames.responses;
    }
    if (items[1] === ModuleNames.securitySchemes) {
      return ModuleNames.securitySchemes;
    }
  }
  return ModuleNames.info;
};
