// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Button, Menu, MenuItem} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
import LocaleProvider from '../locale';

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
      <Button minimal small icon="plus" />
    </Popover2>
  );
};

export default DropPlus;
