//@flow
import React from 'react';
import PropTypes from 'prop-types';
import RequestBody from './operation/requestBody';

const RequestBodyContent = ({relativeJsonPath}) => {
  const contentPath = relativeJsonPath.concat(['content']);
  const descriptionPath = relativeJsonPath.concat(['description']);
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <RequestBody
            contentPath={contentPath}
            descriptionPath={descriptionPath}
          />
        </div>
      </div>
    </div>
  );
};

RequestBodyContent.propTypes = {
  relativeJsonPath: PropTypes.array,
  node: PropTypes.object,
};

export default RequestBodyContent;
