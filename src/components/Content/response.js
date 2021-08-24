//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {TitleEditor} from '../Editor';
import ResponseBody from '../Designer/Responses/body';

const ResponseContent = ({name, response, onChange}) => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor
              disabled
              xl
              value={response['title'] || name}
              onChange={(e) =>
                onChange({name, response: {...response, title: e.target.value}})
              }
            />
          </div>
          <div className="flex-1">
            <ResponseBody
              response={response}
              onChange={(e) => onChange({name, response: {...response, ...e}})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ResponseContent.propTypes = {
  name: PropTypes.string,
  response: PropTypes.object,
  onChange: PropTypes.func,
};

export default ResponseContent;
