import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Callout} from '@blueprintjs/core';
import {JsonEditor} from 'components/Editor';

const Code = ({generateSchema, onCancel}) => {
  const [userCode, setUserCode] = useState('{}');
  const [validGeneratedJson, setValidGeneratedJson] = useState(false);

  const reset = () => {
    setUserCode('{}');
    setValidGeneratedJson(false);
  };

  const handleGenerateCode = () => {
    try {
      generateSchema(userCode);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-4 my-3">
      <div className="mb-2">
        <Button
          icon="clean"
          outlined
          intent="primary"
          disabled={!validGeneratedJson}
          onClick={handleGenerateCode}>
          Generate
        </Button>
        <Button icon="small-cross" outlined className="ml-2" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <Callout className="mb-2">
        Paste or write a JSON example below, then click <em>Generate</em>
        above to build a schema.
      </Callout>
      <div>
        <JsonEditor value={userCode} onChange={setUserCode} />
      </div>
    </div>
  );
};

Code.propTypes = {
  generateSchema: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Code;
