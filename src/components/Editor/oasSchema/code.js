import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import {Button, Callout} from '@blueprintjs/core';
import {JsonEditor} from 'components/Editor';

const Code = ({onGenerateSchema, onCancel}) => {
  const [userCode, setUserCode] = useState('{}');
  const [validGeneratedJson, setValidGeneratedJson] = useState(false);

  const reset = () => {
    setUserCode('{}');
    setValidGeneratedJson(false);
  };

  React.useEffect(() => {
    try {
      const _userCode = JSON.parse(userCode);
      if (!isEmpty(_userCode)) {
        setValidGeneratedJson(true);
      }
    } catch (e) {
      setValidGeneratedJson(false);
    }
  }, [userCode]);

  const handleGenerateCode = () => {
    try {
      onGenerateSchema(userCode);
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
  onGenerateSchema: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Code;
