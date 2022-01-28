const ImportStore = {
  __esModule: true,
  default: () => ({
    errors: [],
    warning: [],
    info: [],
    hints: [],
    spec: {},

    convert: () => {},
    activate: () => {},
    handleWorkerMessage: () => {},
  }),
};

module.exports = ImportStore;
