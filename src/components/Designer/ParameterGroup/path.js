// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
//import Parameter from '../../../designers/parameter';
import Parameter from './parameter';
import {getValueFromStore} from '../../../utils/selectors';

const Path = observer(
  ({
    title,
    parametersPath,
    parameterIn,
    handleUpdateName,
    handleRemove,
    autoFocus,
  }) => {
    const pathParameters = getValueFromStore(parametersPath, false);
    const values = [];
    const relativeJsonPaths = [];
    if (pathParameters && pathParameters instanceof Array) {
      pathParameters.forEach((value, index) => {
        values.push(value);
        relativeJsonPaths.push(parametersPath.concat(index));
      });
    }

    console.log('here params', parametersPath, pathParameters);
    return (
      <div className="mt-2">
        <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
          {title}
        </div>
        {relativeJsonPaths.map((parameter, index) => (
          <Parameter
            key={parameter.join('/')}
            parameterPath={parameter}
            parameterIn={parameterIn}
            handleUpdateName={handleUpdateName}
            handleRemove={handleRemove}
            autoFocus={
              autoFocus &&
              parameterIn === autoFocus.current &&
              parametersPath.length - 1 === index
            }
            typePath={parameter.concat(['schema', 'type'])}
          />
        ))}
      </div>
    );
  },
);

Path.propTypes = {
  parameters: PropTypes.array,
  onChange: PropTypes.func,
};

export default Path;
