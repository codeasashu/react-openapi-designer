//@flow
import React from 'react';
import SchemaDesigner from '../Designer/Schema';
import {TitleEditor, MarkdownEditor} from '../Editor';

const schema = {
  type: 'object',
  properties: {
    a: {type: 'string'},
  },
};

const ParameterContent = () => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor xl value="abc" />
          </div>
          <div className="flex-1">
            <div className="mt-6">
              <MarkdownEditor
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
              />
            </div>
          </div>
          <div className="mt-10">
            <SchemaDesigner
              dark
              initschema={schema}
              onChange={(e) => {
                console.log('schema changed', e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterContent;
