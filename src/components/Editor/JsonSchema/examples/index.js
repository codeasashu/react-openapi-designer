import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@blueprintjs/core';
import {JsonEditor} from '../../../Editor';
import StoreInput from '../../../Common/StoreInput';
import {
  usePatchOperation,
  getValueFromStore,
  usePatchOperationAt,
} from '../../../../utils/selectors';
import {getEditorLanguage} from '../../../../utils/schema';
import {nodeOperations} from '../../../../datasets/tree';

const Example = ({examplePath, exampleValuePath, mediaType, inputRef}) => {
  const content = getValueFromStore(exampleValuePath);
  const handlePatch = usePatchOperation();
  const handlePatchJson = usePatchOperationAt(exampleValuePath);

  const handleInputRef = React.useCallback(
    (ref) => {
      if (inputRef && ref) {
        inputRef.current = ref;
      }
    },
    [inputRef],
  );
  return (
    <div className="bg-canvas">
      <div className="flex p-1">
        <StoreInput
          inputRef={handleInputRef}
          valueInPath={true}
          jsonOp={nodeOperations.Move}
          className="flex-auto"
          autoFocus={true}
          aria-label="name"
          relativeJsonPath={examplePath}
          placeholder="Name..."
        />
        <Button
          className="ml-3"
          onClick={() => {
            handlePatch(nodeOperations.Remove, examplePath);
          }}
          icon="trash"
        />
      </div>
      <JsonEditor
        language={getEditorLanguage(mediaType)}
        value={content}
        onBlur={(e) => {
          handlePatchJson(nodeOperations.Replace, e);
        }}
      />
    </div>
  );
};

Example.propTypes = {
  examplePath: PropTypes.any,
  exampleValuePath: PropTypes.any,
  mediaType: PropTypes.any,
  inputRef: PropTypes.any,
};

export default Example;
