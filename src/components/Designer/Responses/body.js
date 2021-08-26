import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Headers from './headers';
import BodySelector from '../../body-selector';
import MarkupEditor from '../../Editor/markdown';
import SchemaDesigner from '../Schema';
import {defaultSchema, ContentTypes} from '../../../utils';

const ResponseBody = ({response, onChange}) => {
  const [selectedMediaType, setSelectedMediaType] = useState(ContentTypes.json);
  const [schema, setSchema] = useState({});

  useEffect(() => {
    const newSchema = response.content[selectedMediaType]?.schema;
    setSchema(newSchema);
  }, [selectedMediaType]);

  const handleMediaType = (action, mediaType) => {
    if (action === 'select') {
      setSelectedMediaType(mediaType);
    } else if (action === 'add') {
      setSelectedMediaType(mediaType);
      onChange({
        ...response,
        content: {
          ...response.content,
          [mediaType]: {schema: defaultSchema.object},
        },
      });
    } else if (action === 'update') {
      const {content, ...restOfResponse} = response;
      const {[selectedMediaType]: originalSchema, ...rest} = content;
      onChange({
        ...restOfResponse,
        content: {...rest, [mediaType]: originalSchema},
      });
    } else if (action === 'delete') {
      // @TODO check if response has any contenttype left. If not,
      // trigger the deleteResponse event from here
      const {content, ...restOfResponse} = response;
      //eslint-disable-next-line no-unused-vars
      const {[selectedMediaType]: originalSchema, ...rest} = content;
      onChange({
        ...restOfResponse,
        content: rest,
      });
    }
  };

  const handleSchemaChange = (schema) => {
    const newResponse = {
      ...response,
      content: {...response.content, [selectedMediaType]: {schema}},
    };
    onChange(newResponse);
  };

  return (
    <>
      <div className="flex-1">
        <MarkupEditor
          value={response.description}
          onChange={(e) => onChange({...response, description: e})}
        />
      </div>
      <Headers
        parameters={response.headers}
        onChange={(e) => onChange({...response, headers: e})}
      />
      <div className="mt-8">
        <BodySelector
          contentTypes={Object.keys(response.content)}
          onSelect={(c) => handleMediaType('select', c)}
          onAdd={(c) => handleMediaType('add', c)}
          onDelete={(_new, _old) => handleMediaType('delete', _new, _old)}
          onUpdate={(_new, _old) => handleMediaType('update', _new, _old)}
        />

        <div className="mt-8">
          <SchemaDesigner
            dark
            namespace="response"
            initschema={schema}
            onChange={handleSchemaChange}
          />
        </div>
      </div>
    </>
  );
};

ResponseBody.propTypes = {
  response: PropTypes.object,
  onChange: PropTypes.func,
};

export default ResponseBody;
