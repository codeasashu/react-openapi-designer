import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import Description from './description';
import Parameters from './parameters';
import RequestBody from './requestBody';
import Responses from './Responses';

const Operation = observer(({relativeJsonPath}) => {
  //const stores = React.useContext(StoresContext);
  //const parameterJsonPath = mapParametersJsonPaths(relativeJsonPath);

  //const {
  //activeSourceNode,
  //} = stores.uiStore;

  //const handlePatch = usePatchOperation();

  return (
    <div className="w-full pb-16 max-w-6xl">
      <Description relativeJsonPath={relativeJsonPath} />
      <div className="my-8 -mx-1 border-t dark:border-darken-4"></div>
      <div aria-label="request-parameters">
        <Parameters parametersPath={[...relativeJsonPath, 'parameters']} />
      </div>
      <div className="my-8 -mx-1 border-t dark:border-darken-4"></div>
      <div>
        <RequestBody
          contentPath={relativeJsonPath.concat(['requestBody', 'content'])}
          descriptionPath={relativeJsonPath.concat([
            'requestBody',
            'description',
          ])}
        />
      </div>
      <div className="my-8 -mx-1 border-t dark:border-darken-4"></div>
      <Responses responsesPath={relativeJsonPath.concat('responses')} />
    </div>
  );
});

Operation.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Operation;
