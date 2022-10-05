import React from 'react';
import PropTypes from 'prop-types';
import {Overlay, NonIdealState, ProgressBar, Spinner} from '@blueprintjs/core';

const Import = ({open}) => {
  const description = (
    <div>
      <span>Please wait while we are importing your spec...</span>
      <ProgressBar />
    </div>
  );
  return (
    <Overlay isOpen={open}>
      <NonIdealState
        icon={<Spinner />}
        iconSize={12}
        title="Please wait"
        description={description}
        layout="vertical"
      />
    </Overlay>
  );
};

Import.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Import;
