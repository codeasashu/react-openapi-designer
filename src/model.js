export const primaryStatusCodes = [200, 201, 400, 401, 403, 404, 500];

export const allStausCodes = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status (WebDAV)',
  208: 'Already Reported (WebDAV)',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: '(Unused)',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect (experiemental)',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot (RFC 2324)",
  420: 'Enhance Your Calm (Twitter)',
  422: 'Unprocessable Entity (WebDAV)',
  423: 'Locked (WebDAV)',
  424: 'Failed Dependency (WebDAV)',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  444: 'No Response (Nginx)',
  449: 'Retry With (Microsoft)',
  450: 'Blocked by Windows Parental Controls (Microsoft)',
  451: 'Unavailable For Legal Reasons',
  499: 'Client Closed Request (Nginx)',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates (Experimental)',
  507: 'Insufficient Storage (WebDAV)',
  508: 'Loop Detected (WebDAV)',
  509: 'Bandwidth Limit Exceeded (Apache)',
  510: 'Not Extended',
  511: 'Network Authentication Required',
  598: 'Network read timeout error',
  599: 'Network connect timeout error',
};

export const sortedStatusCodes = Object.keys(allStausCodes).map(Number).sort();

export const contentTypes = [
  'application/json',
  'application/xml',
  'multipart/form-data',
  'text/html',
  'text/plain',
  'application/EDI-X12',
  'application/EDIFACT',
  'application/atom+xml',
  'application/font-woff',
  'application/gzip',
  'application/javascript',
  'application/octet-stream',
  'application/ogg',
  'application/pdf',
  'application/postscript',
  'application/soap+xml',
  'application/x-bittorrent',
  'application/x-tex',
  'application/xhtml+xml',
  'application/xml-dtd',
  'application/xop+xml',
  'application/zip',
  'application/x-www-form-urlencoded',
];

export const statusCodesColor = {
  1: 'gray',
  2: 'green',
  3: 'yellow',
  4: 'orange',
  5: 'red',
};

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
