import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep} from 'lodash';
import Headers from './headers';
import BodySelector from '../../body-selector';
import MarkupEditor from '../../Editor/markdown';
import SchemaDesigner from '../Schema';
import {defaultSchema, ContentTypes} from '../../../utils';

const ResponseBody = ({response, onChange}) => {
  const [selectedMediaType, setSelectedMediaType] = useState(ContentTypes.json);
  //const [schema, setSchema] = useState(null);

  const hasMediaType =
    !!selectedMediaType &&
    Object.keys(response.content).indexOf(selectedMediaType) >= 0;

  const schema = hasMediaType
    ? response.content[selectedMediaType]?.schema
    : null;
  //useEffect(() => {
  //const hasMediaType =
  //!!selectedMediaType &&
  //Object.keys(response.content).indexOf(selectedMediaType) >= 0;

  //const _schema = hasMediaType
  //? response.content[selectedMediaType]?.schema
  //: null;
  ////setSchema(_schema);
  //}, [selectedMediaType, response.content]);

  const handleMediaType = (action, mediaType, oldMediaType) => {
    if (action === 'select') {
      setSelectedMediaType(mediaType);
    } else if (action === 'add') {
      //setSchema(defaultSchema.object);
      setSelectedMediaType(mediaType);
      onChange({
        ...response,
        content: {
          ...response.content,
          [mediaType]: {schema: defaultSchema.object},
        },
      });
    } else if (action === 'update') {
      setSelectedMediaType(mediaType);
      let clonedResponse = cloneDeep(response);
      clonedResponse.content[mediaType] =
        clonedResponse.content[oldMediaType]?.schema;
      delete clonedResponse.content[oldMediaType];
      onChange({...response, ...clonedResponse});
    } else if (action === 'delete') {
      // @TODO check if response has any contenttype left. If not,
      // trigger the deleteResponse event from here
      setSelectedMediaType(oldMediaType);
      let clonedResponse = cloneDeep(response);
      delete clonedResponse.content[mediaType];
      onChange({...response, ...clonedResponse});
    }
  };

  const handleSchemaChange = (schema) => {
    //setSchema(schema);
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
