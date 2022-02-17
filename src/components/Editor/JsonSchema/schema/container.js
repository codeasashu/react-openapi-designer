import React from 'react';
import PropTypes from 'prop-types';
import {omit} from 'lodash';
import {Button} from '@blueprintjs/core';
import {observer} from 'mobx-react';
import RefSelector from '../RefSelector';
import {getRefProviders} from '../../../../utils/selectors';
import Code from '../../oasSchema/code';
import Schema from './schema';
import {StoresContext} from '../../../Context';

const Container = observer(({relativeJsonPath}) => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNodeId} = stores.uiStore;
  const storeId = relativeJsonPath
    ? [activeSourceNodeId, ...relativeJsonPath].join('/')
    : activeSourceNodeId;

  const store = stores.jsonSchemaCollection.lookup(storeId, {
    id: storeId,
    relativeJsonPath,
    sourceNodeId: activeSourceNodeId,
  });

  const [isGenerate, setGenerate] = React.useState(false);

  const refProviders = getRefProviders();

  const handleGenerate = (e) => {
    let schema = omit(store.store.generateSchema(e), '$schema');

    schema['x-examples'] = {
      'example-1': e,
    };

    setGenerate(false);
  };

  return isGenerate ? (
    <Code
      onGenerateSchema={handleGenerate}
      onCancel={() => {
        setGenerate(false);
      }}
    />
  ) : (
    <div>
      <Button
        icon="clean"
        outlined
        className="mt-3 ml-4 mb-2"
        onClick={() => setGenerate(true)}>
        Generate from json
      </Button>
      <Schema
        customRowActionRenderer={() => {
          // const {
          //     refPath: t,
          // } = e

          // if (t !== undefined) {
          //     const n = sg(t, u)

          //     if (ug.SCDM === (n == null ? undefined : n.name)) {
          //         return c.createElement(Mg, Object.assign({}, e))
          //     }
          // }

          return null;
        }}
        refSelector={({id, refPath, onChange}) => (
          <RefSelector
            id={id}
            refPath={refPath}
            refProviders={refProviders}
            onChange={onChange}
            store={store.store}
          />
        )}
        store={store}
        // getRefLabel={(e) => {
        //   const t = sg(e, u);

        //   if (t) {
        //     return t.getRefLabel(e);
        //   } else {
        //     return e;
        //   }
        // }}
        // shouldRenderGoToRef={(e) => !!e && !f.match(e)}
      />
    </div>
  );
});

Container.propTypes = {
  store: PropTypes.object,
};

export default Container;
