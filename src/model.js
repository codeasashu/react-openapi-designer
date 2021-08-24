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
    version: 'version2',
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
    securitySchemes: {},
    links: {},
    callbacks: {},
  },
  tags: [],
  servers: [],
};
