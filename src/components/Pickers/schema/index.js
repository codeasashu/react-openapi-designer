//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Popover2} from '@blueprintjs/popover2';
import SchemaSelectors from './selectors';

const SchemaDropdown = ({schema, handleOnClick, children, ...props}) => {
  return (
    <Popover2
      {...props}
      className="schema-selector p-1 pt-0"
      popoverClassName="bp4-dark"
      inheritDarkTheme
      content={<SchemaSelectors schema={schema} onClick={handleOnClick} />}
      placement="right">
      {children}
    </Popover2>
  );
};

SchemaDropdown.propTypes = {
  schema: PropTypes.object,
  handleOnClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default SchemaDropdown;
