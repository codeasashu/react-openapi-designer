import LinkedList from './LinkedList';

const setTimer = (e, t) => {
  const n = setInterval(async () => {
    try {
      await e();
    } catch (e) {
      e.extra = {
        trigger: 'createDisposableInterval',
      };

      console.error(e);
    }
  }, t);

  const i = {
    dispose: () => {
      clearInterval(n);
      i.dispose = () => {};
    },
  };

  return i;
};

class HistoryTree {
  constructor(e, t = 10) {
    this.history = e;
    this.size = t;
    this.items = new LinkedList();

    for (let e = Math.min(this.size, this.history.length) - 1; e >= 0; e--) {
      this.items.prepend(this.history[e]);
    }

    this._saveInterval = setTimer(this.saveHistory.bind(this), 5000);
  }

  get length() {
    return this.items.length;
  }

  set length(e) {
    for (e = Math.max(0, e); e < this.items.length; ) {
      this.items.removeTail();
    }
  }

  dispose() {
    var e;
    this.saveHistory();
    this.length = 0;

    if (!((e = this._saveInterval) === null || e === undefined)) {
      e.dispose();
    }

    this._saveInterval = undefined;
  }

  saveHistory() {
    this.history.length = 0;
    this.history.push(...this.items);
  }

  addItem(e) {
    if (this.length === 0) {
      this.items.prepend(e);
      return;
    }

    if (e.uri === this.items.head.uri) {
      return;
    }

    const t = [...this.items].find((t) => e.uri === t.uri);

    if (t !== undefined) {
      this.items.remove(t);
      this.items.prepend(t);
      return;
    }

    if (this.size <= this.items.length) {
      this.length = this.size - 1;
    }

    this.items.prepend(e);
  }

  removeItemsByUri(e) {
    if (this.length === 0) {
      return;
    }

    let t = this.items._head;

    for (; t; ) {
      const {next: n, value: r} = t;

      if (r.uri.startsWith(e)) {
        if (r === this.items.head) {
          this.items.removeHead();
        } else {
          this.items.remove(r);
        }
      }

      t = n;
    }
  }
}

export default HistoryTree;
