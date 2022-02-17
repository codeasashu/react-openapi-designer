import React from 'react';
import {
  render,
  initStore,
  userEvent,
  ContentUtils,
} from '../../../../test-utils';
import Info from '../info';
// import {Classes} from '@blueprintjs/core';

describe('Overview node', () => {
  const user = userEvent.setup();

  let _stores;

  beforeEach(() => {
    const {stores, node} = initStore();
    render(<Info responsesPath={[]} node={node} />, {
      providerProps: {value: stores},
    });
    _stores = stores;
  });

  it('has default values', async () => {
    expect(ContentUtils.overview().nameInput()).toHaveValue('');
    expect(ContentUtils.overview().versionInput()).toHaveValue('1.0');
    expect(ContentUtils.overview().descriptionInput()).toHaveValue('');
    expect(ContentUtils.overview().addServerBtn()).toBeInTheDocument();
    expect(ContentUtils.overview().addSecurityBtn()).toBeInTheDocument();
    expect(ContentUtils.overview().serverRows()).toHaveLength(0);
    expect(ContentUtils.overview().securityRows()).toHaveLength(0);
    expect(_stores).toHaveSchemaAt(['info'], {
      title: '',
      version: '1.0',
    });
  });

  it('can change title', async () => {
    await user.type(ContentUtils.overview().nameInput(), 'Abc');
    expect(ContentUtils.overview().nameInput()).toHaveValue('Abc');
    expect(_stores).toHaveSchemaAt(['info'], {
      title: 'Abc',
      version: '1.0',
    });
  });

  it('can change description', async () => {
    await user.type(ContentUtils.overview().descriptionInput(), 'Abc def');
    expect(ContentUtils.overview().descriptionInput()).toHaveValue('Abc def');
    expect(_stores).toHaveSchemaAt(['info'], {
      title: '',
      version: '1.0',
      description: 'Abc def',
    });
  });

  describe('can modify server', () => {
    it('can remove servers', async () => {
      await user.click(ContentUtils.overview().addServerBtn());
      await user.click(ContentUtils.overview().addServerBtn());
      await user.type(
        ContentUtils.overview().serverRowsUrlInput(0),
        'http://a.b',
      );
      await user.type(
        ContentUtils.overview().serverRowsUrlInput(1),
        'http://c.d',
      );
      expect(ContentUtils.overview().serverRows()).toHaveLength(2);
      expect(_stores).toHaveSchemaAt(
        ['servers'],
        [
          {description: '', url: 'http://a.b'},
          {description: '', url: 'http://c.d'},
        ],
      );
      await user.click(ContentUtils.overview().serverRowsDeleteBtn(0));
      expect(_stores).toHaveSchemaAt(
        ['servers'],
        [{description: '', url: 'http://c.d'}],
      );
      expect(ContentUtils.overview().serverRows()).toHaveLength(1);
      await user.click(ContentUtils.overview().serverRowsDeleteBtn(0));
      expect(_stores).toHaveSchemaAt(['servers'], []);
      expect(ContentUtils.overview().serverRows()).toHaveLength(0);
    });

    it('can add servers', async () => {
      await user.click(ContentUtils.overview().addServerBtn());
      await user.type(
        ContentUtils.overview().serverRowsUrlInput(0),
        'http://abc.def',
      );
      expect(ContentUtils.overview().serverRows()).toHaveLength(1);
      expect(_stores).toHaveSchemaAt(
        ['servers'],
        [{description: '', url: 'http://abc.def'}],
      );

      await user.click(ContentUtils.overview().addServerBtn());
      await user.type(
        ContentUtils.overview().serverRowsUrlInput(1),
        'http://pqr.xyz/lmn',
      );
      expect(ContentUtils.overview().serverRows()).toHaveLength(2);
      expect(_stores).toHaveSchemaAt(
        ['servers'],
        [
          {description: '', url: 'http://abc.def'},
          {description: '', url: 'http://pqr.xyz/lmn'},
        ],
      );

      await user.type(
        ContentUtils.overview().serverRowsNameInput(0),
        'Server 1',
      );
      expect(ContentUtils.overview().serverRowsNameInput(0)).toHaveValue(
        'Server 1',
      );
      expect(ContentUtils.overview().serverRows()).toHaveLength(2);
      expect(_stores).toHaveSchemaAt(
        ['servers'],
        [
          {description: 'Server 1', url: 'http://abc.def'},
          {description: '', url: 'http://pqr.xyz/lmn'},
        ],
      );
    });
  });

  describe('can modify security info', () => {
    describe('API security info', () => {
      it('has default ApiKey security info', async () => {
        await user.click(ContentUtils.overview().addSecurityBtn());
        expect(ContentUtils.overview().securityRows()).toHaveLength(1);
        // Default security row is ApiKey
        expect(ContentUtils.overview().securityRowTypeInput(0)).toHaveValue(
          'apiKey',
        );
        expect(ContentUtils.overview().securityRowKeyInput(0)).toHaveValue(
          'API Key - 1',
        );
        expect(ContentUtils.overview().securityRowNameInput(0)).toHaveValue(
          'Api Key',
        );
        expect(
          ContentUtils.overview().securityRowApiSecuritySelect(0),
        ).toHaveValue('query');
        expect(
          ContentUtils.overview().removeSecurityRowBtn(0),
        ).toBeInTheDocument();
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          'API Key - 1': {in: 'query', name: 'Api Key', type: 'apiKey'},
        });
      });

      it('can change ApiKey security info', async () => {
        await user.click(ContentUtils.overview().addSecurityBtn());
        await user.clear(ContentUtils.overview().securityRowKeyInput(0));
        await user.type(ContentUtils.overview().securityRowKeyInput(0), 'Abc');
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {in: 'query', name: 'Api Key', type: 'apiKey'},
        });

        await user.clear(ContentUtils.overview().securityRowNameInput(0));
        await user.type(
          ContentUtils.overview().securityRowNameInput(0),
          'AbcD',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {in: 'query', name: 'AbcD', type: 'apiKey'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowApiSecuritySelect(0),
          'header',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {in: 'header', name: 'AbcD', type: 'apiKey'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowApiSecuritySelect(0),
          'cookie',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {in: 'cookie', name: 'AbcD', type: 'apiKey'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowApiSecuritySelect(0),
          'query',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {in: 'query', name: 'AbcD', type: 'apiKey'},
        });

        await user.click(ContentUtils.overview().securityRowDescriptionBtn(0));
        await user.type(
          ContentUtils.overview().securityRowDescriptionInput(),
          'My description',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {
            in: 'query',
            name: 'AbcD',
            type: 'apiKey',
            description: 'My description',
          },
        });

        await user.click(ContentUtils.overview().removeSecurityRowBtn(0));
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {});
      });

      it('can change HTTP security info', async () => {
        await user.click(ContentUtils.overview().addSecurityBtn());
        await user.selectOptions(
          ContentUtils.overview().securityRowTypeInput(0),
          'http',
        );

        await user.clear(ContentUtils.overview().securityRowKeyInput(0));
        await user.type(ContentUtils.overview().securityRowKeyInput(0), 'Abc');
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {scheme: 'basic', type: 'http'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowHttpSecuritySelect(0),
          'bearer',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {scheme: 'bearer', type: 'http'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowHttpSecuritySelect(0),
          'digest',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {scheme: 'digest', type: 'http'},
        });

        await user.selectOptions(
          ContentUtils.overview().securityRowHttpSecuritySelect(0),
          'basic',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {scheme: 'basic', type: 'http'},
        });

        await user.click(ContentUtils.overview().securityRowDescriptionBtn(0));
        await user.type(
          ContentUtils.overview().securityRowDescriptionInput(),
          'My description',
        );
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {
          Abc: {scheme: 'basic', type: 'http', description: 'My description'},
        });

        await user.click(ContentUtils.overview().removeSecurityRowBtn(0));
        expect(_stores).toHaveSchemaAt(['components', 'securitySchemes'], {});
      });
    });
  });

  describe('can change contact info', () => {
    it('can add contact', async () => {
      await user.type(ContentUtils.overview().contactNameInput(), 'Abc');
      expect(ContentUtils.overview().contactNameInput()).toHaveValue('Abc');
      expect(_stores).toHaveSchemaAt(['info', 'contact'], {name: 'Abc'});

      await user.type(ContentUtils.overview().contactUrlInput(), 'http://a');
      expect(ContentUtils.overview().contactUrlInput()).toHaveValue('http://a');
      expect(_stores).toHaveSchemaAt(['info', 'contact'], {
        name: 'Abc',
        url: 'http://a',
      });

      await user.type(ContentUtils.overview().contactEmailInput(), 'a@b');
      expect(ContentUtils.overview().contactEmailInput()).toHaveValue('a@b');
      expect(_stores).toHaveSchemaAt(['info', 'contact'], {
        name: 'Abc',
        url: 'http://a',
        email: 'a@b',
      });

      await user.type(ContentUtils.overview().contactTosInput(), 'b');
      expect(ContentUtils.overview().contactTosInput()).toHaveValue('b');
      expect(_stores).toHaveSchemaAt(['info', 'termsOfService'], 'b');
    });
  });

  it('can add license', async () => {
    await user.type(ContentUtils.overview().license().nameInput(), 'Abc');
    expect(ContentUtils.overview().license().nameInput()).toHaveValue('Abc');
    expect(_stores).toHaveSchemaAt(['info', 'license'], {name: 'Abc'});

    expect(ContentUtils.overview().license().type()).toHaveValue('url');
    await user.selectOptions(
      ContentUtils.overview().license().type(),
      'identifier',
    );
    expect(_stores).toHaveSchemaAt(['info', 'license'], {name: 'Abc'});
    await user.selectOptions(
      ContentUtils.overview().license().identifier(),
      '0BSD',
    );
    expect(_stores).toHaveSchemaAt(['info', 'license'], {
      name: 'Abc',
      identifier: '0BSD',
    });
    await user.selectOptions(ContentUtils.overview().license().type(), 'url');
    expect(_stores).toHaveSchemaAt(['info', 'license'], {
      name: 'Abc',
      identifier: '0BSD',
    });
    await user.type(ContentUtils.overview().license().url(), 'http://abc');
    expect(_stores).toHaveSchemaAt(['info', 'license'], {
      name: 'Abc',
      url: 'http://abc',
    });
  });
});
