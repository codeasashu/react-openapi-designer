class LinkedListItem {
  constructor(e) {
    this.value = e;
    this.next = null;
    this.prev = null;
  }
}

class LinkedList {
  constructor(...e) {
    this._head = this._tail = null;
    this._length = 0;

    if (e.length > 0) {
      e.forEach((e) => {
        this.append(e);
      });
    }
  }

  *iterator() {
    let e = this._head;

    for (; e; ) {
      yield e.value;
      e = e.next;
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  get head() {
    if (this._head) {
      return this._head.value;
    } else {
      return null;
    }
  }

  get tail() {
    if (this._tail) {
      return this._tail.value;
    } else {
      return null;
    }
  }

  get length() {
    return this._length;
  }

  insert(e, t, n = false) {
    if (n && this.isDuplicate(e)) {
      return false;
    }

    let r = new LinkedListItem(e);
    let o = this._head;

    if (!o) {
      return false;
    }

    for (;;) {
      if (t === o.value) {
        r.next = o.next;
        r.prev = o;
        o.next = r;

        if (r.next) {
          r.next.prev = r;
        } else {
          this._tail = r;
        }

        this._length++;
        return true;
      }

      if (!o.next) {
        return false;
      }

      o = o.next;
    }
  }

  append(e, t = false) {
    if (t && this.isDuplicate(e)) {
      return false;
    }

    let n = new LinkedListItem(e);

    if (this._tail) {
      this._tail.next = n;
      n.prev = this._tail;
      this._tail = n;
    } else {
      this._head = this._tail = n;
    }

    this._length++;
    return true;
  }

  prepend(e, t = false) {
    if (t && this.isDuplicate(e)) {
      return false;
    }

    let n = new LinkedListItem(e);

    if (this._head) {
      n.next = this._head;
      this._head.prev = n;
      this._head = n;
    } else {
      this._head = this._tail = n;
    }

    this._length++;
    return true;
  }

  remove(e) {
    let t = this._head;

    if (t) {
      if (e === t.value) {
        this._head = t.next;
        this._head.prev = null;
        t.next = t.prev = null;
        this._length--;
        return t.value;
      }

      for (;;) {
        if (e === t.value) {
          if (t.next) {
            t.prev.next = t.next;
            t.next.prev = t.prev;
            t.next = t.prev = null;
          } else {
            t.prev.next = null;
            this._tail = t.prev;
            t.next = t.prev = null;
          }

          this._length--;
          return t.value;
        }

        if (!t.next) {
          return;
        }

        t = t.next;
      }
    }
  }

  removeHead() {
    let e = this._head;

    if (e) {
      if (this._head.next) {
        this._head.next.prev = null;
        this._head = this._head.next;
        e.next = e.prev = null;
      } else {
        this._head = null;
        this._tail = null;
      }

      this._length--;
      return e.value;
    }
  }

  removeTail() {
    let e = this._tail;

    if (e) {
      if (this._tail.prev) {
        this._tail.prev.next = null;
        this._tail = this._tail.prev;
        e.next = e.prev = null;
      } else {
        this._head = null;
        this._tail = null;
      }

      this._length--;
      return e.value;
    }
  }

  first(e) {
    let t = this.iterator();
    let n = [];
    let r = Math.min(e, this.length);

    for (let e = 0; r > e; e++) {
      let e = t.next();
      n.push(e.value);
    }

    return n;
  }

  toArray() {
    return [...this];
  }

  isDuplicate(e) {
    return new Set(this.toArray()).has(e);
  }
}

export {LinkedListItem};
export default LinkedList;
