import React from 'react';
import { ButtonGroup, Button, Tab, Tabs } from "@blueprintjs/core";
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual, isObject, cloneDeep } from 'lodash';
import { schemaSlice, generateExampleFromSchema } from './redux/modules/schema';
import { dropdownSlice } from './redux/modules/dropdown';
import SchemaRow from './elements/schema-row';
import SchemaJson from './elements/schema-json';
import DebouncedInput from './elements/debounced-input';
import JsonEditor from './elements/json-editor';

@autoBindMethodsForReact()
class SchemaDesigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validGeneratedJson: false,
      generateCode: false,
      userCode: '{}',
      examples: [],
      selectedTab: 'schema',
      visible: false,
      show: true,
      editVisible: false,
      description: '',
      descriptionKey: null,
      advVisible: false,
      itemKey: [],
      curItemCustomValue: null,
      checked: false,
      editorModalName: '',
      mock: '',
    };
    this.jsonSchemaData = null;
    this.jsonData = null;
  }

  componentDidUpdate(oldProps) {
    if (typeof this.props.onChange === 'function' && this.props.schema !== oldProps.schema) {
      const newData = this.props.schema || '';
      const oldData = oldProps.schema || '';
      if (!isEqual(oldData, newData)) return this.props.onChange(newData);
    }
    if (this.props.data && this.props.data !== oldProps.data) {
      this.props.changeEditorSchema({ value: this.props.data });
    }
  }

  addChildField(e) {
    this.props.addChildField({ key: ['properties'] });
    this.setState({ show: true });
  };

  showEdit = (prefix, name, value, type) => {
    if (type === 'object' || type === 'array') {
      return;
    }
    const descriptionKey = [].concat(prefix, name);

    value = name === 'mock' ? (value ? value.mock : '') : value;
    this.setState({
      editVisible: true,
      [name]: value,
      descriptionKey,
      editorModalName: name,
    });
  };

  handleAdvOk = () => {
    if (this.state.itemKey.length === 0) {
      this.props.changeEditorSchema({
        value: this.state.curItemCustomValue,
      });
    } else {
      this.props.changeValue({
        key: this.state.itemKey,
        value: this.state.curItemCustomValue,
      });
    }
    this.setState({
      advVisible: false,
    });
  };

  handleAdvCancel = () => this.setState({ advVisible: false });

  showAdv = (itemKey, curItemCustomValue) =>
    this.setState({
      advVisible: true,
      itemKey,
      curItemCustomValue,
    });
  
  _toggleGenerateFromCode(desiredState=false) {
    this.setState({ generateCode: desiredState })
  }

  _handleGenerateFromCode() {
    const { generateSchema } = this.props;
    const { userCode } = this.state;
    try {
      generateSchema(userCode);
      this.setState({ userCode: '{}', generateCode: false });
    } catch(error) {
      console.error(error);
    }
  }

  _setUserCode(userCode) {
    try {
      JSON.parse(userCode);
      this.setState({ validGeneratedJson: true });
    } catch(error) {
      this.setState({ validGeneratedJson: false });
    }
    this.setState({ userCode });
  }

  addExample(key, value) {
    const { generateExampleFromSchema} = this.props;
    generateExampleFromSchema({ key, value })
  }

  _deleteExample(title) {
    const { deleteExample } = this.props;
    deleteExample(title);
    this.setState({ selectedTab: 'schema'});
  }

  _handleChangeExampleTitle(oldTitle, newTitle) {
    const { renameExample } = this.props;
    renameExample({ oldTitle, newTitle });
    this.setState({ selectedTab: newTitle});
  }

  renderForm() {
    const { schema } = this.props;
    const { show } = this.state;
    return (
      <>
        <Button icon="clean" onClick={e => this._toggleGenerateFromCode(true)}>Generate from JSON</Button>
        <SchemaRow
          show
          root
          schema={schema}
          handleField={this.addChildField}
          handleSidebar={() => this.setState({ show: !show })}
          handleSchemaType={this.props.changeType}
          handleTitle={this.props.changeValue}
          handleDescription={this.props.changeValue}
          handleSettings={this.showAdv}
        />
        {this.state.show && (
          <SchemaJson
            wrapperProps={{
              ...this.props,
              ...{ showEdit: this.showEdit, showAdv: this.showAdv },
            }}
          />
        )}
      </>
    );
  }

  renderGenerateCode() {
    const { userCode, validGeneratedJson } = this.state;
    return (
      <>
        <ButtonGroup>
          <Button icon="clean" disabled={!validGeneratedJson} onClick={this._handleGenerateFromCode}>Generate</Button>
          <Button icon="small-cross" onClick={e => this._toggleGenerateFromCode(false)}>Cancel</Button>
        </ButtonGroup>
        <div>
          <JsonEditor value={userCode} onChange={this._setUserCode} />
        </div>
      </>
    );
  }

  renderSchema() {
    const { generateCode } = this.state;
    return generateCode === true ? this.renderGenerateCode() : this.renderForm();
  }

  renderExample(title, content) {
    return (
      <div>
        <div className="flex p-1">
        <DebouncedInput className="pl-1 flex-1" onChange={(e) => {}}
          onBlur={e => this._handleChangeExampleTitle(title, e)} value={title} />
        <Button
          className="ml-3"
          onClick={e => this._deleteExample(title)}
          icon="trash" />
        </div>
        <JsonEditor value={content} onBlur={e => this.addExample(title, e)} />
      </div>
    );
  }

  handleTabChange(selectedTab) {
    this.setState({ selectedTab });
  }

  render() {
    const { schema } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className="json-schema-react-editor bp3-dark bg-white dark:bg-gray-700">
        <Tabs className="bp3-simple-tab-list" id="SchemTabs" key={"horizontal"} onChange={this.handleTabChange} selectedTabId={selectedTab}>
          <Tab className="bp3-simple-tab" id="schema" title="Schema" panel={this.renderSchema()} />
          {schema.examples && Object.keys(schema.examples).map((example, i) =>
            <Tab
              className="bp3-simple-tab"
              id={example} key={i} title={example}
              panel={this.renderExample(example, schema.examples[example])}
            />
          )}
          <Button icon="small-plus" onClick={e => this.addExample()}>Example</Button>
        </Tabs>
      </div>
    );
  }
}

SchemaDesigner.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
  showEditor: PropTypes.bool,
  isMock: PropTypes.bool,
};

const mapStateToProps = ({ schema, dropdown }) => {
  return { schema, open: dropdown };
};

const mapDispatchToProps = dispatch => {
  const schema = bindActionCreators({...schemaSlice.actions, generateExampleFromSchema}, dispatch);
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

export default connect(mapStateToProps, mapDispatchToProps)(SchemaDesigner);