import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get, set, unset, cloneDeep, compact} from 'lodash';
import {OpenApiBuilder} from 'openapi3-ts';
import OrderedDict from '../../ordered-dict';
import {exampleDoc, defaultOperation} from '../../model';
import {generateOperationId} from '../../utils/schema';
import {
  unescapeUri,
  modifyPathFromParameters,
  modifyParametersFromPath,
} from '../../utils';

const hasPathInPathItems = (path, pathItems) => {
  return (
    Object.keys(pathItems)
      .map((p) => p.toLowerCase())
      .indexOf(path.toLowerCase()) >= 0
  );
};

export const changePathParameter = createAsyncThunk(
  'openapi/changePathParams',
  ({path, param, index}, {getState, dispatch}) => {
    dispatch(handlePathParamChange({path, param, index}));
    const {openapi} = getState();
    const parameters = get(openapi.paths, [path, 'parameters'], []);
    const newPath = modifyPathFromParameters(path, parameters);
    if (newPath !== path) {
      dispatch(handlePathNameChange({newPath, oldPath: path}));
      return newPath;
    }
    return null;
  },
);

const movePathNode = (paths, newPath, oldPath) => {
  if (hasPathInPathItems(newPath, paths)) {
    throw {url: [`Path ${newPath} exists in doc`]};
  }
  const clonedPaths = cloneDeep(paths);
  const pathItem = get(clonedPaths, oldPath);

  const parameters = get(clonedPaths, [oldPath, 'parameters']);
  const newParameters = modifyParametersFromPath(parameters, newPath);
  set(clonedPaths, [oldPath, 'parameters'], newParameters);
  let newDoc = new OrderedDict(clonedPaths);
  const keyIndex = newDoc.findIndex(oldPath);
  newDoc.insert(keyIndex, newPath, pathItem);
  newDoc.remove(oldPath);

  return newDoc.toDict();
};

export const openapi = createSlice({
  name: 'openapi',
  initialState: OpenApiBuilder.create(exampleDoc).rootDoc,
  reducers: {
    handleInfo: (state, action) => {
      const info = action.payload;
      return {...state, info: {...state.info, ...info}};
      //return OpenApiBuilder.create(cloneDeep(state)).addInfo(info).rootDoc;
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
    handlePathNameChange: (state, action) => {
      const {newPath, oldPath} = action.payload;
      const paths = movePathNode(state.paths, newPath, oldPath);
      return {...state, paths};
    },
    handleAddOperation: (state, action) => {
      const {path, method: methodName} = action.payload;
      const method = methodName.toLowerCase();
      const operationId = generateOperationId(path, method);
      set(state.paths, [path, method], {
        ...defaultOperation,
        operationId,
      });
    },
    handlePathParamChange: (state, action) => {
      const {path, param, index} = action.payload;
      let parameters = cloneDeep(state.paths[path]?.parameters) || [];
      if (index < 0) {
        parameters = [...parameters, param];
      } else {
        parameters[index] = param;
      }
      set(state.paths, [path, 'parameters'], compact(parameters));
    },
    handleSchemaChange: (state, action) => {
      const {name, schema} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addSchema(name, schema)
        .rootDoc;
    },
    handleModelChange: (state, action) => {
      const {path, value} = action.payload;
      return set(state, path, value);
    },
    handleModelDelete: (state, action) => {
      let {path} = action.payload;
      if (path.length && path[0] === 'paths') {
        path = path.slice(0, 2);
        path = path.map((i) => unescapeUri(i));
      }
      unset(state, path);
      return state;
    },
    handleParameterChange: (state, action) => {
      const {name, schema, ...rest} = action.payload;
      if (rest.deleteOnly === true) {
        let newDoc = new OrderedDict(cloneDeep(state.components.parameters));
        newDoc.remove(name);

        return {
          ...state,
          components: {...state.components, parameters: newDoc.toDict()},
        };
      }
      return (
        schema &&
        OpenApiBuilder.create(cloneDeep(state)).addParameter(name, schema)
          .rootDoc
      );
    },
    handleResponseChange: (state, action) => {
      const {name, response} = action.payload;
      return OpenApiBuilder.create(cloneDeep(state)).addResponse(name, response)
        .rootDoc;
    },
    addUrl: (state, action) => ({...state, name: action.payload}),
  },
  extraReducers: {
    [changePathParameter.fulfilled]: (state) => {
      return state;
    },
  },
});

export const {
  handleInfo,
  handleServers,
  handleSecuritySchemes,
  handleSchemaChange,
  handleModelChange,
  handleModelDelete,
  handlePathNameChange,
  handleAddOperation,
  handlePathParamChange,
} = openapi.actions;

export default openapi.reducer;
