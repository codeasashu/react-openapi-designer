import React from "react";
import { Provider } from 'react-redux';
import { schemaStore, responseStore } from "./redux/store";
import SchemaDesigner from './designers/schema';
import ResponseDesigner from './designers/response';
import "./index.css";

const Schema = (props) => {
  return (
      <Provider store={schemaStore} className="wrapper__reactopenapi_schemadesigner">
        <SchemaDesigner
          onChange={e => (typeof props.onChange === 'function') ? props.onChange(e) : {}}
          initschema={props.schema}
          dark={props.dark}
        />
      </Provider>
  );
};

const Response = (props) => {
  return (
      <Provider store={responseStore} className="wrapper__reactopenapi_responsedesigner">
        <ResponseDesigner
          onChange={e => (typeof props.onChange === 'function') ? props.onChange(e) : {}}
          initschema={props.schema}
          dark={props.dark}
        />
      </Provider>
  );
};

const ReactOpenapiDesigner = {
  Schema,
  Response,
};

export default ReactOpenapiDesigner;
