//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import SchemaDesigner from '../Designer/Schema';
import {TitleEditor, MarkdownEditor} from '../Editor';
import {usePatchOperation, getValueFromStore} from '../../utils/selectors';
import {nodeOperations} from '../../utils/tree';

const ModelContent = observer(({relativeJsonPath, node}) => {
  const handlePatch = usePatchOperation();
  const schema = getValueFromStore(relativeJsonPath);

  return schema ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor
              xl
              value={schema?.title || node.path}
              onChange={(e) => {
                handlePatch(
                  nodeOperations.Replace,
                  relativeJsonPath.concat(['title']),
                  e.target.value,
                );
              }}
            />
          </div>
          <div className="flex-1">
            <div className="mt-6">
              <MarkdownEditor
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
                value={schema?.description || ''}
                onChange={(e) =>
                  handlePatch(
                    nodeOperations.Replace,
                    relativeJsonPath.concat(['description']),
                    e,
                  )
                }
              />
            </div>
          </div>
          <div className="mt-10">
            <SchemaDesigner
              dark
              initschema={schema}
              namespace="model"
              onChange={(e) => {
                handlePatch(nodeOperations.Replace, relativeJsonPath, e);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No Schema found</p>
  );
});

ModelContent.propTypes = {
  relativeJsonPath: PropTypes.array,
  node: PropTypes.object,
};

export default ModelContent;
