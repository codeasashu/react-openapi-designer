import {createSlice} from '@reduxjs/toolkit';
import OrderedDict from '../../ordered-dict';
import {cloneDeep} from 'lodash';
import {OpenApiBuilder} from 'openapi3-ts';
import {exampleDoc} from '../../model';

const hasPathInPathItems = (path, pathItems) => {
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
    handleInfo: (state, action) => {
      const info = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addInfo(info).rootDoc;
    },
    handleServers: (state, action) => {
      const servers = action.payload;
      return {...state, servers};
    },
    handleSecuritySchemes: (state, action) => {
      const {name, scheme, ...rest} = action.payload;
      if (rest.oldName && name === rest.oldName) {
        return state;
      }
      if (rest.oldName || rest.deleteOnly === true) {
        let newDoc = new OrderedDict(
          cloneDeep(state.components.securitySchemes),
        );

        if (rest.deleteOnly === false) {
          const keyIndex = newDoc.findIndex(rest.oldName);
          newDoc.insert(keyIndex, name, scheme);
          newDoc.remove(rest.oldName);
        } else if (rest.deleteOnly === true) {
          newDoc.remove(name);
        }

        return {
          ...state,
          components: {...state.components, securitySchemes: newDoc.toDict()},
        };
      }
      return OpenApiBuilder.create(cloneDeep(state)).addSecurityScheme(
        name,
        scheme,
      ).rootDoc;
    },
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
