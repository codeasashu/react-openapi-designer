// @flow
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {ControlGroup, Button} from '@blueprintjs/core';
import BodySelector from 'components/Pickers/ContentType';
import SchemaDesigner from 'components/Designer/Schema';
import {MarkdownEditor as Markdown} from 'components/Editor';
import {defaultSchema} from '../../../model';
import {sortContentTypes, ContentTypes} from '../../../utils';

const RequestBody = ({requestBody, onChange}) => {
  const getDefaultContentType = () => {
    if (!requestBody || !requestBody.content) {
      return undefined;
    }
    const sortedContentTypes = sortContentTypes(
      Object.keys(requestBody.content),
      [ContentTypes.json, ContentTypes.form, ContentTypes.multipart],
    );
    return sortedContentTypes.length ? sortedContentTypes[0] : null;
  };

  const [selectedContentType, setSelectedContentType] = useState(
    getDefaultContentType(),
  );
  const [selectedSchema, setSelectedSchema] = useState(
    requestBody.content
      ? requestBody.content[selectedContentType]?.schema
      : null,
  );

  useEffect(() => {
    if (requestBody && requestBody.content) {
      const newSchema = requestBody.content[selectedContentType]?.schema;
      setSelectedSchema(newSchema);
    }
  }, [selectedContentType]);

  const handleSchemaChange = (schema) => {
    setSelectedSchema(schema);
    const newSchema = {
      ...requestBody,
      content: {
        ...requestBody.content,
        [selectedContentType]: {schema},
      },
    };
    onChange(newSchema);
  };

  return requestBody.content === undefined ? (
    <div className="flex items-center">
      <ControlGroup className="flex-1">
        <Button
          icon="plus"
          text="Add Body"
          onClick={() => {
            onChange({
              content: {
                'application/json': {schema: defaultSchema.object},
              },
            });
            setSelectedContentType('application/json');
          }}
        />
      </ControlGroup>
    </div>
  ) : (
    <div>
      <BodySelector
        selected={selectedContentType}
        contentTypes={
          requestBody?.content ? Object.keys(requestBody.content) : []
        }
        onAdd={(e) => {
          setSelectedContentType(e.toLowerCase());
          onChange({
            ...requestBody,
            content: {
              ...requestBody.content,
              [e]: {schema: defaultSchema.object},
            },
          });
        }}
        onSelect={setSelectedContentType}
        onUpdate={(e) => {
          const {content, ...restOfRequestBody} = requestBody;
          const {[selectedContentType]: originalSchema, ...rest} = content;
          onChange({
            ...restOfRequestBody,
            content: {...rest, [e]: originalSchema},
          });
        }}
        onDelete={() => {
          const {content, ...restOfRequestBody} = requestBody;
          //eslint-disable-next-line no-unused-vars
          const {[selectedContentType]: originalSchema, ...rest} = content;
          onChange({
            ...restOfRequestBody,
            content: rest,
          });
        }}
      />
      {requestBody.content && (
        <div className="flex-1">
          <Markdown
            className="mt-6 -mx-1 relative hover:bg-darken-2 rounded-lg"
            placeholder="abcdef"
          />
        </div>
      )}
      {selectedSchema && (
        <div className="mt-6">
          <SchemaDesigner
            dark
            initschema={selectedSchema}
            namespace="requestBody"
            onChange={handleSchemaChange}
          />
        </div>
      )}
    </div>
  );
};

RequestBody.propTypes = {
  requestBody: PropTypes.object,
  onChange: PropTypes.func,
};

export default RequestBody;
