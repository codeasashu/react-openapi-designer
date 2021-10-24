// @flow
import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import {observer} from 'mobx-react-lite';
import {Button} from '@blueprintjs/core';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
//import {schemaSlice, generateExampleFromSchema} from 'store/modules/schema';
//import {dropdownSlice} from 'store/modules/dropdown';
import {JsonEditor, DebouncedEditor} from 'components/Editor';
import SchemaRow from './row';
import SchemaChild from './child';
import Code from './code';

const SchemaElement = observer(({store, stores}) => {
  const wrapperProps = {
    schema: store.schema,
    open: store.sidebar,
    changeName: ({key, name, value}) => store.changeName(key, name, value),
    addField: ({key, value}) => store.addField(key, value),
    addChildField: ({key}) => store.addChildField(key),
    setOpenDropdownPath: ({key, value}) =>
      store.setOpenDropdownPath(key, value),
    changeValue: ({key, value}) => store.changeValue(key, value),
    changeType: ({key, value}) => store.changeType(key, value),
    enableRequire: ({key, value, required}) =>
      store.enableRequire(key, value, required),
    deleteItem: ({key}) => store.deleteItem(key),
  };

  return (
    <>
      <SchemaRow
        show
        root
        stores={stores}
        sidebar={store.sidebar}
        schema={store.schema}
        handleField={() => store.addChildField(['properties'])}
        handleSidebar={({key}) => store.setOpenDropdownPath(key)}
        handleSchemaType={({key, value}) => store.changeType(key, value)}
        handleTitle={store.changeValue}
        handleDescription={(e) =>
          store.changeValue([], {...store.schema, ...{description: e.value}})
        }
        handleAdditionalProperties={({key, value}) =>
          store.changeValue(key, value)
        }
      />
      {!!store.sidebar.properties.show && (
        <SchemaChild wrapperProps={wrapperProps} stores={stores} />
      )}
    </>
  );
});

SchemaElement.propTypes = {
  store: PropTypes.object,
  stores: PropTypes.object,
};

const AddExampleBtn = ({onAdd}) => {
  return (
    <Button
      icon="small-plus"
      minimal
      small
      className="ml-2 mb-1/2"
      onClick={onAdd}>
      Example
    </Button>
  );
};

AddExampleBtn.propTypes = {
  onAdd: PropTypes.func,
};

const ExampleRenderer = ({title, content, ...props}) => {
  return (
    <div>
      <div className="flex p-1">
        <DebouncedEditor
          className="pl-1 flex-1"
          onBlur={(e) => props.onTitleChange(title, e)}
          value={title}
        />
        <Button
          className="ml-3"
          onClick={() => props.onDelete(title)}
          icon="trash"
        />
      </div>
      <JsonEditor value={content} onBlur={(e) => props.onChange(title, e)} />
    </div>
  );
};

ExampleRenderer.propTypes = {
  title: PropTypes.any,
  content: PropTypes.any,
  onTitleChange: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

const RootSchema = observer(({store, stores, className, onChange}) => {
  const schema = store.schema;
  const initialschema = schema;

  const [hasInitialized, setHasInitialized] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [generateCode, setGenerateCode] = useState(false);

  useEffect(() => {
    if (initialschema && !isEqual(initialschema, schema)) {
      //props.changeEditorSchema({value: initialschema});
      store.changeEditorSchema({value: initialschema});
      setHasInitialized(true);
      setSelectedTab(0);
    }
  }, [initialschema]);

  useEffect(() => {
    if (hasInitialized) {
      onChange(schema);
    }
  }, [schema]);

  return (
    <div className={classnames('json-schema-react-editor bp3-dark', className)}>
      <Tabs
        className="react-tabs"
        selectedTabClassName="selected-tab bg-gray-700"
        selectedTabPanelClassName="block"
        selectedIndex={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}>
        <TabList className="bp3-simple-tab-list">
          <Tab className="bp3-simple-tab">Schema</Tab>
          {schema.examples &&
            Object.keys(schema.examples).map((example, i) => (
              <Tab className="bp3-simple-tab" key={i}>
                {example}
              </Tab>
            ))}
          <AddExampleBtn onAdd={() => store.generateExampleFromSchema()} />
        </TabList>
        <TabPanel className="bp3-simple-tab-panel">
          <div className="border border-gray-600">
            {generateCode ? (
              <Code
                onGenerateSchema={(value) => {
                  store.generateSchema(value);
                  setGenerateCode(false);
                }}
                onCancel={() => {
                  setGenerateCode(false);
                }}
              />
            ) : (
              <>
                <Button
                  outlined
                  icon="clean"
                  className="mt-3 ml-4 mb-2"
                  onClick={() => {
                    setGenerateCode(true);
                  }}>
                  Generate from JSON
                </Button>

                <SchemaElement store={store} stores={stores} />
              </>
            )}
          </div>
        </TabPanel>
        {schema.examples &&
          Object.keys(schema.examples).map((example, i) => (
            <TabPanel className="bp3-simple-tab-panel" key={i}>
              <div className="border border-gray-600">
                <ExampleRenderer
                  title={example}
                  content={schema.examples[example]}
                  onTitleChange={(oldTitle, newTitle) => {
                    store.renameExample(oldTitle, newTitle);
                  }}
                  onChange={(key, value) => {
                    store.addExample({key, value});
                  }}
                  onDelete={(key) => {
                    store.deleteExample(key);
                    setSelectedTab(0);
                  }}
                />
              </div>
            </TabPanel>
          ))}
      </Tabs>
    </div>
  );
});

RootSchema.propTypes = {
  store: PropTypes.object,
  className: PropTypes.string,
};

export default RootSchema;
