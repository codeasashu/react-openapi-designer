//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import {handleModelChange, handleModelDelete} from 'store/modules/openapi';
import Parameter from '../../designers/parameter';

const ParameterContent = ({relativeJsonPath}) => {
  const name = relativeJsonPath.slice(-1).pop();
  const dispatch = useDispatch();

  const changeModel = React.useCallback(
    (path, value) => dispatch(handleModelChange({path, value})),
    [dispatch],
  );

  const deleteModel = React.useCallback(
    (path) => dispatch(handleModelDelete({path})),
    [dispatch],
  );

  const _in = useSelector(({openapi}) =>
    get(openapi, relativeJsonPath.concat(['in'])),
  );
  const title = useSelector(
    ({openapi}) =>
      get(openapi, relativeJsonPath.concat(['name']), name) || name,
  );
  const description = useSelector(({openapi}) =>
    get(openapi, relativeJsonPath.concat(['description'])),
  );
  const schema = useSelector(({openapi}) =>
    get(openapi, relativeJsonPath.concat(['schema'])),
  );

  return _in ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="w-full max-w-6xl m-auto p-10 flex flex-col">
          <div className="capitalize px-2 py-1 mb-6 font-medium text-2xl">
            {_in} Parameter
          </div>
          <Parameter
            name={title}
            schema={schema}
            description={description}
            disableRequired={true}
            onChange={(e) => {
              changeModel(relativeJsonPath, {in: _in, ...e});
            }}
            onDelete={() => deleteModel(relativeJsonPath)}
          />
        </div>
      </div>
    </div>
  ) : null;
};

ParameterContent.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default ParameterContent;
