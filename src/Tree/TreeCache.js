class TreeCache {
  constructor(size) {
    this.size = size;
    this.head = -1;
    this.tail = -1;
    this.cache = new Map();
  }

  set(e, t) {
    if (this.head === -1 || this.head > e) {
      this.head = e;
    }

    if (this.tail === -1 || this.tail < e) {
      this.tail = e;
    }

    if (this.size === this.cache.size) {
      if (this.head >= e) {
        this.cache.delete(this.tail);
        this.tail--;
      } else {
        this.cache.delete(this.head);
        this.head++;
      }
    }

    this.cache.set(e, t);
  }

  get(e) {
    if (e < 0) {
      0;
      return;
    } else {
      return this.cache.get(e);
    }
  }

  clear(e) {
    if (this.head >= e) {
      this.cache.clear();
    } else {
      for (; this.tail >= e++; ) {
        this.cache.delete(e);
      }

      this.tail = e;
    }
  }
}

export default TreeCache;
