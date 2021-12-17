import React from 'react';
import PropTypes from 'prop-types';
import {DiagnosticSeverity} from '@stoplight/types';
import {AnchorButton, Icon, Intent} from '@blueprintjs/core';
import {Tooltip2} from '@blueprintjs/popover2';

const determineIcon = (severity) => {
  switch (severity) {
    case DiagnosticSeverity.Error:
      return <Icon size={14} icon="error" intent={Intent.DANGER} />;
    case DiagnosticSeverity.Warning:
      return <Icon size={14} icon="warning-sign" intent={Intent.WARNING} />;
    case DiagnosticSeverity.Hint:
      return <Icon size={14} icon="lightbulb" intent={Intent.SUCCESS} />;
    case DiagnosticSeverity.Info:
      return <Icon size={14} icon="info-sign" intent={Intent.PRIMARY} />;
    default:
      return null;
  }
};

const Row = ({result}) => {
  return (
    <div className="flex items-center text-sm px-4 cursor-pointer bg-darken-1">
      <div className="flex justify-center p-2" style={{width: '5%'}}>
        {determineIcon(result.severity)}
      </div>
      <div className="flex justify-center p-2" style={{width: '15%'}}>
        {result.range.start.line}
      </div>
      <div className="h-full flex-1 flex items-center truncate">
        <div className="flex-1 truncate">{result.message}</div>
        <div className="h-full ml-2 text-center flex items-center">
          <Tooltip2 content={<div className="text-sm">{result.code}</div>}>
            <AnchorButton
              minimal
              className="p-0"
              text={<Icon size={14} icon="lightbulb" />}
            />
          </Tooltip2>
          <Tooltip2
            content={<div className="text-sm">{result.path.join(' > ')}</div>}>
            <AnchorButton
              minimal
              className="p-0"
              text={<Icon size={14} icon="locate" />}
            />
          </Tooltip2>
        </div>
      </div>
    </div>
  );
};

Row.propTypes = {
  result: PropTypes.object,
};

export default Row;
