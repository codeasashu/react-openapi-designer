import {trimStart} from 'lodash';
import {computed, makeObservable, observable} from 'mobx';
import {NodeCategories, getExtension} from '../../utils/tree';
import Node from './node';
import NodeData from './nodeData';

const LanguageMap = {
  md: 'markdown',
  yml: 'yaml',
  js: 'javascript',
  json: 'json',
};

function getLanguageFromExtension(name) {
  return LanguageMap[trimStart(getExtension(name), '.')];
}

class GraphNode extends Node {
  _spec = null;
  data;
  constructor(e, t) {
    super(e, t);
    makeObservable(this, {
      _spec: observable,
      spec: computed,
      data: observable.ref,
    });
    this.category = NodeCategories.Source;
    this.data = new NodeData();

    if (e.data) {
      this.data = new NodeData(e.data);
      this.disposables.push(this.data);
    }

    if (e.spec !== undefined) {
      this.spec = e.spec;
    }
  }

  get spec() {
    return this._spec;
  }

  set spec(e) {
    this._spec = e;
  }

  get language() {
    return getLanguageFromExtension(this.path);
  }

  dehydrate() {
    return {
      id: this.id,
      category: this.category,
      type: this.type,
      language: this.language,
      path: this.path,
      uri: this.uri,
      parentId: this.parentId,
      data: this.data.dehydrate(),
      spec: this.spec,
    };
  }
}
export default GraphNode;
