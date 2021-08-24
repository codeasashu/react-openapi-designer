//@flow
import React from 'react';
import PropTypes from 'prop-types';
import Parameter from '../../designers/parameter';
//import SchemaDesigner from '../Designer/Schema';
//import {TitleEditor, MarkdownEditor} from '../Editor';

const ParameterContent = ({name, parameter, onChange}) => {
  return (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="w-full max-w-6xl m-auto p-10 flex flex-col">
          <div className="capitalize px-2 py-1 mb-6 font-medium text-2xl">
            {parameter['in']} Parameter
          </div>
          <Parameter
            name={name}
            schema={parameter['schema']}
            description={parameter['description']}
            disableRequired={true}
            onChange={(e) => {
              onChange({name, schema: {...parameter, ...e}});
            }}
            onDelete={() => {
              console.log('parameter delete', parameter);
            }}
          />
        </div>
      </div>
    </div>
  );
};

ParameterContent.propTypes = {
  name: PropTypes.string,
  parameter: PropTypes.object,
  onChange: PropTypes.func,
};

export default ParameterContent;
