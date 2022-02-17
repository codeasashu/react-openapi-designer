import React from 'react';
import PropTypes from 'prop-types';
import {Button, Menu, MenuItem} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
//@TODO Move to selectors
import SchemaSelectors from '../../elements/schema-selectors';
import LocaleProvider from '../../utils/locale';

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

type DropPlusProps = {
  handleAddField: PropTypes.func,
  handleAddChildField: PropTypes.func,
};

const DropPlus = (props: DropPlusProps) => {
  const dropMenu = (
    <Menu>
      <MenuItem
        text={LocaleProvider('sibling_node')}
        onClick={props.handleAddField}
      />
      <MenuItem
        text={LocaleProvider('child_node')}
        onClick={props.handleAddChildField}
      />
    </Menu>
  );
  return (
    <Popover2 content={dropMenu} placement="right-end">
      <Button minimal small icon="plus" aria-label="add child" />
    </Popover2>
  );
};

export {DropPlus, SchemaDropdown};
