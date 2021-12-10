import React from 'react';
import PropTypes from 'prop-types';
import {RedocStandalone} from 'redoc';
//import theme from './theme';

const Redoc = ({spec}) => {
  return (
    <div className="bg-white">
      <RedocStandalone
        spec={spec}
        options={{
          disableSearch: true,
        }}
      />
    </div>
  );
};

Redoc.propTypes = {
  spec: PropTypes.object,
};

export default Redoc;
