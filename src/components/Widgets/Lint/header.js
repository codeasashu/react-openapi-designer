import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Icon, Intent} from '@blueprintjs/core';
import {StoresContext} from '../../Context';
import {observer} from 'mobx-react';
import {DiagnosticSeverity} from '@stoplight/types';

const Header = observer((props) => {
  const stores = React.useContext(StoresContext);
  const {errors, hints, info, warning} = stores.lintStore;
  return (
    <div className="flex flex-row items-baseline">
      <ButtonGroup className="ml-4 mt-2">
        <Button
          minimal
          outlined
          small
          onClick={() => props.onClick(DiagnosticSeverity.Error)}
          text={
            <div className="flex justify-center">
              <Icon
                size={14}
                icon="error"
                intent={Intent.DANGER}
                className="m-auto pl-2 pr-1"
              />
              <span className="counter m-auto">{errors.length}</span>
            </div>
          }
        />
        <Button
          minimal
          outlined
          small
          onClick={() => props.onClick(DiagnosticSeverity.Warning)}
          text={
            <div className="flex justify-center">
              <Icon
                size={14}
                intent={Intent.WARNING}
                icon="warning-sign"
                className="m-auto pl-2 pr-1"
              />
              <span className="counter m-auto">{warning.length}</span>
            </div>
          }
        />
        <Button
          minimal
          outlined
          small
          onClick={() => props.onClick(DiagnosticSeverity.Information)}
          text={
            <div className="flex justify-center">
              <Icon
                size={14}
                icon="info-sign"
                intent={Intent.PRIMARY}
                className="m-auto pl-2 pr-1"
              />
              <span className="counter m-auto">{info.length}</span>
            </div>
          }
        />
        <Button
          minimal
          outlined
          small
          onClick={() => props.onClick(DiagnosticSeverity.Hint)}
          text={
            <div className="flex justify-center">
              <Icon
                size={14}
                icon="lightbulb"
                intent={Intent.SUCCESS}
                className="m-auto pl-2 pr-1"
              />
              <span className="counter m-auto">{hints.length}</span>
            </div>
          }
        />
      </ButtonGroup>
      {props.children}
    </div>
  );
});

Header.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
};

export default Header;
