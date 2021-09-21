class SwappableWeakSet {
  constructor() {
    this[Symbol.toStringTag] = 'SwappableWeakSet';
    this._collection = new WeakSet();
  }

  delete(e) {
    return this._collection.delete(e);
  }

  add(e) {
    this._collection.add(e);
    return this;
  }

  has(e) {
    return this._collection.has(e);
  }

  swap() {
    this._collection = new WeakSet();
  }
}

export default SwappableWeakSet;
