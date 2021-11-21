//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {keys, difference, uniq, sortBy} from 'lodash';
//import Description from './description';
//import Parameters from './parameters';
import {
  getValueFromStore,
  usePatchOperation,
} from '../../../../utils/selectors';
import {Button, ControlGroup, HTMLSelect, Icon} from '@blueprintjs/core';
import {nodeOperations} from '../../../../datasets/tree';
import {contentTypes as allContentTypes} from '../../../../datasets/http';
import ContentTypeSuggest from '../../../Pickers/ContentTypeSuggest';
//import {MarkdownEditor} from '../../../Editor';
//import SchemaDesigner from '../../../Designer/Schema';
import SchemaDesigner from '../../../Editor/oasSchema';

const Response = observer(({className, contentPath}) => {
  const handlePatch = usePatchOperation();
  const contentTypes = getValueFromStore(contentPath, false);
  let mediaTypes = [];
  //let relativeJsonPaths = [];
  if (contentTypes) {
    mediaTypes = keys(contentTypes);
    //relativeJsonPaths = mediaTypes.map((i) => contentPath.concat(i));
  }

  const hasMediaType = mediaTypes && mediaTypes.length > 0;

  const [mediaType, setMediaType] = React.useState(
    hasMediaType ? mediaTypes[0] : undefined,
  );
  const mediaRef = React.useRef(null);

  //const stores = React.useContext(StoresContext);
  //const parameterJsonPath = mapParametersJsonPaths(relativeJsonPath);

  //const {
  //activeSourceNode,
  //} = stores.uiStore;

  //const handlePatch = usePatchOperation();

  return (
    <div className={className}>
      <div className="flex items-center">
        <ControlGroup className="flex-1">
          <Button
            icon="plus"
            text="Add Body"
            onClick={() => {
              const newContentType =
                difference(allContentTypes, mediaTypes)[0] || 'new';

              handlePatch(
                nodeOperations.Add,
                contentPath.concat([newContentType]),
                {
                  schema: {
                    type: 'object',
                    properties: {},
                  },
                },
              );

              setMediaType(newContentType);

              if (mediaRef.current) {
                mediaRef.current.focus();
              }
            }}
          />
          {hasMediaType && (
            <HTMLSelect
              options={mediaTypes.map((e) => ({
                value: e,
              }))}
              value={mediaType}
              onChange={(e) => {
                setMediaType(e.currentTarget.value);
              }}
            />
          )}
        </ControlGroup>
        {hasMediaType && mediaType && (
          <ControlGroup>
            <ContentTypeSuggest
              inputRef={mediaRef}
              items={sortBy(
                uniq(difference(allContentTypes, mediaTypes).concat(mediaType)),
              )}
              onItemSelect={(selectedMediaType) => {
                handlePatch(
                  nodeOperations.Move,
                  contentPath.concat([mediaType]),
                  contentPath.concat([selectedMediaType]),
                );
                setMediaType(selectedMediaType);
              }}
              selectedItem={mediaType}
              allowCreate={true}
            />
            <Button
              title="remove"
              icon={<Icon icon="trash" iconSize={12} />}
              onClick={() => {
                const otherMediaType = mediaTypes.find((e) => e !== mediaType);

                if (otherMediaType) {
                  handlePatch(
                    nodeOperations.Remove,
                    contentPath.concat(mediaType),
                  );
                  setMediaType(otherMediaType);
                } else {
                  handlePatch(nodeOperations.Remove, contentPath.slice(0, -1));
                  setMediaType(undefined);
                }
              }}
            />
          </ControlGroup>
        )}
      </div>
      {mediaType && hasMediaType && (
        <SchemaDesigner
          className="mt-6"
          relativeJsonPath={contentPath.concat([mediaType, 'schema'])}
        />
      )}
    </div>
  );
});

Response.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Response;
