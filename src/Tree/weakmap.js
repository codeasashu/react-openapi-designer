class SwappableWeakMap {
  constructor() {
    this[Symbol.toStringTag] = 'SwappableWeakMap';
    this._collection = new WeakMap();
  }

  delete(e) {
    return this._collection.delete(e);
  }

  get(e) {
    return this._collection.get(e);
  }

  set(e, t) {
    this._collection.set(e, t);
    return this;
  }

  has(e) {
    return this._collection.has(e);
  }

  swap() {
    this._collection = new WeakMap();
  }
}

export default SwappableWeakMap;
