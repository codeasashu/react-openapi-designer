import {configureStore} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import {schemaSlice} from './modules/schema';
import dropdownReducer from './modules/dropdown';
import openapi from './modules/openapi';

const defaultStoreObject = {
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([thunkMiddleware]),
  devTools: true,
};

const schemaStoreObject = {
  ...defaultStoreObject,
  reducer: {
    schema: schemaSlice('schema').reducer,
    response: schemaSlice('response').reducer,
    requestBody: schemaSlice('requestBody').reducer,
    dropdown: dropdownReducer,
  },
};

export const schemaStore = configureStore(schemaStoreObject);
export const openapiStore = configureStore({
  ...defaultStoreObject,
  reducer: {openapi},
});
