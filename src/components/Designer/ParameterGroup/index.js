import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button} from '@blueprintjs/core';
import {defaultSchema} from '../../../model';
import Headers from './headers';
import Cookie from './cookie';
import Query from './query';

const ParameterGroup = ({parameters, onChange}) => {
  const headers = parameters.filter((p) => p['in'] == 'header');
  const cookies = parameters.filter((p) => p['in'] == 'cookie');
  const queries = parameters.filter((p) => p['in'] == 'query');

  const addParameter = (_in) => {
    onChange([...parameters, {schema: defaultSchema.string, in: _in}]);
  };

  const handleParamChange = (params, _in) => {
    const otherParams = parameters.filter((p) => p['in'] !== _in);
    onChange([...otherParams, ...params]);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          text="Security"
          icon="plus"
          onClick={() => addParameter('security')}
        />
        <Button
          text="Header"
          icon="plus"
          onClick={() => addParameter('header')}
        />
        <Button
          text="Query Param"
          icon="plus"
          onClick={() => addParameter('query')}
        />
        <Button
          text="Cookie"
          icon="plus"
          onClick={() => addParameter('cookie')}
        />
      </ButtonGroup>
      <Headers
        headers={headers}
        onChange={(e) => handleParamChange(e, 'header')}
      />
      <Query
        queries={queries}
        onChange={(e) => handleParamChange(e, 'query')}
      />
      <Cookie
        cookies={cookies}
        onChange={(e) => handleParamChange(e, 'cookie')}
      />
    </>
  );
};

ParameterGroup.propTypes = {
  onChange: PropTypes.func,
  parameters: PropTypes.array,
};

export default ParameterGroup;
