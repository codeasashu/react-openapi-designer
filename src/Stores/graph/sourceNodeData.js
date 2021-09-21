import {get} from 'lodash';

class SourceMapNodeData {
  constructor(e) {
    this.sourceMapNode = e;
  }

  get parsed() {
    const e = this.sourceMapNode.parentSourceNode;

    if (e && e.data && e.data.parsed) {
      return get(e.data.parsed, this.sourceMapNode.relativeJsonPath);
    }

    return null;
  }

  get diagnostics() {
    return null;
  }

  get resolved() {
    const e = this.sourceMapNode.parentSourceNode;

    if (e && e.data && e.data.resolved) {
      return get(e.data.resolved, this.sourceMapNode.relativeJsonPath);
    }
    return -1;
  }

  dehydrate() {
    return {
      parsed: this.parsed,
      diagnostics: this.diagnostics,
    };
  }
}

export default SourceMapNodeData;
