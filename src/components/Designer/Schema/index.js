import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {schemaStore} from '../../../redux/store';
import RootSchema from './root2';

const Schema = (props) => {
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
