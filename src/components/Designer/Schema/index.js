import React from 'react';
import {Provider} from 'react-redux';
import {schemaStore} from '../../../redux/store';
import RootSchema from './root';

const Schema = (props) => {
  return (
    <Provider store={schemaStore}>
      <RootSchema {...props} />
    </Provider>
  );
};

export default Schema;
