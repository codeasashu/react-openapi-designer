import React from 'react';
import {render as rtlRender} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
// Import your own reducer
import schemaReducer from './src/redux/modules/schema';
import dropdownReducer from './src/redux/modules/dropdown';

const schemaStoreObject = {
  reducer: {
    schema: schemaReducer,
    dropdown: dropdownReducer,
  },
};

function render(
  ui,
  {store = configureStore(schemaStoreObject), ...renderOptions} = {},
) {
  // eslint-disable-next-line react/prop-types
  function Wrapper({children}) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, {wrapper: Wrapper, ...renderOptions});
}

// re-export everything
export * from '@testing-library/react';
// override render method
export {render, schemaStoreObject};
