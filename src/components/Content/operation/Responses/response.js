//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {keys, difference, uniq, sortBy} from 'lodash';
import {
  getValueFromStore,
  usePatchOperation,
} from '../../../../utils/selectors';
import {Button, ControlGroup, HTMLSelect, Icon} from '@blueprintjs/core';
import {nodeOperations} from '../../../../datasets/tree';
import {contentTypes as allContentTypes} from '../../../../datasets/http';
import ContentTypeSuggest from '../../../Pickers/ContentTypeSuggest';
import SchemaDesigner from '../../../Editor/JsonSchema';

const Response = observer(({className, contentPath}) => {
  const handlePatch = usePatchOperation();
  const contentTypes = getValueFromStore(contentPath, false);
  let mediaTypes = [];
  if (contentTypes) {
    mediaTypes = keys(contentTypes);
  }

  const hasMediaType = mediaTypes && mediaTypes.length > 0;

  const [mediaType, setMediaType] = React.useState(
    hasMediaType ? mediaTypes[0] : undefined,
  );
  const mediaRef = React.useRef(null);

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
              data-testid="select-mediatype"
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
              data-testid="suggest-mediatype"
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
          schemaPath={contentPath.concat([mediaType, 'schema'])}
          examplesPath={contentPath.concat([mediaType, 'examples'])}
        />
      )}
    </div>
  );
});

Response.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Response;
