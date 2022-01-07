// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import Parameter from './parameter';
import {getValueFromStore} from '../../../utils/selectors';

const Parameters = observer(
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
        if (value.in === parameterIn) {
          values.push(value);
          relativeJsonPaths.push(parametersPath.concat('' + index));
        }
      });
    }

    return relativeJsonPaths.length ? (
      <div className="mt-2" aria-label={parameterIn}>
        <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
          {title}
        </div>
        {relativeJsonPaths.map((parameter, index) => (
          <Parameter
            className={`parameters ${parameterIn}`}
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
    ) : null;
  },
);

Parameters.propTypes = {
  parameters: PropTypes.array,
  onChange: PropTypes.func,
};

export default Parameters;
