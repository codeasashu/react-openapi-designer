export default {
  theme: {
    base: 'vs-dark',
    inherit: true,

    rules: [
      {
        background: '#293742',
        token: '',
      },
      {
        foreground: '738694',
        token: 'comment',
      },
      {
        foreground: 'e6db74',
        token: 'string',
      },
      {
        foreground: 'ae81ff',
        token: 'constant.numeric',
      },
      {
        foreground: 'ae81ff',
        token: 'constant.language',
      },
      {
        foreground: 'ae81ff',
        token: 'constant.character',
      },
      {
        foreground: 'ae81ff',
        token: 'constant.other',
      },
      {
        foreground: 'b794f4',
        token: 'keyword',
      },
      {
        foreground: 'f92672',
        token: 'storage',
      },
      {
        foreground: '66d9ef',
        fontStyle: 'italic',
        token: 'storage.type',
      },
      {
        foreground: 'a6e22e',
        fontStyle: 'underline',
        token: 'entity.name.class',
      },
      {
        foreground: 'a6e22e',
        fontStyle: 'italic underline',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: 'a6e22e',
        token: 'entity.name.function',
      },
      {
        foreground: 'fd971f',
        fontStyle: 'italic',
        token: 'variable.parameter',
      },
      {
        foreground: 'f92672',
        token: 'entity.name.tag',
      },
      {
        foreground: 'a6e22e',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '66d9ef',
        token: 'support.function',
      },
      {
        foreground: '66d9ef',
        token: 'support.constant',
      },
      {
        foreground: '66d9ef',
        fontStyle: 'italic',
        token: 'support.type',
      },
      {
        foreground: '66d9ef',
        fontStyle: 'italic',
        token: 'support.class',
      },
      {
        foreground: 'f8f8f0',
        background: 'f92672',
        token: 'invalid',
      },
      {
        foreground: 'f8f8f0',
        background: 'ae81ff',
        token: 'invalid.deprecated',
      },
      {
        token: 'type.yaml',
        foreground: '9cdcfe',
      },
      {
        token: 'string.yaml',
        foreground: 'ce9178',
      },
      {
        token: 'number.yaml',
        foreground: 'b5cea8',
      },
    ],

    colors: {
      'editor.foreground': '#f9f9f9',
      'editor.background': '#30404c',
      'editor.selectionBackground': '#293742',
      'editor.lineHighlightBackground': '#202b33',
      'editorCursor.foreground': '#F8F8F0',
      'editorWhitespace.foreground': '#3B4852',
    },
  },
  schemas: {
    yaml: {
      $id: 'https://spec.openapis.org/oas/3.1/schema/2021-03-02',
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: {
        openapi: {
          type: 'string',
          pattern: '^3\\.1\\.\\d+(-.+)?$',
        },
        info: {
          $ref: '#/$defs/info',
        },
        jsonSchemaDialect: {
          $ref: '#/$defs/uri',
          default: 'https://spec.openapis.org/oas/3.1/dialect/base',
        },
        servers: {
          $ref: '#/$defs/server',
        },
        paths: {
          $ref: '#/$defs/paths',
        },
        webhooks: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/path-item-or-reference',
          },
        },
        components: {
          $ref: '#/$defs/components',
        },
        security: {
          type: 'array',
          items: {
            $ref: '#/$defs/security-requirement',
          },
        },
        tags: {
          type: 'array',
          items: {
            $ref: '#/$defs/tag',
          },
        },
        externalDocs: {
          $ref: '#/$defs/external-documentation',
        },
      },
      required: ['openapi', 'info'],
      anyOf: [
        {
          required: ['paths'],
        },
        {
          required: ['components'],
        },
        {
          required: ['webhooks'],
        },
      ],
      $ref: '#/$defs/specification-extensions',
      unevaluatedProperties: false,
      $defs: {
        info: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            termsOfService: {
              type: 'string',
            },
            contact: {
              $ref: '#/$defs/contact',
            },
            license: {
              $ref: '#/$defs/license',
            },
            version: {
              type: 'string',
            },
          },
          required: ['title', 'version'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        contact: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        license: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            identifier: {
              type: 'string',
            },
            url: {
              $ref: '#/$defs/uri',
            },
          },
          required: ['name'],
          oneOf: [
            {
              required: ['identifier'],
            },
            {
              required: ['url'],
            },
          ],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        server: {
          type: 'object',
          properties: {
            url: {
              $ref: '#/$defs/uri',
            },
            description: {
              type: 'string',
            },
            variables: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/server-variable',
              },
            },
          },
          required: ['url'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'server-variable': {
          type: 'object',
          properties: {
            enum: {
              type: 'array',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
            default: {
              type: 'string',
            },
            descriptions: {
              type: 'string',
            },
          },
          required: ['default'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        components: {
          type: 'object',
          properties: {
            schemas: {
              type: 'object',
              additionalProperties: {
                $dynamicRef: '#meta',
              },
            },
            responses: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/response-or-reference',
              },
            },
            parameters: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/parameter-or-reference',
              },
            },
            examples: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/example-or-reference',
              },
            },
            requestBodies: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/request-body-or-reference',
              },
            },
            headers: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/header-or-reference',
              },
            },
            securitySchemes: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/security-scheme-or-reference',
              },
            },
            links: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/link-or-reference',
              },
            },
            callbacks: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/callbacks-or-reference',
              },
            },
            pathItems: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/path-item-or-reference',
              },
            },
          },
          patternProperties: {
            '^(schemas|responses|parameters|examples|requestBodies|headers|securitySchemes|links|callbacks|pathItems)$':
              {
                $comment:
                  'Enumerating all of the property names in the regex above is necessary for unevaluatedProperties to work as expected',
                propertyNames: {
                  pattern: '^[a-zA-Z0-9._-]+$',
                },
              },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        paths: {
          type: 'object',
          patternProperties: {
            '^/': {
              $ref: '#/$defs/path-item',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'path-item': {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            servers: {
              type: 'array',
              items: {
                $ref: '#/$defs/server',
              },
            },
            parameters: {
              type: 'array',
              items: {
                $ref: '#/$defs/parameter-or-reference',
              },
            },
          },
          patternProperties: {
            '^(get|post|delete|options|head|patch|trace)$': {
              $ref: '#/$defs/operation',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'path-item-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/path-item',
          },
        },
        operation: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            summary: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            externalDocs: {
              $ref: '#/$defs/external-documentation',
            },
            operationId: {
              type: 'string',
            },
            parameters: {
              type: 'array',
              items: {
                $ref: '#/$defs/parameter-or-reference',
              },
            },
            requestBody: {
              $ref: '#/$defs/request-body-or-reference',
            },
            responses: {
              $ref: '#/$defs/responses',
            },
            callbacks: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/callbacks-or-reference',
              },
            },
            deprecated: {
              default: false,
              type: 'boolean',
            },
            security: {
              type: 'array',
              items: {
                $ref: '#/$defs/security-requirement',
              },
            },
            servers: {
              type: 'array',
              items: {
                $ref: '#/$defs/server',
              },
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'external-documentation': {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            url: {
              $ref: '#/$defs/uri',
            },
          },
          required: ['url'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        parameter: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            in: {
              enum: ['query', 'header', 'path', 'cookie'],
            },
            description: {
              type: 'string',
            },
            required: {
              default: false,
              type: 'boolean',
            },
            deprecated: {
              default: false,
              type: 'boolean',
            },
            allowEmptyValue: {
              default: false,
              type: 'boolean',
            },
            schema: {
              $dynamicRef: '#meta',
            },
            content: {
              $ref: '#/$defs/content',
            },
          },
          required: ['in'],
          oneOf: [
            {
              required: ['schema'],
            },
            {
              required: ['content'],
            },
          ],
          dependentSchemas: {
            schema: {
              properties: {
                style: {
                  type: 'string',
                },
                explode: {
                  type: 'boolean',
                },
                allowReserved: {
                  default: false,
                  type: 'boolean',
                },
              },
              allOf: [
                {
                  $ref: '#/$defs/examples',
                },
                {
                  $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-path',
                },
                {
                  $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-header',
                },
                {
                  $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-query',
                },
                {
                  $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-cookie',
                },
                {
                  $ref: '#/$defs/parameter/dependentSchemas/schema/$defs/styles-for-form',
                },
              ],
              $defs: {
                'styles-for-path': {
                  if: {
                    properties: {
                      in: {
                        const: 'path',
                      },
                    },
                    required: ['in'],
                  },
                  then: {
                    properties: {
                      style: {
                        default: 'simple',
                        enum: ['matrix', 'label', 'simple'],
                      },
                      required: {
                        const: true,
                      },
                    },
                    required: ['required'],
                  },
                },
                'styles-for-header': {
                  if: {
                    properties: {
                      in: {
                        const: 'header',
                      },
                    },
                    required: ['in'],
                  },
                  then: {
                    properties: {
                      style: {
                        default: 'simple',
                        enum: ['simple'],
                      },
                    },
                  },
                },
                'styles-for-query': {
                  if: {
                    properties: {
                      in: {
                        const: 'query',
                      },
                    },
                    required: ['in'],
                  },
                  then: {
                    properties: {
                      style: {
                        default: 'form',
                        enum: [
                          'form',
                          'spaceDelimited',
                          'pipeDelimited',
                          'deepObject',
                        ],
                      },
                    },
                  },
                },
                'styles-for-cookie': {
                  if: {
                    properties: {
                      in: {
                        const: 'cookie',
                      },
                    },
                    required: ['in'],
                  },
                  then: {
                    properties: {
                      style: {
                        default: 'form',
                        enum: ['form'],
                      },
                    },
                  },
                },
                'styles-for-form': {
                  if: {
                    properties: {
                      style: {
                        const: 'form',
                      },
                    },
                    required: ['style'],
                  },
                  then: {
                    properties: {
                      explode: {
                        default: true,
                      },
                    },
                  },
                  else: {
                    properties: {
                      explode: {
                        default: false,
                      },
                    },
                  },
                },
              },
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'parameter-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/parameter',
          },
        },
        'request-body': {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            content: {
              $ref: '#/$defs/content',
            },
            required: {
              default: false,
              type: 'boolean',
            },
          },
          required: ['content'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'request-body-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/request-body',
          },
        },
        content: {
          type: 'object',
          additionalProperties: {
            $ref: '#/$defs/media-type',
          },
          propertyNames: {
            format: 'media-range',
          },
        },
        'media-type': {
          type: 'object',
          properties: {
            schema: {
              $dynamicRef: '#meta',
            },
            encoding: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/encoding',
              },
            },
          },
          allOf: [
            {
              $ref: '#/$defs/specification-extensions',
            },
            {
              $ref: '#/$defs/examples',
            },
          ],
          unevaluatedProperties: false,
        },
        encoding: {
          type: 'object',
          properties: {
            contentType: {
              type: 'string',
              format: 'media-range',
            },
            headers: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/header-or-reference',
              },
            },
            style: {
              default: 'form',
              enum: ['form', 'spaceDelimited', 'pipeDelimited', 'deepObject'],
            },
            explode: {
              type: 'boolean',
            },
            allowReserved: {
              default: false,
              type: 'boolean',
            },
          },
          allOf: [
            {
              $ref: '#/$defs/specification-extensions',
            },
            {
              $ref: '#/$defs/encoding/$defs/explode-default',
            },
          ],
          unevaluatedProperties: false,
          $defs: {
            'explode-default': {
              if: {
                properties: {
                  style: {
                    const: 'form',
                  },
                },
                required: ['style'],
              },
              then: {
                properties: {
                  explode: {
                    default: true,
                  },
                },
              },
              else: {
                properties: {
                  explode: {
                    default: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          type: 'object',
          properties: {
            default: {
              $ref: '#/$defs/response-or-reference',
            },
          },
          patternProperties: {
            '^[1-5][0-9X]{2}$': {
              $ref: '#/$defs/response-or-reference',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        response: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            headers: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/header-or-reference',
              },
            },
            content: {
              $ref: '#/$defs/content',
            },
            links: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/link-or-reference',
              },
            },
          },
          required: ['description'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'response-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/response',
          },
        },
        callbacks: {
          type: 'object',
          $ref: '#/$defs/specification-extensions',
          additionalProperties: {
            $ref: '#/$defs/path-item-or-reference',
          },
        },
        'callbacks-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/callbacks',
          },
        },
        example: {
          type: 'object',
          properties: {
            summary: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            value: true,
            externalValue: {
              $ref: '#/$defs/uri',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'example-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/example',
          },
        },
        link: {
          type: 'object',
          properties: {
            operationRef: {
              $ref: '#/$defs/uri',
            },
            operationId: true,
            parameters: {
              $ref: '#/$defs/map-of-strings',
            },
            requestBody: true,
            description: {
              type: 'string',
            },
            body: {
              $ref: '#/$defs/server',
            },
          },
          oneOf: [
            {
              required: ['operationRef'],
            },
            {
              required: ['operationId'],
            },
          ],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'link-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/link',
          },
        },
        header: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
            },
            required: {
              default: false,
              type: 'boolean',
            },
            deprecated: {
              default: false,
              type: 'boolean',
            },
            allowEmptyValue: {
              default: false,
              type: 'boolean',
            },
          },
          dependentSchemas: {
            schema: {
              properties: {
                style: {
                  default: 'simple',
                  enum: ['simple'],
                },
                explode: {
                  default: false,
                  type: 'boolean',
                },
                allowReserved: {
                  default: false,
                  type: 'boolean',
                },
                schema: {
                  $dynamicRef: '#meta',
                },
              },
              $ref: '#/$defs/examples',
            },
            content: {
              properties: {
                content: {
                  $ref: '#/$defs/content',
                },
              },
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        'header-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/header',
          },
        },
        tag: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            externalDocs: {
              $ref: '#/$defs/external-documentation',
            },
          },
          required: ['name'],
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
        },
        reference: {
          type: 'object',
          properties: {
            $ref: {
              $ref: '#/$defs/uri',
            },
            summary: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          },
          unevaluatedProperties: false,
        },
        schema: {
          $dynamicAnchor: 'meta',
          type: ['object', 'boolean'],
        },
        'security-scheme': {
          type: 'object',
          properties: {
            type: {
              enum: ['apiKey', 'http', 'mutualTLS', 'oauth2', 'openIdConnect'],
            },
            description: {
              type: 'string',
            },
          },
          required: ['type'],
          allOf: [
            {
              $ref: '#/$defs/specification-extensions',
            },
            {
              $ref: '#/$defs/security-scheme/$defs/type-apikey',
            },
            {
              $ref: '#/$defs/security-scheme/$defs/type-http',
            },
            {
              $ref: '#/$defs/security-scheme/$defs/type-http-bearer',
            },
            {
              $ref: '#/$defs/security-scheme/$defs/type-oauth2',
            },
            {
              $ref: '#/$defs/security-scheme/$defs/type-oidc',
            },
          ],
          unevaluatedProperties: false,
          $defs: {
            'type-apikey': {
              if: {
                properties: {
                  type: {
                    const: 'apiKey',
                  },
                },
                required: ['type'],
              },
              then: {
                properties: {
                  name: {
                    type: 'string',
                  },
                  in: {
                    enum: ['query', 'header', 'cookie'],
                  },
                },
                required: ['name', 'in'],
              },
            },
            'type-http': {
              if: {
                properties: {
                  type: {
                    const: 'http',
                  },
                },
                required: ['type'],
              },
              then: {
                properties: {
                  scheme: {
                    type: 'string',
                  },
                },
                required: ['scheme'],
              },
            },
            'type-http-bearer': {
              if: {
                properties: {
                  type: {
                    const: 'http',
                  },
                  scheme: {
                    const: 'bearer',
                  },
                },
                required: ['type', 'scheme'],
              },
              then: {
                properties: {
                  bearerFormat: {
                    type: 'string',
                  },
                },
                required: ['scheme'],
              },
            },
            'type-oauth2': {
              if: {
                properties: {
                  type: {
                    const: 'oauth2',
                  },
                },
                required: ['type'],
              },
              then: {
                properties: {
                  flows: {
                    $ref: '#/$defs/oauth-flows',
                  },
                },
                required: ['flows'],
              },
            },
            'type-oidc': {
              if: {
                properties: {
                  type: {
                    const: 'openIdConnect',
                  },
                },
                required: ['type'],
              },
              then: {
                properties: {
                  openIdConnectUrl: {
                    $ref: '#/$defs/uri',
                  },
                },
                required: ['openIdConnectUrl'],
              },
            },
          },
        },
        'security-scheme-or-reference': {
          if: {
            required: ['$ref'],
          },
          then: {
            $ref: '#/$defs/reference',
          },
          else: {
            $ref: '#/$defs/security-scheme',
          },
        },
        'oauth-flows': {
          type: 'object',
          properties: {
            implicit: {
              $ref: '#/$defs/oauth-flows/$defs/implicit',
            },
            password: {
              $ref: '#/$defs/oauth-flows/$defs/password',
            },
            clientCredentials: {
              $ref: '#/$defs/oauth-flows/$defs/client-credentials',
            },
            authorizationCode: {
              $ref: '#/$defs/oauth-flows/$defs/authorization-code',
            },
          },
          $ref: '#/$defs/specification-extensions',
          unevaluatedProperties: false,
          $defs: {
            implicit: {
              type: 'object',
              properties: {
                authorizationUrl: {
                  type: 'string',
                },
                refreshUrl: {
                  type: 'string',
                },
                scopes: {
                  $ref: '#/$defs/map-of-strings',
                },
              },
              required: ['authorizationUrl', 'scopes'],
              $ref: '#/$defs/specification-extensions',
              unevaluatedProperties: false,
            },
            password: {
              type: 'object',
              properties: {
                tokenUrl: {
                  type: 'string',
                },
                refreshUrl: {
                  type: 'string',
                },
                scopes: {
                  $ref: '#/$defs/map-of-strings',
                },
              },
              required: ['tokenUrl', 'scopes'],
              $ref: '#/$defs/specification-extensions',
              unevaluatedProperties: false,
            },
            'client-credentials': {
              type: 'object',
              properties: {
                tokenUrl: {
                  type: 'string',
                },
                refreshUrl: {
                  type: 'string',
                },
                scopes: {
                  $ref: '#/$defs/map-of-strings',
                },
              },
              required: ['tokenUrl', 'scopes'],
              $ref: '#/$defs/specification-extensions',
              unevaluatedProperties: false,
            },
            'authorization-code': {
              type: 'object',
              properties: {
                authorizationUrl: {
                  type: 'string',
                },
                tokenUrl: {
                  type: 'string',
                },
                refreshUrl: {
                  type: 'string',
                },
                scopes: {
                  $ref: '#/$defs/map-of-strings',
                },
              },
              required: ['authorizationUrl', 'tokenUrl', 'scopes'],
              $ref: '#/$defs/specification-extensions',
              unevaluatedProperties: false,
            },
          },
        },
        'security-requirement': {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        'specification-extensions': {
          patternProperties: {
            '^x-': true,
          },
        },
        examples: {
          properties: {
            example: true,
            examples: {
              type: 'object',
              additionalProperties: {
                $ref: '#/$defs/example-or-reference',
              },
            },
          },
        },
        uri: {
          type: 'string',
          format: 'uri',
        },
        'map-of-strings': {
          type: 'object',
          additionalProperties: {
            type: 'string',
          },
        },
      },
    },
  },
};
