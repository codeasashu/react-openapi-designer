import React from 'react';
import SchemaDesigner from '../Designer/Schema';
import {TitleEditor, MarkdownEditor} from '../Editor';

const schema = {
  type: 'object',
  properties: {
    a: {type: 'string'},
  },
};

const ModelContent = () => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="flex px-10 mt-10 max-w-6xl justify-between">
          <TitleEditor xl value="abc" />
        </div>
        <div className="px-10 pb-2 max-w-6xl">
          <div className="mt-6">
            <MarkdownEditor
              className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
              placeholder="Description...."
            />
          </div>
        </div>
      </div>
      <div className="px-10 pb-2">
        <SchemaDesigner
          dark
          initschema={schema}
          onChange={(e) => {
            console.log('schema changed', e);
          }}
        />
      </div>
    </div>
  );
};

export default ModelContent;
