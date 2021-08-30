// @flow
import React, {useEffect, useState} from 'react';
import {Button} from '@blueprintjs/core';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isEqual} from 'lodash';
import {schemaSlice, generateExampleFromSchema} from 'store/modules/schema';
import {dropdownSlice} from 'store/modules/dropdown';
import {JsonEditor, DebouncedEditor} from 'components/Editor';
import SchemaRow from './row';
import SchemaChild from './child';
import Code from './code';

const SchemaElement = (props) => {
  return (
    <>
      <Button
        outlined
        icon="clean"
        className="mt-3 ml-4 mb-2"
        onClick={() => props.onGenerateCode(true)}>
        Generate from JSON
      </Button>
      <SchemaRow
        show
        root
        sidebar={props.open}
        schema={props.schema}
        handleField={() => props.addChildField({key: ['properties']})}
        handleSidebar={props.setOpenDropdownPath}
        handleSchemaType={props.changeType}
        handleTitle={props.changeValue}
        handleDescription={(e) => {
          props.changeValue({
            key: [],
            value: {...props.schema, ...{description: e.value}},
          });
        }}
        handleAdditionalProperties={props.changeValue}
      />
      {!!props.open.properties.show && (
        <SchemaChild wrapperProps={{...props}} />
      )}
    </>
  );
};

SchemaElement.propTypes = {
  open: PropTypes.any,
  schema: PropTypes.object,
  addChildField: PropTypes.func,
  changeType: PropTypes.func,
  changeValue: PropTypes.func,
  onGenerateCode: PropTypes.func,
  setOpenDropdownPath: PropTypes.func,
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

const RootSchema = ({schema, dark, initialschema, ...props}) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [generateCode, setGenerateCode] = useState(false);

  const dispatch = useDispatch();
  //const dispatch = useDispatch();
  //const details = useSelector((state) => state);

  //props.changeEditorSchema({value: initialschema});

  useEffect(() => {
    if (initialschema && !isEqual(initialschema, schema)) {
      props.changeEditorSchema({value: initialschema});
      setHasInitialized(true);
      setSelectedTab(0);
    }
  }, [initialschema]);

  useEffect(() => {
    if (hasInitialized) {
      props.onChange(schema);
    }
  }, [schema]);

  return (
    <div className={`json-schema-react-editor ${dark && 'bp3-dark'}`}>
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
          <AddExampleBtn
            onAdd={() => {
              const asyncfunc = props.generateExampleFromSchema(
                props.namespace,
              );
              dispatch(asyncfunc());
            }}
          />
        </TabList>
        <TabPanel className="bp3-simple-tab-panel">
          <div className="border border-gray-600">
            {generateCode ? (
              <Code
                schema={props.generateSchema}
                onCancel={setGenerateCode(false)}
              />
            ) : (
              <SchemaElement
                schema={schema}
                {...props}
                onGenerateCode={() => setGenerateCode(true)}
              />
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
                    props.renameExample({oldTitle, newTitle});
                  }}
                  onChange={(key, value) => {
                    props.addExample({key, value});
                  }}
                  onDelete={(title) => {
                    props.deleteExample(title);
                    setSelectedTab(0);
                  }}
                />
              </div>
            </TabPanel>
          ))}
      </Tabs>
    </div>
  );
};

RootSchema.propTypes = {
  namespace: PropTypes.string,
  initschema: PropTypes.object,
  initialschema: PropTypes.object,
  schema: PropTypes.object,
  open: PropTypes.object,
  dark: PropTypes.bool,
  onChange: PropTypes.func,
  changeEditorSchema: PropTypes.func,
  changeName: PropTypes.func,
  changeValue: PropTypes.func,
  changeType: PropTypes.func,
  enableRequire: PropTypes.func,
  deleteItem: PropTypes.func,
  addField: PropTypes.func,
  addChildField: PropTypes.func,
  addExample: PropTypes.func,
  deleteExample: PropTypes.func,
  setOpenDropdownPath: PropTypes.func,
  generateExampleFromSchema: PropTypes.func,
  renameExample: PropTypes.func,
  generateSchema: PropTypes.func,
};

const mapStateToProps = (state, {namespace, initschema}) => {
  let schema = state[namespace];
  return {schema, open: state.dropdown, initialschema: initschema};
};

const mapDispatchToProps = (dispatch, {namespace}) => {
  const schema = bindActionCreators(
    {...schemaSlice(namespace).actions},
    dispatch,
  );
  const dropdown = bindActionCreators(dropdownSlice.actions, dispatch);
  return {
    changeEditorSchema: schema.changeEditorSchema,
    changeName: schema.changeName,
    changeValue: schema.changeValue,
    changeType: schema.changeType,
    enableRequire: schema.enableRequire,
    deleteItem: schema.deleteItem,
    addField: schema.addField,
    addChildField: schema.addChildField,
    addExample: schema.addExample,
    deleteExample: schema.deleteExample,
    setOpenDropdownPath: dropdown.setOpenDropdownPath,
    generateExampleFromSchema: generateExampleFromSchema,
    renameExample: schema.renameExample,
    generateSchema: schema.generateSchema,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootSchema);
