import {createSlice} from '@reduxjs/toolkit';
import OrderedDict from '../../ordered-dict';
import {cloneDeep} from 'lodash';
import {OpenApiBuilder} from 'openapi3-ts';
import {exampleDoc} from '../../model';
// import {original, current} from 'immer';

const hasPathInPathItems = (path, pathItems) => {
  //const otherPaths = omit(pathItems), rest.oldPath)
  return (
    Object.keys(pathItems)
      .map((p) => p.toLowerCase())
      .indexOf(path.toLowerCase()) >= 0
  );
};

export const openapi = createSlice({
  name: 'openapi',
  initialState: OpenApiBuilder.create(exampleDoc).rootDoc,
  reducers: {
    handlePathChange: (state, action) => {
      const {path, pathItem, ...rest} = action.payload;
      if (rest.oldPath && path === rest.oldPath) {
        return state;
      }
      if (rest.oldPath) {
        if (hasPathInPathItems(path, state.paths)) {
          throw {url: [`Path ${path} exists in doc`]};
        }

        let newDoc = new OrderedDict(cloneDeep(state.paths));
        // Path update required
        //delete newState.paths[rest.oldPath];
        const keyIndex = newDoc.findIndex(rest.oldPath);
        newDoc.insert(keyIndex, path, pathItem);
        newDoc.remove(rest.oldPath);

        return {...state, paths: newDoc.toDict()};
      }
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
