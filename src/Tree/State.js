import {makeObservable, observable, action} from 'mobx';

class State {
  expanded = {};
  activeNodeId = null;
  editedNodeId = null;

  constructor(options) {
    makeObservable(this, {
      expanded: observable.shallow,
      editedNodeId: observable,
      activeNodeId: observable,
      setExpanded: action,
      setExpandedKeyVal: action,
    });
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
