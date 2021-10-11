// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {set} from 'lodash';
import Parameter from '../../../Designer/ParameterGroup/parameter';
import {
  getValueFromStore,
  usePatchOperation,
} from '../../../../utils/selectors';
import {Button, Icon} from '@blueprintjs/core';
import {nodeOperations} from '../../../../utils/tree';

const Headers = observer(({headersPath}) => {
  const handlePatch = usePatchOperation();
  const headers = getValueFromStore(headersPath, false);
  let relativeJsonPaths = [];
  if (headers) {
    relativeJsonPaths = Object.keys(headers).map((t) => headersPath.concat(t));
  }

  const ref = React.useRef(null);

  return (
    <>
      <div className="flex items-center mt-5 mb-2">
        <div className="font-semibold ml-1 text-gray-6 dark:text-gray-4">
          Headers
        </div>
        <Button
          icon={<Icon icon="plus" iconSize={14} />}
          minimal
          small
          className="ml-1"
          onClick={() => {
            const newHeaderName = 'header-' + relativeJsonPaths.length; //r
            const header = {};
            set(header, ['schema', 'type'], 'string');
            handlePatch(
              nodeOperations.Add,
              headersPath.concat(newHeaderName),
              header,
            );
            ref.current = relativeJsonPaths.length;
          }}
        />
      </div>
      {relativeJsonPaths.map((parameter, index) => (
        <Parameter
          className="mt-2"
          nameInPath={true}
          key={parameter.join('/')}
          parameterPath={parameter}
          parameterIn="header"
          disableRequired={true}
          autoFocus={index === ref.current}
          typePath={parameter.concat(['schema', 'type'])}
        />
      ))}
    </>
  );
});

Headers.propTypes = {
  parameters: PropTypes.array,
  onChange: PropTypes.func,
};

export default Headers;
