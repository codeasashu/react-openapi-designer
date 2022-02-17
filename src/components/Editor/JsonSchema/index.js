import React from 'react';
import PropTypes from 'prop-types';
import {StoresContext} from '../../Context';
import SchemaEditor from './editor';

const Schema = ({relativeJsonPath}) => {
  const stores = React.useContext(StoresContext);
  const {activeSourceNodeId} = stores.uiStore;
  const storeId = relativeJsonPath
    ? [activeSourceNodeId, ...relativeJsonPath].join('/')
    : activeSourceNodeId;
  const store = stores.oasSchemaCollection.lookup(storeId, {
    id: storeId,
    relativeJsonPath,
    sourceNodeId: activeSourceNodeId,
  });

  return (
    <SchemaEditor
      store={store}
      customRowActionRenderer={(e) => {
        const {refPath} = e;
        console.log(refPath);
        return null;
      }}
      refSelector={({id, refPath, onChange}) => (
        <mg id={id} refPath={refPath} onChange={onChange} />
      )}
      getRefLabel={(e) => e}
      shouldRenderGoToRef={(e) => {
        console.log('shud ren', e);
      }}
    />
  );
};

Schema.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Schema;
