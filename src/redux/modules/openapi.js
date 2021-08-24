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
    handleSchemaChange: (state, action) => {
      const {name, schema} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addSchema(name, schema)
        .rootDoc;
    },
    handleParameterChange: (state, action) => {
      const {name, schema} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addParameter(name, schema)
        .rootDoc;
    },
    handleResponseChange: (state, action) => {
      const {name, response} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addResponse(name, response)
        .rootDoc;
    },
    addUrl: (state, action) => ({...state, name: action.payload}),
  },
});

export default openapi.reducer;
