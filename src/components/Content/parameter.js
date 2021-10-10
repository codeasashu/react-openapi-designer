//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {getValueFromStore, usePatchOperation} from '../../utils/selectors';
import Parameter from '../../designers/parameter';
import {StoresContext} from '../Tree/context';
import {nodeOperations} from '../../utils/tree';

const ParameterContent = observer(({relativeJsonPath, node}) => {
  const handlePatch = usePatchOperation();
  const stores = React.useContext(StoresContext);
  const parameterType = getValueFromStore(relativeJsonPath.concat(['in']));
  const schema = getValueFromStore(relativeJsonPath.concat(['schema']));
  return parameterType ? (
    <div className="flex-1 relative">
      <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
        <div className="w-full max-w-6xl m-auto p-10 flex flex-col">
          <div className="capitalize px-2 py-1 mb-6 font-medium text-2xl">
            {parameterType} Parameter
          </div>
          <Parameter
            name={getValueFromStore(relativeJsonPath.concat(['name']))}
            schema={schema}
            description={
              getValueFromStore(relativeJsonPath.concat(['description'])) || ''
            }
            disableRequired={true}
            onChange={(e) => {
              handlePatch(nodeOperations.Replace, relativeJsonPath, {
                ...e,
                in: parameterType,
              });
            }}
            onDelete={async () => {
              await stores.graphStore.removeNode(node.id);
            }}
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
