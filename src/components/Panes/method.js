import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {Button, Intent} from '@blueprintjs/core';
import Operation from '../Content/operation/operation';
//import RequestBody from '../Designer/RequestBody';
//import Responses from '../Designer/Responses';
//import ParameterGroup from '../Designer/ParameterGroup';
//import {StoresContext} from '../Tree/context';
//import {usePatchOperation} from '../../utils/selectors';

const AddOperation = ({method, onAdd}) => {
  return (
    <div className="pt-24 text-center">
      <Button
        large
        intent={Intent.PRIMARY}
        icon="plus"
        onClick={onAdd}
        text={`${method.toUpperCase()} Operation`}
      />
    </div>
  );
};

AddOperation.propTypes = {
  method: PropTypes.string,
  onAdd: PropTypes.func,
};

//const mapParametersJsonPaths = (relativeJsonPath) => ({
//parametersPath: relativeJsonPath.concat("parameters"),
//securityPath: relativeJsonPath.concat("security"),
//typePath: ["schema", "type"],
//validationsPath: ["schema"],
//})

//const Operation = observer(({relativeJsonPath, operation, onChange}) => {
//const stores = React.useContext(StoresContext);
//const parameterJsonPath = mapParametersJsonPaths(relativeJsonPath);

//const {
//activeSourceNode,
//} = stores.uiStore;

//const handlePatch = usePatchOperation();

//return (
//<div className="relative">
//<div className="w-full p-10 pb-16 max-w-6xl">
//<div className="flex flex-col">
//<div className="flex flex-row justify-between">
//<div>
//<div className="uppercase p-2" style={{fontSize: '9px'}}>
//Operation ID
//</div>
//<Title
//small
//value={operation['operationId']}
//onChange={(e) => onChange({title: e})}
///>
//</div>
//<div className="flex items-baseline">
//<div className="text-xs uppercase">Deprecated</div>
//<Switch
//checked={false}
//onChange={() => {}}
//className="ml-2 py-1"
///>
//</div>
//</div>
//<div className="uppercase px-2 pt-2" style={{fontSize: '9px'}}>
//Description
//</div>
//<div className="flex-1">
//<Markdown
//className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
//placeholder="Description...."
//value={operation['description'] || ''}
//onChange={(e) => onChange({description: e})}
///>
//</div>
//<div className="my-8 -mx-1 border-t dark:border-darken-4" />
//<ParameterGroup
//relativeJsonPath={relativeJsonPath.concat(['requestBody'])}
//parameters={operation.parameters || []}
//onChange={(parameters) => onChange({parameters})}
///>
//<div className="my-8 -mx-1 border-t dark:border-darken-4" />
//<RequestBody
//relativeJsonPath={relativeJsonPath.concat(['requestBody'])}
//requestBody={operation.requestBody || {}}
//onChange={(requestBody) => onChange({requestBody})}
///>
//<div className="my-8 -mx-1 border-t dark:border-darken-4" />
//<Responses
//relativeJsonPath={relativeJsonPath.concat(['responses'])}
//responses={operation.responses}
//onChange={(responseBody) =>
//onChange({
//responses: {...operation.responses, ...responseBody},
//})
//}
///>
//</div>
//</div>
//</div>
//);
//});

//Operation.propTypes = {
//relativeJsonPath: PropTypes.array,
//operation: PropTypes.object,
//onChange: PropTypes.func,
//};

const Method = observer(
  ({relativeJsonPath, operation, methodName, onAddOperation, onChange}) => {
    return operation ? (
      <Operation
        operation={operation}
        relativeJsonPath={relativeJsonPath}
        onChange={onChange}
      />
    ) : (
      <AddOperation method={methodName} onAdd={onAddOperation} />
    );
  },
);

Method.propTypes = {
  relativeJsonPath: PropTypes.array,
  methodName: PropTypes.string,
  operation: PropTypes.object,
  onChange: PropTypes.func,
  onAddOperation: PropTypes.func,
};

export default Method;
