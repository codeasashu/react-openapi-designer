import {NodeTypes} from './tree';

export default {
  down: null,
  right: null,

  [NodeTypes.Overview]: {
    default: 'star',
    color: 'var(--icon-color)',
  },

  [NodeTypes.Paths]: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },

  get [NodeTypes.Models]() {
    return Object.assign({}, this[NodeTypes.Paths]);
  },

  [NodeTypes.Model]: {
    default: 'cube',
    color: '#ef932b',
  },

  get [NodeTypes.Responses]() {
    return Object.assign({}, this[NodeTypes.Paths]);
  },

  [NodeTypes.Response]: {
    default: 'exchange',
    color: '#0f79c5',
  },

  get [NodeTypes.Parameters]() {
    return Object.assign({}, this[NodeTypes.Paths]);
  },

  [NodeTypes.Parameter]: {
    default: 'paragraph',
    color: '#1a4f75',
  },

  get [NodeTypes.Examples]() {
    return Object.assign({}, this[NodeTypes.Paths]);
  },

  [NodeTypes.Example]: {
    default: 'credit-card',
    color: '#e53e3e',
  },

  get [NodeTypes.RequestBodies]() {
    return Object.assign({}, this[NodeTypes.Paths]);
  },

  [NodeTypes.RequestBody]: {
    default: 'dot',
    color: '#6e44b1',
  },
};
