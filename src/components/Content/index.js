import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

class Content extends React.Component {
  render() {
    return (
      <StyledContent className={''}>
        <p>Hello Content</p>
      </StyledContent>
    );
  }
}

export default Content;
