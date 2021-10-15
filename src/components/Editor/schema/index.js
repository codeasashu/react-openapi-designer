import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {
  getValueFromStore,
  usePatchOperation,
  usePrevious,
  getValue,
} from '../../utils/selectors';
import {TabList, TabPanel, Tabs, Tab} from 'react-tabs';
import {Button, Icon} from '@blueprintjs/core';
import EditorContainer from './editor';
import {StoresContext} from '../../Tree/context';
import {isObject, keys} from 'lodash';
import {nodeOperations} from '../../../utils/tree';

const SchemaEditor = observer(
  ({className, schemaPath, examplesPath, mediaType, spec}) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0); // a, u

    const prevIndex = usePrevious(selectedIndex); //l
    const handlePatch = usePatchOperation(); //d
    const notJsonSchema = spec !== 'json_schema'; //h
    const examples = getValueFromStore(examplesPath); //f
    const exampleNames = keys(examples); //p
    const prevExampleNames = usePrevious(exampleNames); //g
    const exampleRef = React.useRef(null); // m
    const v = React.useRef(false); // v

    const stores = React.useContext(StoresContext);
    const {activeSourceNode} = stores.uiStore; //y

    //const b = Object(M.a)();

    React.useEffect(() => {
      if (exampleNames.length) {
        if (prevExampleNames.length > exampleNames.length) {
          const e = prevIndex - 1;
          setSelectedIndex(e < 0 ? 0 : e);
        }
      } else {
        setSelectedIndex(0);
      }
    }, [exampleNames.length, prevExampleNames.length, prevIndex]);

    React.useLayoutEffect(() => {
      if (v.current) {
        v.current = false;
      } else {
        if (exampleRef && exampleRef.current) {
          exampleRef.current.focus();
        }
      }
    }, [selectedIndex]);

    const handleAddExample = () => {
      let ee = null;
      var e;

      try {
        if (activeSourceNode) {
          const data = getValue(activeSourceNode, schemaPath, false, [
            'resolved',
          ]); // n

          if (!isObject(data)) {
            throw Error('Cannot generate an example. Invalid Schema');
          }

          const schema =
            (e = activeSourceNode.data.resolved) !== null && e !== undefined
              ? e
              : activeSourceNode.data.parsed;

          console.log('generatedExample1', schema);

          //const i = Object(Xp.sample)(examplesPath, {
          //skipWriteOnly: true,
          //}, schema)
          const generatedExample = {a: 'b'};

          if (generatedExample !== null) {
            ee = {
              value: generatedExample,
            };
          }
        }
      } catch (e) {
        ee = {};
        console.error(e);
      }

      handlePatch(
        nodeOperations.Add,
        examplesPath.concat(
          notJsonSchema
            ? 'example-' + (exampleNames.length + 1)
            : exampleNames.length,
        ),
        ee,
      );
      setSelectedIndex(exampleNames.length + 1);
    };

    return (
      <div className={className}>
        <Tabs
          selectedIndex={selectedIndex}
          onSelect={(e) => setSelectedIndex(e)}>
          <TabList>
            <Tab>Schema</Tab>
            {exampleNames.map((e) => (
              <Tab key={e}>{e}</Tab>
            ))}
            <Button
              minimal
              small
              className="ml-2 mb-1/2"
              icon={<Icon icon="plus" iconSize={12} />}
              onClick={() => handleAddExample()}>
              Example
            </Button>
          </TabList>
          <TabPanel>
            <EditorContainer />
          </TabPanel>
          {exampleNames.map((exampleName) => (
            <TabPanel key={exampleName}>
              {/*<ExampleContainer
                inputRef={exampleRef}
                examplePath={examplesPath.concat(exampleName)}
                exampleValuePath={examplesPath.concat([exampleName, 'value'])}
                mediaType={mediaType}
              />*/}
              <p>{exampleName}</p>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    );
  },
);

SchemaEditor.propTypes = {
  className: PropTypes.string,
  schemaPath: PropTypes.array,
  examplesPath: PropTypes.array,
  mediaType: PropTypes.any,
  spec: PropTypes.any,
};

export default SchemaEditor;
