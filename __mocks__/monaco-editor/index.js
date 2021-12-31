'use strict';

const editor = {
  EndOfLineSequence: {
    LF: '\n',
  },
  create: () => {
    return this;
  },
  defineTheme: () => {},
  setTheme: () => {},
  createModel: () => {
    return {
      updateOptions: () => {},
      getValue: () => {},
      setValue: () => {},
      setEOL: () => {},
      onDidChangeContent: () => {},
      dispose: () => {},
    };
  },
};

const monaco = {
  editor,
  Uri: {
    parse: (path) => path,
    from: ({scheme, path, query}) => `${scheme}://${path}?${query}`,
  },
  KeyMod: {
    CtrlCmd: 32,
    Shift: 34,
  },
  KeyCode: {
    KEY_Z: 11,
    KEY_Y: 12,
  },
};

module.exports = monaco;
