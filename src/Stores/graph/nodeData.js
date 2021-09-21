import {observable, action, computed, makeObservable} from 'mobx';

class NodeData {
  _raw;
  _original;
  parsed;
  resolved;
  diagnostics;
  constructor(e) {
    makeObservable(this, {
      _raw: observable,
      _original: observable,
      raw: computed,
      original: computed,
      isDirty: computed,
      clearDirty: action,
      parsed: observable.ref,
      resolved: observable.ref,
      diagnostics: observable.ref,
    });
    this.eol = '\n';

    if (e) {
      Object.assign(this, e);
    }
  }

  get raw() {
    if (this.isDirty) {
      return this._raw;
    } else {
      return this.original;
    }
  }

  set raw(e) {
    this._raw = this.original === e ? undefined : e;
  }

  get original() {
    return this._original;
  }

  set original(e) {
    if (this._raw !== undefined && e === this._raw) {
      this._raw = undefined;
    }

    this._original = e;
  }

  get isDirty() {
    return this._raw !== undefined;
  }

  clearDirty() {
    this.original = this.raw;
  }

  dehydrate() {
    return {
      raw: this.raw,
      parsed: this.parsed,
      diagnostics: this.diagnostics,
      isDirty: this.isDirty,
    };
  }

  dispose() {
    this._raw = undefined;
    this._original = undefined;
    this.parsed = undefined;
    this.resolved = undefined;

    if (this.diagnostics !== undefined) {
      this.diagnostics.length = 0;
      this.diagnostics = undefined;
    }
  }
}
export default NodeData;
