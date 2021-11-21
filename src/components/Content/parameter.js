//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {getValueFromStore} from '../../utils/selectors';
import Parameter from '../Common/Parameters/parameter';
import {StoresContext} from '../Context';

const ParameterContent = observer(({relativeJsonPath, node}) => {
  const stores = React.useContext(StoresContext);
  const parameterType = getValueFromStore(relativeJsonPath.concat(['in']));
  return parameterType ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="w-full max-w-6xl m-auto p-10 flex flex-col">
          <div className="capitalize px-2 py-1 mb-6 font-medium text-2xl">
            {parameterType} Parameter
          </div>
          <Parameter
            parameterPath={relativeJsonPath}
            parameterIn={parameterType}
            nameInPath={false}
            handleRemove={async () => {
              await stores.graphStore.removeNode(node.id);
            }}
            typePath={relativeJsonPath.concat(['schema', 'type'])}
          />
        </div>
      </div>
    </div>
  ) : null;
});

ParameterContent.propTypes = {
  relativeJsonPath: PropTypes.array,
  node: PropTypes.object,
};

export default ParameterContent;
