const LintStore = {
  __esModule: true,
  default: () => ({
    errors: [],
    warning: [],
    info: [],
    hints: [],
    spec: {},

    lint: () => {},
    activate: () => {},
    handleWorkerMessage: () => {},
  }),
};

module.exports = LintStore;
