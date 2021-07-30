// @flow
import React from 'react';
import {Button, Callout} from '@blueprintjs/core';
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isEqual} from 'lodash';
import {defaultSchema} from '../../../utils';
import {
  schemaSlice,
  generateExampleFromSchema,
} from '../../../redux/modules/schema';
import {dropdownSlice} from '../../../redux/modules/dropdown';
import {JsonEditor} from '../../Editor';
import SchemaRow from '../../../elements/schema-row';
import SchemaJson from '../../../elements/schema-json';
import DebouncedInput from '../../../elements/debounced-input';

@autoBindMethodsForReact()
class RootSchema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validGeneratedJson: false,
      generateCode: false,
      userCode: '{}',
      selectedTab: 0,
    };
  }

  componentDidUpdate(oldProps) {
    if (
      typeof this.props.onChange === 'function' &&
      this.props.schema !== oldProps.schema
    ) {
      const newData = this.props.schema || '';
      const oldData = oldProps.schema || '';
      if (!isEqual(oldData, newData)) return this.props.onChange(newData);
    }
    if (this.props.initschema !== oldProps.initschema) {
      this.props.changeEditorSchema({
        value: this.props.initschema || defaultSchema.object,
      });
    }
  }

  componentDidMount() {
    const {initschema} = this.props;
    //@TODO Add schema validation
    if (initschema) this.props.changeEditorSchema({value: initschema});
  }

  addChildField() {
    this.props.addChildField({key: ['properties']});
    this.props.setOpenDropdownPath({key: ['properties'], value: true});
  }

  _toggleGenerateFromCode(desiredState = false) {
    this.setState({generateCode: desiredState});
  }

  _handleGenerateFromCode() {
    const {generateSchema} = this.props;
    const {userCode} = this.state;
    try {
      generateSchema(userCode);
      this.setState({userCode: '{}', generateCode: false});
    } catch (error) {
      console.error(error);
    }
  }

  _setUserCode(userCode) {
    try {
      JSON.parse(userCode);
      this.setState({validGeneratedJson: true});
    } catch (error) {
      this.setState({validGeneratedJson: false});
    }
    this.setState({userCode});
  }

  addExample(key, value) {
    const {generateExampleFromSchema} = this.props;
    generateExampleFromSchema({key, value});
  }

  _deleteExample(title) {
    const {deleteExample} = this.props;
    deleteExample(title);
    this.setState({selectedTab: 'schema'});
  }

  _handleChangeExampleTitle(oldTitle, newTitle) {
    const {renameExample} = this.props;
    renameExample({oldTitle, newTitle});
    this.setState({selectedTab: newTitle});
  }

  _handleDescription({value}) {
    const {schema, changeValue} = this.props;
    changeValue({
      key: [],
      value: {...schema, ...{description: value}},
    });
  }

  renderForm() {
    const {schema, open} = this.props;
    return (
      <>
        <Button
          outlined
          icon="clean"
          className="mt-3 ml-4 mb-2"
          onClick={() => this._toggleGenerateFromCode(true)}>
          Generate from JSON
        </Button>
        <SchemaRow
          show
          root
          sidebar={open}
          schema={schema}
          handleField={this.addChildField}
          handleSidebar={this.props.setOpenDropdownPath}
          handleSchemaType={this.props.changeType}
          handleTitle={this.props.changeValue}
          handleDescription={this._handleDescription}
          handleAdditionalProperties={this.props.changeValue}
        />
        {!!open.properties.show && (
          <SchemaJson wrapperProps={{...this.props}} />
        )}
      </>
    );
  }

  renderGenerateCode() {
    const {userCode, validGeneratedJson} = this.state;
    return (
      <div className="mx-4 my-3">
        <div className="mb-2">
          <Button
            icon="clean"
            outlined
            intent="primary"
            disabled={!validGeneratedJson}
            onClick={this._handleGenerateFromCode}>
            Generate
          </Button>
          <Button
            icon="small-cross"
            outlined
            className="ml-2"
            onClick={() => this._toggleGenerateFromCode(false)}>
            Cancel
          </Button>
        </div>
        <Callout className="mb-2">
          Paste or write a JSON example below, then click <em>Generate</em>
          above to build a schema.
        </Callout>
        <div>
          <JsonEditor value={userCode} onChange={this._setUserCode} />
        </div>
      </div>
    );
  }

  renderSchema() {
    const {generateCode} = this.state;
    return generateCode === true
      ? this.renderGenerateCode()
      : this.renderForm();
  }

  renderExample(title, content) {
    return (
      <div>
        <div className="flex p-1">
          <DebouncedInput
            className="pl-1 flex-1"
            onChange={() => {}}
            onBlur={(e) => this._handleChangeExampleTitle(title, e)}
            value={title}
          />
          <Button
            className="ml-3"
            onClick={() => this._deleteExample(title)}
            icon="trash"
          />
        </div>
        <JsonEditor value={content} onBlur={(e) => this.addExample(title, e)} />
      </div>
    );
  }

  handleTabChange(selectedTab) {
    this.setState({selectedTab});
  }

  render() {
    const {schema, dark} = this.props;
    const {selectedTab} = this.state;
    return (
      <div className={`json-schema-react-editor ${dark && 'bp3-dark'}`}>
        <Tabs
          className="react-tabs"
          selectedTabClassName="selected-tab bg-gray-700"
          selectedTabPanelClassName="block"
          selectedIndex={selectedTab}
          onSelect={this.handleTabChange}>
          <TabList className="bp3-simple-tab-list">
            <Tab className="bp3-simple-tab">Schema</Tab>
            {schema.examples &&
              Object.keys(schema.examples).map((example, i) => (
                <Tab className="bp3-simple-tab" key={i}>
                  {example}
                </Tab>
              ))}
            <Button
              icon="small-plus"
              minimal
              small
              className="ml-2 mb-1/2"
              onClick={() => this.addExample()}>
              Example
            </Button>
          </TabList>
          <TabPanel className="bp3-simple-tab-panel">
            <div className="border border-gray-600">{this.renderSchema()}</div>
          </TabPanel>
          {schema.examples &&
            Object.keys(schema.examples).map((example, i) => (
              <TabPanel className="bp3-simple-tab-panel" key={i}>
                <div className="border border-gray-600">
                  {this.renderExample(example, schema.examples[example])}
                </div>
              </TabPanel>
            ))}
        </Tabs>
      </div>
    );
  }
}

RootSchema.propTypes = {
  initschema: PropTypes.object,
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

const mapStateToProps = ({schema, dropdown}) => {
  return {schema, open: dropdown};
};

const mapDispatchToProps = (dispatch) => {
  const schema = bindActionCreators(
    {...schemaSlice.actions, generateExampleFromSchema},
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
    generateExampleFromSchema: schema.generateExampleFromSchema,
    renameExample: schema.renameExample,
    generateSchema: schema.generateSchema,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootSchema);
