import React from 'react';
import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import LocaleProvider from '../locale';

const DropPlus = props => {
  const dropMenu = <Menu>
      <MenuItem text={LocaleProvider('sibling_node')} onClick={props.handleAddField} />
      <MenuItem text={LocaleProvider('child_node')} onClick={props.handleAddChildField} />
    </Menu>;
  return (
    <Popover2 content={dropMenu} placement="right-end">
        <Button minimal small icon="plus" />
    </Popover2>
  );
};

export default DropPlus;
