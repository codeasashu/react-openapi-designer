import React from 'react';
import {observer} from 'mobx-react-lite';
//import {capitalize} from 'lodash';
import {StoresContext} from '../../Tree/context';
import MonacoCodeEditor from './editor';

const OasEditor = observer(function () {
  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const editorStore = stores.editorStore;

  const editor = editorStore.activeEditor;
  const editorState = editor ? editor.state : undefined;
  const nodeId = editor ? editor.node.id : null;

  React.useEffect(
    () => (
      nodeId &&
        editor &&
        editorState === 'activated' &&
        editor.activateMonaco(),
      () => {
        if (editor == null ? undefined : editor.isMonacoActivated) {
          editor.deactivateMonaco();
        }
      }
    ),
    [nodeId, editor, editorState],
  );

  const activeNode = uiStore.activeSourceNode;

  if (activeNode == null || activeNode.data.raw === undefined) {
    return null;
  }

  //const v = ((n = ((t = o.editorConfig) === null) || (t === undefined) ? undefined : t.lineWidth) !== null) && (n !== undefined) ? n : -1

  const editorOptions = {
    wordBasedSuggestions: true,
    //wordWrap: v > 0 ? "bounded" : "off",
    wordWrap: 'off',
    //wordWrapColumn: v > 0 ? v : 80,
    wordWrapColumn: 80,
  };

  return (
    <MonacoCodeEditor
      store={editor.monacoCodeStore}
      theme="stoplight-dark"
      paddingTop={20}
      options={Object.assign(
        {
          minimap: {
            enabled: false,
          },

          readOnly: false,
          highlightActiveIndentGuide: false,
          overviewRulerBorder: false,
          renderLineHighlight: 'none',
          automaticLayout: true,
          glyphMargin: true,
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 4,
          copyWithSyntaxHighlighting: false,
          colorDecorators: false,
          roundedSelection: false,

          scrollbar: {
            useShadows: true,
            horizontalScrollbarSize: 6,
            verticalScrollbarSize: 6,
          },
        },
        editorOptions,
      )}
    />
  );
});

export default OasEditor;
