import React from 'react';
import {render as rtlRender} from '@testing-library/react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
// Import your own reducer
import schemaReducer from './src/redux/modules/schema';

function render(
  ui,
  {
    initialState,
    store = createStore(schemaReducer, initialState),
    ...renderOptions
  } = {},
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
export {render};
