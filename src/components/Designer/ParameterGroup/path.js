// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@blueprintjs/core';
import {defaultSchema} from '../../../utils';
import Parameter from '../../../designers/parameter';

const Path = ({parameters, onChange}) => {
  return (
    <React.Fragment>
      <div className="flex items-center mt-5 mb-2">
        <div className="font-semibold text-gray-600 ml-1">Path parameters</div>
        <Button
          small
          minimal
          className="ml-1"
          icon="plus"
          aria-label="add row"
          onClick={() =>
            onChange(
              {
                in: 'path',
                name: '',
                description: '',
                schema: defaultSchema.string,
              },
              -1,
            )
          }
        />
      </div>
      {parameters.map((parameter, i) => (
        <Parameter
          key={i}
          name={parameter.name}
          schema={parameter?.schema}
          description={parameter?.description}
          disableRequired={true}
          onChange={(e) => onChange({...parameter, ...e}, i)}
          onDelete={() => onChange(null, i)}
        />
      ))}
    </React.Fragment>
  );
};

Path.propTypes = {
  parameters: PropTypes.array,
  onChange: PropTypes.func,
};

export default Path;
