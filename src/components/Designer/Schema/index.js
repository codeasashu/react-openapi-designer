import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {schemaStore} from '../../../redux/store';
import RootSchema from './root2';

// eslint-disable-next-line no-unused-vars
function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.debug('Changed props SchemaDesigner:', changedProps);
    }
    prev.current = props;
  });
}

const Schema = (props) => {
  // Uncomment below line to debug re-renderings (why prop has changed)
  //useTraceUpdate(props);
  return (
    <Provider store={schemaStore}>
      <RootSchema {...props} />
    </Provider>
  );
};

Schema.propTypes = {
  store: PropTypes.object,
};

export default Schema;
