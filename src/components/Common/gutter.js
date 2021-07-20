import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledGutter = styled.div`
  cursor: col-resize;
  height: 100%;
  margin-left: -4px;
  left: 4px;
  position: relative;
  z-index: 1;
`;

const Gutter = (props) => {
  const layout = props.layout || 'horizontal';
  return (
    <StyledGutter
      className={`gutter gutter-${layout}`}
      style={{width: '4px'}}
    />
  );
};

Gutter.propTypes = {
  layout: PropTypes.string,
};

export default Gutter;
