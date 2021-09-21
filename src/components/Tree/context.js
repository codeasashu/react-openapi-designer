import React from 'react';
import TreeStore from '../../Tree/Store';

const StoreContext = React.createContext(TreeStore);

const DesignContext = React.createContext({});

const StoresContext = React.createContext({});

export {StoreContext, DesignContext, StoresContext};
