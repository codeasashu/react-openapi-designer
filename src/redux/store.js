import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import schemaReducer from './modules/schema';
import dropdownReducer from './modules/dropdown';

export default configureStore({
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat([thunkMiddleware]),
    reducer: {
        schema: schemaReducer,
        dropdown: dropdownReducer,
    },
    devTools: true
})