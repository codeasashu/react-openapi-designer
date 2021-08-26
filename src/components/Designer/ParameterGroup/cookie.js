//@flow
import React from 'react';
import PropTypes from 'prop-types';
import Parameter from '../../../designers/parameter';

const Cookie = ({cookies, onChange}) => {
  const handleChange = (cookie, i) => {
    const newCookies = [...cookies];
    newCookies[i] = {...cookie, in: 'cookie'};
    onChange(newCookies);
  };

  const handleDelete = (i) => {
    onChange(cookies.filter((c, j) => j !== i));
  };

  return cookies.length > 0 ? (
    <div className="mt-6">
      <div className="font-semibold ml-1 mb-2 text-gray-6 dark:text-gray-4">
        Cookies
      </div>

      {cookies.map((cookie, i) => {
        return (
          <Parameter
            name={cookie['name']}
            key={i}
            schema={cookie['schema']}
            description={cookie['description']}
            onChange={(e) => handleChange(e, i)}
            onDelete={() => handleDelete(i)}
          />
        );
      })}
    </div>
  ) : null;
};

Cookie.propTypes = {
  onChange: PropTypes.func,
  cookies: PropTypes.array,
};

export default Cookie;
