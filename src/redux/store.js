import { createStore } from 'redux';
import { reducer } from './modules/schema-designer';

export default createStore(reducer);