import React from 'react';
import Editor from "react-simple-code-editor";
import Prism from 'prismjs';
import { ButtonGroup, Button, Tab, Tabs } from "@blueprintjs/core";
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEqual, isObject } from 'lodash';
import * as schemaDesignerActions from './redux/modules/schema-designer';
import SchemaRow from './elements/schema-row';
import SchemaJson from './elements/schema-json';
import GenerateSchema from 'generate-schema/src/schemas/json.js';
const jsf = require('json-schema-faker');
import DebouncedInput from './elements/debounced-input';

jsf.option({ requiredOnly: false, fillProperties: true, optionalsProbability: 0 });

@autoBindMethodsForReact()
class SchemaDesigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      const title = this.state.title || '';
      newData.title = title;
      if (!isEqual(oldData, newData)) return this.props.onChange(newData);
    }
    if (this.props.data && this.props.data !== oldProps.data) {
      this.props.changeEditorSchema({ value: this.props.data });
    }
  }

  componentDidMount() {
    let data = this.props.data;
    if (!data) {
      data = {
        type: 'object',
        title: 'title',
        properties: {},
      };
    }

    this.setState({ title: this.props.schema.title || '' });
    this.props.changeEditorSchema({ value: data });
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
    let generatedJSON = null;
    try {
      generatedJSON = JSON.parse(this.state.userCode);
    } catch(error) {
      console.warn('[JSON parseError]', error);
    }
    if(isObject(generatedJSON)) {
      let schema = GenerateSchema(generatedJSON);
      console.log('generateCode', schema, generatedJSON);
      this.props.changeEditorSchema({ value: schema });
      this.setState({ userCode: '{}' });
      this._toggleGenerateFromCode(false);
    }
  }

  _setUserCode(userCode) {
    this.setState({ userCode })
  }

  async addExample(key, value) {
    const {schema, addExample} = this.props;
    if(!key || key === '')
      key = `example-${Object.keys(schema.examples).length + 1}`;
    value = value || await jsf.resolve(schema);
    addExample({ key, value });
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
    const { userCode } = this.state;
    return (
      <>
        <ButtonGroup>
          <Button icon="clean" onClick={this._handleGenerateFromCode}>Generate</Button>
          <Button icon="small-cross" onClick={e => this._toggleGenerateFromCode(false)}>Cancel</Button>
        </ButtonGroup>
        <div>
          <Editor
            value={userCode}
            onValueChange={this._setUserCode}
            highlight={(code) => code && Prism.highlight(code, Prism.languages.json, 'json')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
      </>
    );
  }

  renderSchema() {
    const { generateCode } = this.state;
    return generateCode === true ? this.renderGenerateCode() : this.renderForm();
  }

  _deleteExample(title) {
    const { deleteExample } = this.props;
    console.log('delexample', title);
    deleteExample(title);
    this.setState({ selectedTab: 'schema'});
  }

  _handleChangeExampleTitle(oldtitle, title) {
    const { schema, addExample, deleteExample } = this.props;
    const oldValue = schema.examples[oldtitle];
    deleteExample(oldtitle);
    setTimeout(() => {
      this.addExample(title, oldValue);
      this.setState({ selectedTab: title});
    }, 0);
  }

  renderExample(title, content) {
    return (
      <div>
        <div className="flex">
        <DebouncedInput className="pl-1 flex-1" 
          onChange={e => this._handleChangeExampleTitle(title, e)} value={title} />
        <Button
          className="ml-3"
          onClick={e => this._deleteExample(title)}
          icon="trash" />
          </div>
        <Editor
          value={ JSON.stringify(content, null, 4) }
          highlight={(code) => code && Prism.highlight(code, Prism.languages.json, 'json')}
          onValueChange={e => this._changeExample(title, e)}
          padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
        />
      </div>
    );
  }

  _changeExample(title, e) {
    console.log('changedex', title, e);
    this.addExample(title, JSON.parse(e));
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

const mapStateToProps = ({ open, schema }) => {
  return { schema, open };
};

const mapDispatchToProps = dispatch => {
  const schema = bindActionCreators(schemaDesignerActions, dispatch);
  return {
    changeEditorSchema: schema.changeEditorSchema,
    changeName: schema.changeName,
    changeValue: schema.changeValue,
    changeType: schema.changeType,
    enableRequire: schema.enableRequire,
    requireAll: schema.requireAll,
    deleteItem: schema.deleteItem,
    addField: schema.addField,
    addChildField: schema.addChildField,
    setOpenValue: schema.setOpenValue,
    addExample: schema.addExample,
    deleteExample: schema.deleteExample,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchemaDesigner);