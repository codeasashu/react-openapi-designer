// @flow
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import StatusCode from './statusCode';
import ResponseBody from './body';
import {defaultSchema} from '../../../model';
import {ContentTypes} from '../../../utils';

const Response = ({dark, responses, onChange, ...props}) => {
  const codes = Object.keys(responses)
    .map((e) => parseInt(e))
    .filter((e) => !isNaN(e))
    .sort();
  const [selectedCode, setSelectedCode] = useState(codes[0]);
  const [selectedResponse, setSelectedResponse] = useState(
    responses[selectedCode],
  );

  const addDefaultResponse = (code) => {
    return {
      ...responses,
      [code]: {
        content: {[ContentTypes.json]: {schema: defaultSchema.object}},
      },
    };
  };

  useEffect(() => {
    setSelectedResponse(responses[selectedCode]);
  }, [selectedCode]);

  return (
    <div className={`flex flex-col ${dark && 'bp3-dark'}`}>
      <StatusCode
        statuses={codes}
        onSelect={(code) => setSelectedCode(code)}
        onAdd={(code) => {
          onChange(addDefaultResponse(code));
          setSelectedCode(code);
        }}
        onDelete={() => {}}
      />
      <ResponseBody
        response={selectedResponse}
        onChange={(response) => {
          setSelectedResponse(response);
          onChange({[selectedCode]: response});
        }}
        {...props}
      />
    </div>
  );
};

Response.propTypes = {
  dark: PropTypes.bool,
  responses: PropTypes.object,
  onChange: PropTypes.func,
};

export default Response;
