class YamlDefaults {
  constructor(e, t) {
    this._languageId = e;
    this.setDiagnosticsOptions(t);
  }

  //function e(e, t) {
  //this._onDidChange = new me()
  //}

  //Object.defineProperty(e.prototype, "onDidChange", {
  //get: function () {
  //return this._onDidChange.event
  //},

  //enumerable: true,
  //configurable: true,
  //})

  setDiagnosticsOptions(e) {
    this._diagnosticsOptions = e || Object.create(null);
    //this._onDidChange.fire(this)
  }
}

Object.defineProperty(YamlDefaults.prototype, 'languageId', {
  get: function () {
    return this._languageId;
  },

  enumerable: true,
  configurable: true,
});

Object.defineProperty(YamlDefaults.prototype, 'diagnosticsOptions', {
  get: function () {
    return this._diagnosticsOptions;
  },

  enumerable: true,
  configurable: true,
});

export default YamlDefaults;
