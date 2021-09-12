import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  handleInfo,
  handleServers,
  handleSecuritySchemes,
} from 'store/modules/openapi';
import {InputGroup} from '@blueprintjs/core';
import {MarkdownEditor} from 'components/Editor';
import Servers from './servers';
import SecuritySchemes from './security';
import Contact from './contact';
import License from './license';

const Info = () => {
  const dispatch = useDispatch();

  const updateServers = React.useCallback(
    (e) => dispatch(handleServers(e)),
    [dispatch],
  );

  const updateSecuritySchemes = React.useCallback(
    (e) => dispatch(handleSecuritySchemes(e)),
    [dispatch],
  );

  const info = useSelector(({openapi}) => openapi.info);
  const servers = useSelector(({openapi}) => openapi.servers);
  const securitySchemes = useSelector(
    ({openapi}) => openapi.components.securitySchemes,
  );

  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="px-10 mt-10 max-w-6xl justify-between">
          <div className="flex items-center mb-8">
            <div className="FormHttpService__version bp3-tag bg-green p-2">
              <div className="FormEditableText text-xl font-bold">
                <input
                  value={info.version || '0.1'}
                  onChange={(e) =>
                    dispatch(handleInfo({version: e.target.value}))
                  }
                />
              </div>
            </div>
            <input
              className="px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg ml-4 flex-1 text-2xl"
              value={info.title}
              onChange={(e) => dispatch(handleInfo({title: e.target.value}))}
            />
          </div>
          <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1 mb-2">
            Summary
          </div>
          <InputGroup
            className="mx-1 -mb-2 StudioInput"
            placeholder="summary"
            value={info.summary}
            onChange={(e) => dispatch(handleInfo({summary: e.target.value}))}
          />
          <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1 mt-8 mb-2">
            Description
          </div>
          <div className="flex-1">
            <MarkdownEditor
              value={info?.description}
              onChange={(description) => dispatch(handleInfo({description}))}
            />
          </div>
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Servers servers={servers || []} onChange={(e) => updateServers(e)} />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <SecuritySchemes
            schemes={securitySchemes}
            onChange={({name, scheme, ...rest}) =>
              updateSecuritySchemes({name, scheme, ...rest})
            }
            onDelete={(name) => updateSecuritySchemes({name, deleteOnly: true})}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Contact
            contact={info.contact}
            onChange={(e) => dispatch(handleInfo({contact: e}))}
          />
          <InputGroup
            className="flex-1 mt-4 pr-0"
            title="Terms of Service URL"
            placeholder="Terms of Service UR"
            value={info.termsOfService}
            onChange={(e) =>
              dispatch(handleInfo({termsOfService: e.target.value}))
            }
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <License
            license={info.license}
            onChange={(license) => dispatch(handleInfo({license}))}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4 mb-5" />
        </div>
      </div>
    </div>
  );
};

export default Info;
