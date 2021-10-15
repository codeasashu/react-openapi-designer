import React from 'react';
import * as selector from './selector';

const MonacoCodeEditor = (e) => {
  const {
    store,
    width: n = '100%',
    height: o = '100%',
    //highlightPaths: a,
    theme = 'vs',
    options,
    //paddingTop: c,
  } = e;

  const editorRef = React.useRef(null);
  const editor = selector.useCodeEditor(editorRef, options);
  selector.useStore(editor, store);
  selector.useTheme(theme);
  //i.useCodeEditorDisposer(d);
  //i.usePathHighlighter(t, a);
  //i.useCodeEditorResizer(d, n, o);
  //i.usePaddingTop(d, c);

  return (
    <div
      ref={editorRef}
      style={{
        width: n,
        height: o,
      }}
    />
  );
};

MonacoCodeEditor.displayName = 'OasCodeEditor';

export default MonacoCodeEditor;
