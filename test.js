const operations = [
  {
    match: '^info$',
    type: 'info',
  },
  {
    match: '^paths$',
    type: 'paths',

    children: [
      {
        notMatch: '^x-',
        type: 'path',

        children: [
          {
            match: '^(?:get|post|put|delete|options|head|patch|trace)$',
            type: 'operation',
          },
        ],
      },
    ],
  },
  {
    match: '^components$',
    type: 'components',

    children: [
      {
        match: '^schemas$',
        type: 'schemas',

        children: [
          {
            notMatch: '^x-',
            type: 'model',
            subtype: 'json_schema',
          },
        ],
      },
    ],
  },
];

function getMatcherForKey(key, value, matchers) {
  for (const matcher of matchers) {
    let matched = true;
    let i = key;

    if (matcher.field) {
      i = value[matcher.field];
    }

    if (matcher.match) {
      matched = !key || (typeof key == 'string' && key.match(matcher.match));
    } else {
      if (matcher.notMatch) {
        matched = !i || typeof i != 'string' || !i.match(matcher.notMatch);
      }
    }

    if (matched) {
      return matcher;
    }
  }
}

const getNodeMap = (operations, parsedData, nodeKey) => {
  const uriMap = {}; // i
  const nodeTree = []; // o

  switch (typeof parsedData) {
    case 'object':
      for (const key in parsedData) {
        if (!Object.prototype.hasOwnProperty.call(parsedData, key)) {
          continue;
        }

        const formattedKey = key.replace(/~/g, '~0').replace(/\//g, '~1'); // s
        const matched = getMatcherForKey(
          formattedKey,
          parsedData[key],
          operations,
        );

        if (matched) {
          const childKey = `${nodeKey || ''}/${formattedKey}`; // t

          const childNodeProps = {
            // c
            category: 'sourcemap',
            type: matched.type,
            path: formattedKey,
          };

          uriMap[childKey] = childNodeProps;

          if (matched.subtype) {
            childNodeProps.subtype = matched.subtype;
          }

          const copyOfNode = Object.assign(
            Object.assign({}, uriMap[childKey]),
            {
              children: [],
            },
          );

          nodeTree.push(copyOfNode);

          if (matched.children) {
            copyOfNode.children = getNodeMap(
              matched.children,
              parsedData[key],
            ).nodeTree;
            Object.assign(
              uriMap,
              getNodeMap(matched.children, parsedData[key], childKey).uriMap,
            );
          }
        }
      }
  }

  return {
    uriMap,
    nodeTree,
  };
};

const defaultOperation = {
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

const oasDoc = {
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
const a = getNodeMap(operations, oasDoc);

console.log(JSON.stringify(a));
