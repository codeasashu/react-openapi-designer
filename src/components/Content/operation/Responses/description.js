import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {
  getValueFromStore,
  usePatchOperation,
} from '../../../../utils/selectors';
import {nodeOperations} from '../../../../datasets/tree';
import {MarkdownEditor} from '../../../Editor';

const Description = observer(({relativeJsonPath}) => {
  const handlePatch = usePatchOperation();
  const value = getValueFromStore(relativeJsonPath);

  return (
    <MarkdownEditor
      value={value || ''}
      language="md"
      placeholder="Response description..."
      onChange={(e) => handlePatch(nodeOperations.Replace, relativeJsonPath, e)}
    />
  );
});

Description.propTypes = {
  responsesPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
export default Description;
