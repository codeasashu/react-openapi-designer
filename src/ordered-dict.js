// Taken from https://github.com/codeasashu/js-ordered-dict
class OrderedDict {
  constructor(originalDict) {
    this.dict = originalDict || {};
    this.arr = originalDict ? Object.keys(originalDict) : [];
  }

  findIndex = (key) => this.arr.indexOf(key);

  insert = (index, key, val) => {
    if (this.arr.indexOf(key) !== -1) return false;

    this.arr.splice(index, 0, key);
    this.dict[key] = val;
    return true;
  };

  remove = (key) => {
    const index = this.findIndex(key);
    if (index >= 0) {
      this.arr.splice(index, 1);
      delete this.dict[key];
      return true;
    }
    return false;
  };

  toDict = () => {
    let cloned = {};
    for (let i = 0; i < this.arr.length; i++) {
      cloned[this.arr[i]] = this.dict[this.arr[i]];
    }
    return cloned;
  };
}

export default OrderedDict;
