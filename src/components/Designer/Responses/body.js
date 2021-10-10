import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Headers from './headers';
import BodySelector from 'components/Pickers/ContentType';
import SchemaDesigner from '../Schema';
import {defaultSchema, sortContentTypes, ContentTypes} from '../../../utils';
import {nodeOperations} from '../../../utils/tree';
import {getValueFromStore, usePatchOperation} from '../../../utils/selectors';

const getDefaultContentType = (contentTypes) => {
  const sortedContentTypes = sortContentTypes(contentTypes, [
    ContentTypes.json,
    ContentTypes.html,
    ContentTypes.text,
  ]);
  return sortedContentTypes.length ? sortedContentTypes[0] : null;
};

const ResponseBody = ({relativeJsonPath}) => {
  const handlePatch = usePatchOperation();
  const responseContents = getValueFromStore(
    relativeJsonPath.concat(['content']),
  );
  const responseHeaders = getValueFromStore(
    relativeJsonPath.concat(['headers']),
  );
  const responseContentTypes = Object.keys(responseContents) || [];
  const [selectedMediaType, setSelectedMediaType] = useState(
    getDefaultContentType(responseContentTypes),
  );

  useEffect(() => {
    if (Object.keys(responseContents).indexOf(selectedMediaType) < 0) {
      setSelectedMediaType(ContentTypes.json);
    }
  }, [responseContents]);

  const handleMediaType = (action, mediaType) => {
    if (action === 'select') {
      setSelectedMediaType(mediaType);
    } else if (action === 'add') {
      //eslint-disable-next-line no-unused-vars
      const {[mediaType]: originalSchema, ...rest} = responseContents;
      handlePatch(
        nodeOperations.Replace,
        relativeJsonPath.concat(['content', mediaType]),
        {schema: originalSchema?.schema || defaultSchema.object},
      );
      setSelectedMediaType(mediaType);
    } else if (action === 'update') {
      const {[selectedMediaType]: originalSchema, ...rest} = responseContents;
      handlePatch(
        nodeOperations.Replace,
        relativeJsonPath.concat(['content']),
        {...rest, [mediaType]: originalSchema},
      );
    } else if (action === 'delete') {
      //eslint-disable-next-line no-unused-vars
      const {[selectedMediaType]: originalSchema, ...rest} = responseContents;
      handlePatch(
        nodeOperations.Replace,
        relativeJsonPath.concat(['content']),
        {...rest},
      );
      setSelectedMediaType(getDefaultContentType(responseContentTypes));
    }
  };

  return (
    <>
      <Headers
        parameters={responseHeaders}
        onChange={(e) => {
          handlePatch(
            nodeOperations.Replace,
            relativeJsonPath.concat(['headers']),
            e,
          );
        }}
      />
      <div className="mt-8">
        <BodySelector
          via="response"
          selected={selectedMediaType}
          contentTypes={responseContentTypes}
          onSelect={(c) => handleMediaType('select', c)}
          onAdd={(c) => handleMediaType('add', c)}
          onDelete={(_new, _old) => handleMediaType('delete', _new, _old)}
          onUpdate={(_new, _old) => handleMediaType('update', _new, _old)}
        />

        <div className="mt-8">
          <SchemaDesigner
            dark
            namespace="response"
            initschema={responseContents[selectedMediaType]?.schema}
            onChange={(e) => {
              handlePatch(
                nodeOperations.Replace,
                relativeJsonPath.concat([
                  'content',
                  selectedMediaType,
                  'schema',
                ]),
                e,
              );
            }}
          />
        </div>
      </div>
    </>
  );
};

ResponseBody.propTypes = {
  response: PropTypes.object,
  onChange: PropTypes.func,
  relativeJsonPath: PropTypes.array,
  //node: PropTypes.object,
};

export default ResponseBody;
