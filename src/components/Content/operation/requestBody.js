import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {keys, difference, uniq, sortBy} from 'lodash';
//import Description from './description';
//import Parameters from './parameters';
import {getValueFromStore, usePatchOperation} from '../../../utils/selectors';
import {Button, ControlGroup, HTMLSelect, Icon} from '@blueprintjs/core';
import {nodeOperations} from '../../../datasets/tree';
import {contentTypes as allContentTypes} from '../../../datasets/http';
import ContentTypeSuggest from '../../Pickers/ContentTypeSuggest';
import {MarkdownEditor} from '../../Editor';
// import SchemaDesigner from '../../Editor/oasSchema';
import SchemaDesigner from '../../Editor/JsonSchema';

const RequestBody = observer(({className, contentPath, descriptionPath}) => {
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

  const description = getValueFromStore(descriptionPath);

  return (
    <div className={className} aria-label="request-body">
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
      {mediaType && descriptionPath && (
        <MarkdownEditor
          language="md"
          className="mt-6 -mx-1"
          placeholder="Request Body description..."
          value={description || ''}
          onChange={(e) =>
            handlePatch(nodeOperations.Replace, descriptionPath, e)
          }
        />
      )}
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

RequestBody.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default RequestBody;
