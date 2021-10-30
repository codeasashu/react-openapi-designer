//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import {nodeOperations} from '../../utils/tree';
import {TitleEditor, MarkdownEditor} from '../Editor';
import ResponseBody from '../Designer/Responses/body';

const ResponseContent = ({relativeJsonPath, node}) => {
  const handlePatch = usePatchOperation();
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor disabled xl defaultValue={node.path} />
          </div>
          <div className="flex-1">
            <div className="flex-1">
              <MarkdownEditor
                value={
                  getValueFromStore(relativeJsonPath.concat(['description'])) ||
                  ''
                }
                onChange={(e) => {
                  handlePatch(
                    nodeOperations.Replace,
                    relativeJsonPath.concat(['description']),
                    e,
                  );
                }}
              />
            </div>
            <ResponseBody relativeJsonPath={relativeJsonPath} node={node} />
          </div>
        </div>
      </div>
    </div>
  );
};

ResponseContent.propTypes = {
  relativeJsonPath: PropTypes.array,
  node: PropTypes.object,
};

export default ResponseContent;
