export const spec = {
  openapi: '3.0.0',
  info: {
    title: '',
    version: '1.0',
  },
  paths: {},
  components: {
    schemas: {},
    responses: {},
    parameters: {},
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

export const schema = {
  $ref: {$ref: ''},
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer'},
  array: {type: 'array', items: {type: 'string'}},
  object: {type: 'object', properties: {}, required: []},
};

export default spec;
