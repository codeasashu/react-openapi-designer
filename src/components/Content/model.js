//@flow
import React from 'react';
import PropTypes from 'prop-types';
import SchemaDesigner from '../Designer/Schema';
import {TitleEditor, MarkdownEditor} from '../Editor';

const ModelContent = ({name, schema, onChange}) => {
  return schema ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor
              xl
              value={schema['title'] || name}
              onChange={(e) =>
                onChange({name, schema: {...schema, title: e.target.value}})
              }
            />
          </div>
          <div className="flex-1">
            <div className="mt-6">
              <MarkdownEditor
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
                value={schema['description']}
                onChange={(e) =>
                  onChange({name, schema: {...schema, description: e}})
                }
              />
            </div>
          </div>
          <div className="mt-10">
            <SchemaDesigner
              dark
              initschema={schema}
              namespace="model"
              onChange={(e) => onChange({name, schema: e})}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No Schema found</p>
  );
};

ModelContent.propTypes = {
  name: PropTypes.string,
  schema: PropTypes.object,
  onChange: PropTypes.func,
};

export default ModelContent;
