//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import {handleModelChange} from 'store/modules/openapi';
import SchemaDesigner from '../Designer/Schema';
import {TitleEditor, MarkdownEditor} from '../Editor';

const ModelContent = ({relativeJsonPath}) => {
  const name = relativeJsonPath.slice(-1).pop();
  const dispatch = useDispatch();

  const changeModel = React.useCallback(
    (path, value) => dispatch(handleModelChange({path, value})),
    [dispatch],
  );

  const title = useSelector(
    ({openapi}) =>
      get(openapi, relativeJsonPath.concat(['title']), name) || name,
  );
  const description = useSelector(({openapi}) =>
    get(openapi, relativeJsonPath.concat(['description'])),
  );
  const schema = useSelector(({openapi}) => get(openapi, relativeJsonPath));

  return schema ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="max-w-6xl p-10 flex flex-col">
          <div className="flex pl-2 justify-between">
            <TitleEditor
              xl
              value={title}
              onChange={(e) =>
                changeModel(relativeJsonPath.concat(['title']), e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <div className="mt-6">
              <MarkdownEditor
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
                value={description}
                onChange={(e) =>
                  changeModel(relativeJsonPath.concat(['description']), e)
                }
              />
            </div>
          </div>
          <div className="mt-10">
            <SchemaDesigner
              dark
              initschema={schema}
              namespace="model"
              onChange={(e) => changeModel(relativeJsonPath, e)}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No Schema found</p>
  );
};

ModelContent.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default ModelContent;
