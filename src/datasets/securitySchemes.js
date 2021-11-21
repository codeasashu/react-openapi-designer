export default {
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
  oauth2: {
    type: 'oauth2',
  },
};
