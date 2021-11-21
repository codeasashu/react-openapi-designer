//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {MarkdownEditor} from '../Editor';
import Headers from './operation/Responses/headers';
import Response from './operation/Responses/response';

const ResponseContent = ({relativeJsonPath}) => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <MarkdownEditor
            language="md"
            placeholder="Response description..."
            relativeJsonPath={relativeJsonPath.concat(['description'])}
          />
          <Headers
            className="mt-6"
            headersPath={relativeJsonPath.concat(['headers'])}
          />
          <Response
            contentPath={relativeJsonPath.concat(['content'])}
            descriptionPath={relativeJsonPath.concat(['description'])}
          />
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
