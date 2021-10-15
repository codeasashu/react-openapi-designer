import React from 'react';
import TreeStore from '../../Tree/Store';
//import SchemaStore from '../../Stores/schemaStore';
import OasSchemaStore from '../../Stores/schemaStore';

const StoreContext = React.createContext(TreeStore);

const DesignContext = React.createContext({});

const StoresContext = React.createContext({});

//const SchemaContext = React.createContext(new SchemaStore());
const SchemaContext = React.createContext(OasSchemaStore);

export {StoreContext, DesignContext, StoresContext, SchemaContext};
