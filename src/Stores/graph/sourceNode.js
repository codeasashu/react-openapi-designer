import {startsWith} from 'lodash';
import Node from './node';
import {pointerToPath, NodeCategories} from '../../utils/tree';
import SourceMapNodeData from './sourceNodeData';
import {computed, makeObservable} from 'mobx';

class SourceMapNode extends Node {
  constructor(e, t) {
    super(e, t);
    makeObservable(this, {
      parentId: computed,
      parentSourceNode: computed,
      relativeJsonPath: computed,
    });
    this.category = 'source_map';
    this.data = new SourceMapNodeData(this);
    this.subtype = e.subtype;
  }

  get parentId() {
    return this.parent.id;
  }

  get parentSourceNode() {
    return this.getAncestor((e) => !!e && e.category === NodeCategories.Source);
  }

  get spec() {
    return this.parentSourceNode.spec;
  }

  get language() {
    return this.parentSourceNode.language;
  }

  get relativeJsonPath() {
    const parentUri = this.parentSourceNode.uri; // e
    const uri = this.uri; //t
    if (!startsWith(uri, parentUri)) {
      throw new Error(
        `parentUri '${parentUri}' is not included in uri '${uri}'.`,
      );
    }

    let _uri = uri.replace('' + parentUri, '');
    _uri = _uri[0] === '/' ? _uri.slice(1) : _uri;
    const jsonPath = pointerToPath('#/' + _uri); // r

    if (jsonPath[0] === '') {
      return jsonPath.slice(1);
    } else {
      return jsonPath;
    }
  }

  dehydrate() {
    return {
      id: this.id,
      category: this.category,
      type: this.type,
      subtype: this.subtype,
      path: this.path,
      uri: this.uri,
      parentId: this.parentId,
      spec: this.spec,
      language: this.language,
      parentSourceNodeId: this.parentSourceNode.id,
      relativeJsonPath: this.relativeJsonPath,
      data: this.data.dehydrate(),
    };
  }
}

export default SourceMapNode;
