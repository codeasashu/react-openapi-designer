//@flow
import React from 'react';
import PropTypes from 'prop-types';
import Parameter from '../../../designers/parameter';

const Queries = ({queries, onChange}) => {
  const handleChange = (query, i) => {
    const newQueries = [...queries];
    newQueries[i] = {...query, in: 'query'};
    onChange(newQueries);
  };

  const handleDelete = (i) => {
    onChange(queries.filter((c, j) => j !== i));
  };

  return queries.length > 0 ? (
    <div className="mt-6">
      <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
        Queries
      </div>

      {queries.map((query, i) => {
        return (
          <Parameter
            name={query['name']}
            key={i}
            schema={query['schema']}
            description={query['description']}
            onChange={(e) => handleChange(e, i)}
            onDelete={() => handleDelete(i)}
          />
        );
      })}
    </div>
  ) : null;
};

Queries.propTypes = {
  onChange: PropTypes.func,
  queries: PropTypes.array,
};

export default Queries;
