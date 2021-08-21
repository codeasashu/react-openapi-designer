import {createSlice} from '@reduxjs/toolkit';
import {cloneDeep} from 'lodash';
import {OpenApiBuilder} from 'openapi3-ts';
import {exampleDoc} from '../../model';
// import {original, current} from 'immer';

export const openapi = createSlice({
  name: 'openapi',
  initialState: OpenApiBuilder.create(exampleDoc).rootDoc,
  reducers: {
    handlePathChange: (state, action) => {
      const {path, pathItem} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addPath(path, pathItem)
        .rootDoc;
    },
    addUrl: (state, action) => ({...state, name: action.payload}),
  },
});

export default openapi.reducer;
