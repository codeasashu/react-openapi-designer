import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {keys, difference, compact, sortBy} from 'lodash';
import {
  getValueFromStore,
  usePatchOperation,
  usePrevious,
} from '../../../../utils/selectors';
import {nodeOperations} from '../../../../utils/tree';
import {
  sortedStatusCodes,
  primaryStatusCodes,
  allStausCodes,
  statusCodesColor,
} from '../../../../model';
import {StoresContext} from '../../../Tree/context';
import {ButtonGroup, Button, Icon, ControlGroup} from '@blueprintjs/core';
import StatusCodeSuggest from '../../../Pickers/StatusCodeSuggest';
import Headers from './headers';
import Response from './response';
import {MarkdownEditor} from '../../../Editor';

const Responses = observer(({responsesPath}) => {
  const handlePatch = usePatchOperation();
  const responses = getValueFromStore(responsesPath, false);

  let codes = [];
  //let relativeJsonPaths = [];
  if (responses) {
    codes = keys(responses);
    //relativeJsonPaths = codes.map((i) => responsesPath.concat(i));
  }

  const stores = React.useContext(StoresContext);
  const uiStore = stores.uiStore;
  const statusCodes = sortBy(compact(codes));

  const [selectedCode, setSelectedCode] = React.useState(statusCodes[0]); // [u,l]
  const activeCodeIndex = statusCodes.indexOf(selectedCode); // d
  const prevActiveSymbolNodeId = usePrevious(uiStore.activeSymbolNodeId); // h
  const prevCodeIndex = usePrevious(activeCodeIndex); //f
  const prevStatusCodeLen = usePrevious(statusCodes.length); //p
  const g = React.useRef(null);
  const codeRef = React.useRef(null);
  const v = React.useRef(true);
  const contentPath = responsesPath.concat([selectedCode]); //y
  //const description = getValueFromStore(contentPath.concat('description')); //b

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
          <ControlGroup>
            <StatusCodeSuggest
              valueInPath={true}
              relativeJsonPath={contentPath}
              codes={statusCodes}
              activeCodeIndex={activeCodeIndex}
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
        </div>
      </div>
      <div className="border-l-2 border-gray-3 dark:border-darken-4 mt-8 py-1 pl-6">
        <>
          <MarkdownEditor
            language="md"
            placeholder="Response description..."
            relativeJsonPath={contentPath.concat(['description'])}
          />
          <Headers
            className="mt-6"
            headersPath={contentPath.concat(['headers'])}
          />
          <Response contentPath={contentPath.concat(['content'])} />
        </>
      </div>
    </div>
  );
});

Responses.propTypes = {
  responsesPath: PropTypes.array,
};

export default Responses;
