//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import {handleModelChange} from 'store/modules/openapi';
import {TitleEditor} from '../Editor';
import ResponseBody from '../Designer/Responses/body';

const ResponseContent = ({relativeJsonPath}) => {
  const name = relativeJsonPath.slice(-1).pop();
  const dispatch = useDispatch();

  const changeModel = React.useCallback(
    (path, value) => dispatch(handleModelChange({path, value})),
    [dispatch],
  );

  const title = useSelector(
    ({openapi}) =>
      get(openapi, relativeJsonPath.concat(['title']), name) || name,
  );
  const response = useSelector(({openapi}) => get(openapi, relativeJsonPath));

  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor
              disabled
              xl
              value={title}
              onChange={(e) =>
                changeModel(relativeJsonPath.concat(['title']), e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <ResponseBody
              response={response}
              onChange={(e) => {
                changeModel(relativeJsonPath, {title, ...e});
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ResponseContent.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default ResponseContent;
