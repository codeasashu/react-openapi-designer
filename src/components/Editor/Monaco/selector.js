import React from 'react';
import monaco from './monaco';

export const useCodeEditor = (e, t) => {
  const n = React.useRef(null);

  React.useEffect(() => {
    if (e.current && !n.current) {
      n.current = monaco.editor.create(e.current, t);
    }
  }, []);

  React.useEffect(() => {
    if (n.current) {
      n.current.updateOptions(t || {});
    }
  }, [t]);

  return n;
};

export const useTheme = (e) => {
  React.useEffect(() => {
    monaco.editor.setTheme(e);
  }, [e]);
};

export const useStore = (e, t) => {
  React.useEffect(() => {
    if (e.current) {
      e.current.setModel(t.model);
      t.editor = e.current;
      t.restoreViewState();

      return () => {
        t.saveViewState();
        t.editor = undefined;

        if (e.current) {
          e.current.setModel(null);
        }
      };
    }
  }, [t.id]);
};
