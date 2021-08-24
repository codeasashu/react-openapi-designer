// @flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import StatusCode from './statusCode';
import ResponseBody from './body';

const Response = ({dark, responses, onChange, ...props}) => {
  const codes = Object.keys(responses)
    .map((e) => parseInt(e))
    .filter((e) => !isNaN(e))
    .sort();
  const [selectedCode, setSelectedCode] = useState(codes[0]);
  return (
    <div className={`flex flex-col ${dark && 'bp3-dark'}`}>
      <StatusCode statuses={codes} onSelect={(code) => setSelectedCode(code)} />
      <ResponseBody
        response={responses[selectedCode]}
        onChange={(response) => onChange({[selectedCode]: response})}
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
