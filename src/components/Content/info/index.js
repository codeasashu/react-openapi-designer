import React from 'react';
import PropTypes from 'prop-types';
import {InputGroup} from '@blueprintjs/core';
import {MarkdownEditor} from 'components/Editor';
import Servers from './servers';
import SecuritySchemes from './security';
import Contact from './contact';
import License from './license';

const noop = () => {};

const Info = ({info, servers, securitySchemes, onChange, ...props}) => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="px-10 mt-10 max-w-6xl justify-between">
          <div className="flex items-center mb-8">
            <div className="FormHttpService__version bp3-tag bg-green p-2">
              <div className="FormEditableText text-xl font-bold">
                <input value={info.version || '0.1'} onChange={noop} />
              </div>
            </div>
            <input
              className="px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg ml-4 flex-1 text-2xl"
              value={info.title}
              onChange={(e) => {
                console.log('titlee', e.target.value);
                onChange({...info, title: e.target.value});
              }}
            />
          </div>
          <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1 mb-2">
            Summary
          </div>
          <InputGroup
            className="mx-1 -mb-2 StudioInput"
            placeholder="summary"
            value={info.summary}
            onChange={(e) => {
              console.log('summ', e.target.value);
              onChange({...info, summary: e.target.value});
            }}
          />
          <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1 mt-8 mb-2">
            Description
          </div>
          <div className="flex-1">
            <MarkdownEditor
              value={info?.description}
              onChange={(e) => {
                console.log('desc', e);
                onChange({...info, description: e});
              }}
            />
          </div>
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Servers
            servers={servers || []}
            onChange={(e) => props.onServerChange(e)}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <SecuritySchemes
            schemes={securitySchemes}
            onChange={({name, scheme, ...rest}) =>
              props.onSecuritySchemeChange({name, scheme, ...rest})
            }
            onDelete={(name) =>
              props.onSecuritySchemeChange({name, deleteOnly: true})
            }
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Contact
            contact={info.contact}
            onChange={(e) => onChange({...info, contact: e})}
          />
          <InputGroup
            className="flex-1 mt-4 pr-0"
            title="Terms of Service URL"
            placeholder="Terms of Service UR"
            value={info.termsOfService}
            onChange={(e) =>
              onChange({...info, termsOfService: e.target.value})
            }
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <License
            license={info.license}
            onChange={(license) => onChange({...info, license})}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4 mb-5" />
        </div>
      </div>
    </div>
  );
};

Info.propTypes = {
  info: PropTypes.object,
  servers: PropTypes.arrayOf(PropTypes.object),
  globalSecurity: PropTypes.arrayOf(PropTypes.object),
  securitySchemes: PropTypes.object,
  onChange: PropTypes.func,
  onServerChange: PropTypes.func,
  onSecuritySchemeChange: PropTypes.func,
};

export default Info;
