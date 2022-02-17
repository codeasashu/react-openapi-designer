import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {get, keys, cloneDeep} from 'lodash';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import {Button, Icon} from '@blueprintjs/core';
import SwaggerParser from '@apidevtools/swagger-parser';
import {StoresContext} from '../../Context';
import Schema from './schema';
import Example from './examples';
import {usePatchOperation, getValueFromStore} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';

function usePrevious(e) {
  const t = React.useRef(e);

  React.useEffect(() => {
    t.current = e;
  });

  return t.current;
}

const JsonSchema = observer(
  ({schemaPath, examplesPath, mediaType, className}) => {
    const stores = React.useContext(StoresContext);
    const {activeSourceNode} = stores.uiStore;
    const [selectedTab, setSelectedTab] = React.useState(0);
    const previousTab = usePrevious(selectedTab);

    const examples = getValueFromStore(examplesPath);
    const exampleNames = keys(examples);
    const previousExampleNames = usePrevious(exampleNames);
    const inputRef = React.useRef(null);

    const handlePatch = usePatchOperation();

    React.useEffect(() => {
      if (exampleNames.length) {
        if (previousExampleNames.length > exampleNames.length) {
          const newIndex = previousTab - 1;
          setSelectedTab(newIndex < 0 ? 0 : newIndex);
        }
      } else {
        setSelectedTab(0);
      }
    }, [exampleNames.length, previousExampleNames.length, previousTab]);

    React.useLayoutEffect(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, [selectedTab]);

    const addExample = async () => {
      let api = await SwaggerParser.dereference(
        cloneDeep(activeSourceNode.data.parsed),
      );
      const schema = get(api, schemaPath);
      const value = stores.oasStore.generateExampleFromSchema(schema);
      handlePatch(
        nodeOperations.Add,
        examplesPath.concat('example-' + (exampleNames.length + 1)),
        {value},
      );
      setSelectedTab(exampleNames.length + 1);
    };

    return (
      <div className={className}>
        <Tabs
          className="react-tabs"
          selectedTabClassName="selected-tab bg-gray-700"
          selectedTabPanelClassName="block"
          selectedIndex={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}>
          <TabList className="bp4-simple-tab-list">
            <Tab className="bp4-simple-tab">Schema</Tab>
            {exampleNames.map((example, i) => (
              <Tab className="bp4-simple-tab" key={i}>
                {example}
              </Tab>
            ))}
            <Button
              minimal
              small
              icon={<Icon iconSize={12} icon="plus" />}
              onClick={addExample}>
              Example
            </Button>
          </TabList>
          <TabPanel className="bp4-simple-tab-panel">
            <div className="border-2 border-gray-600">
              <Schema relativeJsonPath={schemaPath} maxRows={25} />
            </div>
          </TabPanel>
          {exampleNames.map((example) => (
            <TabPanel key={example}>
              <div className="p-4 bg-canvas border-2">
                <Example
                  title={example}
                  inputRef={inputRef}
                  mediaType={mediaType}
                  examplePath={examplesPath.concat(example)}
                  exampleValuePath={examplesPath.concat([example, 'value'])}
                  content={examplesPath.concat([example, 'value'])}
                />
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  },
);

JsonSchema.propTypes = {
  relativeJsonPath: PropTypes.array,
  props: PropTypes.any,
  shouldRenderGoToRef: PropTypes.bool,
  getRefLabel: PropTypes.func,
  refSelector: PropTypes.func,
  rootName: PropTypes.string,
  whitelistTypes: PropTypes.array,
  customRowActionRenderer: PropTypes.func,
};

export default JsonSchema;
