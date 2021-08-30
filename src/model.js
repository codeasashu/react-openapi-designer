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
    '/users/id': {
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
