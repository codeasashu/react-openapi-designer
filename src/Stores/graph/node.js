import {pull} from 'lodash';
import {action, computed, makeObservable, observable} from 'mobx';
import {formatUri, isAbsolutePath} from '../../utils/tree';

class Node {
  children = [];
  _path;
  _parent;

  constructor(node, parent) {
    makeObservable(this, {
      _path: observable,
      children: observable.shallow,
      _parent: observable.ref,
      parent: computed,
      path: computed,
      uri: computed,
      dispose: action,
    });

    Node.assertPath(parent, node.path);
    this.id = node.id;
    this.type = node.type;
    this._path = node.path;
    this.parent = parent;
    this._parent = parent;
  }

  static assertPath(parent, path) {
    if (!parent && !isAbsolutePath(path)) {
      throw new Error(`Top-level nodes must have absolute paths: ${path}`);
    }
  }

  get path() {
    return this._path;
  }

  set path(e) {
    Node.assertPath(this.parent, e);
    this._path = e;
  }

  get parent() {
    return this._parent;
  }

  set parent(e) {
    if (this.parent !== e) {
      Node.assertPath(e, this.path);

      if (this.parent) {
        pull(this.parent.children, this);
      }

      this._parent = e;

      if (e) {
        e.children.push(this);
      }
    }
  }

  get parentId() {
    if (this.parent) {
      return this.parent.id;
    } else {
      return 0;
    }
  }

  get uri() {
    // equivalient to this.parent.uri + this._path;
    return formatUri(this._path, this.parent ? this.parent.uri : '');
  }

  get version() {
    let e = '0.0';
    const t = this.uri.match(/\.v\d+(-\d+)?(-[0-9A-Za-z-]+)?\./);

    if (t && t.length > 0) {
      e = t[0].replace(/^\.v|\.$/g, '').replace(/-/g, '.');
    }

    return e;
  }

  getAncestor(condition) {
    const parentNode = this.parent;

    if (parentNode) {
      if (condition(parentNode)) {
        return parentNode;
      } else {
        return parentNode.getAncestor(condition);
      }
    }
  }

  dispose() {
    this.children.length = 0;
  }
}

export default Node;
