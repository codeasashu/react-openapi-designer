// @flow
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import BodySelector from 'components/body-selector';
import SchemaDesigner from 'components/Designer/Schema';
import {MarkdownEditor as Markdown} from 'components/Editor';
import {defaultSchema} from '../../../model';

const RequestBody = ({requestBody, onChange}) => {
  const [selectedContentType, setSelectedContentType] = useState();
  const [selectedSchema, setSelectedSchema] = useState({});

  useEffect(() => {
    const newSchema = requestBody.content[selectedContentType]?.schema;
    setSelectedSchema(newSchema);
  }, [selectedContentType]);

  return (
    <div>
      <BodySelector
        contentTypes={requestBody ? Object.keys(requestBody.content) : []}
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
        onSelect={(e) => {
          setSelectedContentType(e.toLowerCase());
        }}
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
      <div className="flex-1">
        <Markdown
          className="mt-6 -mx-1 relative hover:bg-darken-2 rounded-lg"
          placeholder="abcdef"
        />
      </div>
      <div className="mt-6">
        <SchemaDesigner
          dark
          initschema={selectedSchema}
          namespace="requestBody"
          onChange={(e) => {
            setSelectedSchema(e);
            onChange({
              ...requestBody,
              content: {
                ...requestBody.content,
                [selectedContentType]: {schema: e},
              },
            });
          }}
        />
      </div>
    </div>
  );
};

RequestBody.propTypes = {
  requestBody: PropTypes.object,
  onChange: PropTypes.func,
};

export default RequestBody;
