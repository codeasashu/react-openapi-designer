import React from 'react';
import PropTypes from 'prop-types';
import Schema from './schema';
import {observer} from 'mobx-react';
import {StoresContext} from '../../Context';
import RefSelector from './RefSelector';
import {getRefProviders} from '../../../utils/selectors';

// function sg(e = '', t = []) {
//   return t.find((t) => {
//     var n;
//     return !!((n = t.matcher) === null || n === undefined
//       ? undefined
//       : n.call(t, e));
//   });
// }

const JsonSchema = observer(({relativeJsonPath}) => {
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

  const refProviders = getRefProviders();

  return (
    <div>
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

JsonSchema.propTypes = {
  relativeJsonPath: PropTypes.array,
  props: PropTypes.any,
  shouldRenderGoToRef: PropTypes.bool,
  getRefLabel: PropTypes.func,
  refSelector: PropTypes.func,
  rootName: PropTypes.string,
  whitelistTypes: PropTypes.array,
  customRowActionRenderer: PropTypes.func,
};

export default JsonSchema;
