import React from "react";
import { Provider } from 'react-redux';
import store from "./redux/store";
import SchemaDesigner from './schema-designer';
import "./index.css";

const ReactOpenapiDesigner = (props) => {
  return (
      <Provider store={store} className="wrapper__reactopenapidesigner">
        <SchemaDesigner
          onChange={e => (typeof props.onChange === 'function') ? props.onChange(e) : {}}
          initschema={props.schema}
          dark={props.dark}
        />
      </Provider>
  );
};

export default ReactOpenapiDesigner;
