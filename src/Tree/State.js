import {makeAutoObservable} from 'mobx';

class State {
  expanded = {};
  activeNodeId = null;
  editedNodeId = null;

  constructor(options) {
    makeAutoObservable(this);
    this.expanded = options?.expanded || {};
    this.activeNodeId = options?.activeNodeId || null;
    this.editedNodeId = options?.editedNodeId || null;
  }

  setExpanded(keyValue) {
    this.expanded = keyValue;
  }

  setExpandedKeyVal(key, val) {
    this.expanded[key] = val;
  }
}

export default State;
