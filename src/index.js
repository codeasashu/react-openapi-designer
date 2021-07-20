// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {schemaStore, responseStore} from './redux/store';
import OasDesigner from './components/Designer';
import SchemaDesigner from './designers/schema';
import ResponseDesigner from './designers/response';
import ParameterDesigner from './designers/parameter';
import './overrides.scss';
import './app.css';

type SchemaPropType = {
  schema: PropTypes.object,
  onChange: PropTypes.func,
  dark: boolean,
};

const Schema = (props: SchemaPropType) => {
  return (
    <Provider
      store={schemaStore}
      className="wrapper__reactopenapi_schemadesigner">
      <SchemaDesigner
        onChange={(e) =>
          typeof props.onChange === 'function' ? props.onChange(e) : {}
        }
        initschema={props.schema}
        dark={props.dark}
      />
    </Provider>
  );
};

const Response = (props: SchemaPropType) => {
  return (
    <Provider
      store={responseStore}
      className="wrapper__reactopenapi_responsedesigner">
      <ResponseDesigner
        onChange={(e) =>
          typeof props.onChange === 'function' ? props.onChange(e) : {}
        }
        initschema={props.schema}
        dark={props.dark}
      />
    </Provider>
  );
};

const ReactOpenapiDesigner = {
  Schema,
  Response,
  OasDesigner,
  Parameter: ParameterDesigner,
};

export {OasDesigner} from '.';

export default ReactOpenapiDesigner;
