import React from "react";
import { Provider } from 'react-redux';
import store from "./redux/store";
import SchemaDesigner from './schema-designer';
import "./index.css";

const JsonSchemaDesigner = (props) => {
  return (
    <div>
      <Provider store={store} className="wrapper">
        <SchemaDesigner onChange={
          e => (typeof props.onChange === 'function') ? props.onChange(e) : {}
        } />
      </Provider>
    </div>
  );
};

export default JsonSchemaDesigner;
