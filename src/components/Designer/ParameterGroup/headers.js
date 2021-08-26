//@flow
import React from 'react';
import PropTypes from 'prop-types';
import Parameter from '../../../designers/parameter';

const Headers = ({headers, onChange}) => {
  const handleChange = (header, i) => {
    const newHeaders = [...headers];
    newHeaders[i] = {...header, in: 'header'};
    onChange(newHeaders);
  };

  const handleDelete = (i) => {
    onChange(headers.filter((c, j) => j !== i));
  };

  return headers.length > 0 ? (
    <div className="mt-6">
      <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
        Headers
      </div>

      {headers.map((header, i) => {
        return (
          <Parameter
            name={header['name']}
            key={i}
            schema={header['schema']}
            description={header['description']}
            onChange={(e) => handleChange(e, i)}
            onDelete={() => handleDelete(i)}
          />
        );
      })}
    </div>
  ) : null;
};

Headers.propTypes = {
  onChange: PropTypes.func,
  headers: PropTypes.array,
};

export default Headers;
