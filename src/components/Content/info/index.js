import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import AutosizeInput from 'react-input-autosize';
import {InputGroup} from '@blueprintjs/core';
import {MarkdownEditor} from '../../Editor';
import Servers from './servers';
import SecuritySchemes from './security';
import Contact from './contact';
import License from './license';
import {usePatchOperation, getValueFromStore} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';

const Info = observer(() => {
  const handlePatch = usePatchOperation();
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="w-10/12 m-auto p-10">
          <div className="flex items-center mb-8">
            <div className="FormHttpService__version bp3-tag bg-green p-2">
              <div className="FormEditableText text-xl font-bold">
                <AutosizeInput
                  inputClassName="bg-transparent hover:bg-darken-1 focus:bg-darken-2"
                  minWidth={30}
                  key={'/'}
                  value={getValueFromStore(['info', 'version']) || '0.1'}
                  onChange={(e) => {
                    handlePatch(
                      nodeOperations.Replace,
                      ['info', 'version'],
                      e.target.value,
                    );
                  }}
                />
              </div>
            </div>
            <input
              className="px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg ml-4 flex-1 text-2xl"
              value={getValueFromStore(['info', 'title']) || ''}
              placeholder="Name"
              onChange={(e) =>
                handlePatch(
                  nodeOperations.Replace,
                  ['info', 'title'],
                  e.target.value,
                )
              }
            />
          </div>
          <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1 mt-8 mb-2">
            Description
          </div>
          <div className="flex-1">
            <MarkdownEditor
              value={getValueFromStore(['info', 'description']) || ''}
              placeholder="API description..."
              onChange={(e) =>
                handlePatch(nodeOperations.Replace, ['info', 'description'], e)
              }
            />
          </div>
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Servers
            servers={getValueFromStore(['servers']) || []}
            onChange={(e) => {
              handlePatch(nodeOperations.Replace, ['servers'], e);
            }}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <SecuritySchemes
            schemes={getValueFromStore(['components', 'securitySchemes'])}
            onChange={(schemes) => {
              handlePatch(
                nodeOperations.Replace,
                ['components', 'securitySchemes'],
                schemes,
              );
            }}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Contact
            contact={getValueFromStore(['info', 'contact'])}
            onChange={(e) => {
              handlePatch(nodeOperations.Replace, ['info', 'contact'], e);
            }}
          />
          <InputGroup
            className="flex-1 mt-4 pr-0"
            title="Terms of Service URL"
            placeholder="Terms of Service URL"
            value={getValueFromStore(['info', 'termsOfService']) || ''}
            onChange={(e) => {
              handlePatch(
                nodeOperations.Replace,
                ['info', 'termsOfService'],
                e.target.value,
              );
            }}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <License
            license={getValueFromStore(['info', 'license'])}
            onChange={(license) => {
              handlePatch(nodeOperations.Replace, ['info', 'license'], license);
            }}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4 mb-5" />
        </div>
      </div>
    </div>
  );
});

Info.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Info;
