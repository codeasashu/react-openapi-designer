// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import SecurityParameter from './security';
import {getValueFromStore} from '../../../utils/selectors';

const Securities = observer(({relativeJsonPath}) => {
  const securityParams = getValueFromStore(relativeJsonPath, false);

  return securityParams ? (
    <div className="mt-2" aria-label="security">
      <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
        Security
      </div>
      {securityParams.length === 0 && (
        <p>
          Overriding global security, setting this operation to NO security.
        </p>
      )}
      {securityParams.length > 0 &&
        securityParams.map((parameter, index) => (
          <SecurityParameter
            className={`parameters`}
            key={[parameter, index].join('/')}
            relativeJsonPath={relativeJsonPath.concat(index)}
          />
        ))}
    </div>
  ) : null;
});

Securities.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Securities;
