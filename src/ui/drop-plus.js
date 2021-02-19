import React from 'react';
import { SvgIcon, Dropdown, DropdownItem } from 'insomnia-components';
import LocaleProvider from '../locale';
import { StyledActions } from './index';

const DropPlus = props => {
  return (
    <Dropdown
      renderButton={() => (
        <StyledActions height="100%">
          <SvgIcon icon="plus" />
        </StyledActions>
      )}>
      <DropdownItem>
        <span onClick={props.handleAddField}>{LocaleProvider('sibling_node')}</span>
      </DropdownItem>
      <DropdownItem>
        <span onClick={props.handleAddChildField}>{LocaleProvider('child_node')}</span>
      </DropdownItem>
    </Dropdown>
  );
};

export default DropPlus;
