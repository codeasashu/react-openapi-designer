import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {keys, difference, compact, sortBy} from 'lodash';
import {
  getValueFromStore,
  usePatchOperation,
  usePrevious,
} from '../../../../utils/selectors';
import {nodeOperations} from '../../../../datasets/tree';
import {
  statusCodes as allStausCodes,
  statusCodesColor,
  primaryStatusCodes,
  sortedStatusCodes,
} from '../../../../datasets/http';
import {StoresContext} from '../../../Context';
import {ButtonGroup, Button, Icon, ControlGroup} from '@blueprintjs/core';
import StatusCodeSuggest from '../../../Pickers/StatusCodeSuggest';
import Headers from './headers';
import Response from './response';
import Description from './description';

const Responses = observer(({responsesPath}) => {
  const handlePatch = usePatchOperation();
  const responses = getValueFromStore(responsesPath, false);

  let codes = [];
  if (responses) {
    // Don't parse default as a valid status code
    codes = keys(responses).filter((c) => c !== 'default');
  }

  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const statusCodes = sortBy(compact(codes));

  const [selectedCode, setSelectedCode] = React.useState(statusCodes[0]);
  const activeCodeIndex = statusCodes.indexOf(selectedCode);
  const prevActiveSymbolNodeId = usePrevious(uiStore.activeSymbolNodeId);
  const prevCodeIndex = usePrevious(activeCodeIndex);
  const prevStatusCodeLen = usePrevious(statusCodes.length);
  const g = React.useRef(null);
  const codeRef = React.useRef(null);
  const v = React.useRef(true);
  const contentPath = responsesPath.concat([selectedCode]);

  React.useEffect(() => {
    if (statusCodes.length) {
      if (uiStore.activeSymbolNodeId !== prevActiveSymbolNodeId) {
        setSelectedCode(statusCodes[0]);
      } else if (prevStatusCodeLen > statusCodes.length) {
        const prevCode = prevCodeIndex - 1;
        setSelectedCode(prevCode < 0 ? statusCodes[0] : statusCodes[prevCode]);
      }
    } else {
      setSelectedCode('');
    }
  }, [
    statusCodes,
    statusCodes.length,
    prevCodeIndex,
    prevStatusCodeLen,
    uiStore.activeSymbolNodeId,
  ]);

  React.useLayoutEffect(() => {
    if (v.current) {
      v.current = false;
    } else {
      if (codeRef.current && codeRef.current.buttonRef.scrollIntoView) {
        codeRef.current.buttonRef.scrollIntoView();
      }

      if (g.current) {
        g.current.focus();
      }
    }
  }, [selectedCode]);

  return (
    <div role="responses">
      <div className="flex items-center">
        <ButtonGroup
          className="flex-1 flex-no-wrap overflow-x-auto pb-4 -mb-4"
          aria-label="response-statuscode">
          <Button
            key="add"
            icon="plus"
            text="Response"
            onClick={() => {
              let _code = selectedCode === 'default' ? 0 : Number(selectedCode);
              let code = difference(
                primaryStatusCodes,
                statusCodes.map(Number),
              ).find((e) => _code < e);
              if (!code) {
                code = difference(
                  sortedStatusCodes,
                  statusCodes.map(Number),
                ).find((e) => _code < e);
              }
              if (!code) {
                if (_code < 100) {
                  _code = primaryStatusCodes[0];
                }

                const strStatusCodes = statusCodes.map(String);

                for (
                  code = _code + 1;
                  strStatusCodes.includes(String(_code));

                ) {
                  code++;
                }
              }

              const responseSchema = {
                description: allStausCodes[code] || '',
              };
              if (statusCodes.length <= 0) {
                handlePatch(nodeOperations.Add, responsesPath, {});
              }

              handlePatch(
                nodeOperations.Add,
                responsesPath.concat([code]),
                responseSchema,
              );
              setSelectedCode(String(code));
            }}
          />
          {statusCodes.map((code, i) => {
            if (!code) {
              return null;
            }
            const isSelected = code === selectedCode;
            return (
              <Button
                key={i}
                ref={(e) => selectedCode && (codeRef.current = e)}
                active={isSelected}
                data-testid={`code-${code}`}
                text={code}
                icon={
                  <Icon
                    icon="full-circle"
                    iconSize={10}
                    color={statusCodesColor[code[0]]}
                  />
                }
                onClick={() => setSelectedCode(code)}
              />
            );
          })}
        </ButtonGroup>
        <div className="ml-3">
          {statusCodes.length > 0 && (
            <ControlGroup>
              <StatusCodeSuggest
                valueInPath={true}
                relativeJsonPath={contentPath}
                codes={statusCodes}
                activeCodeIndex={activeCodeIndex}
                onPatch={(e) => {
                  setSelectedCode(e);
                }}
              />
              <Button
                title="Remove"
                icon={<Icon icon="trash" iconSize={12} />}
                onClick={() => {
                  if (statusCodes.length > 1) {
                    handlePatch(nodeOperations.Remove, contentPath);
                  } else {
                    handlePatch(nodeOperations.Remove, responsesPath);
                  }
                }}
              />
            </ControlGroup>
          )}
        </div>
      </div>
      {statusCodes.length > 0 && (
        <div
          className="border-l-2 border-gray-3 dark:border-darken-4 mt-8 py-1 pl-6 response"
          data-testid={`response-${selectedCode}`}>
          <>
            <Description relativeJsonPath={contentPath.concat('description')} />
            <Headers
              className="mt-6"
              headersPath={contentPath.concat(['headers'])}
            />
            <Response
              className="mt-8"
              contentPath={contentPath.concat(['content'])}
            />
          </>
        </div>
      )}
    </div>
  );
});

Responses.propTypes = {
  responsesPath: PropTypes.array,
};

export default Responses;
