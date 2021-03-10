import React from 'react';
import { autoBindMethodsForReact } from 'class-autobind-decorator';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as schemaDesignerActions from './redux/modules/schema-designer';
import SchemaRow from './elements/schema-row';
import SchemaJson from './elements/schema-json';

@autoBindMethodsForReact()
class SchemaDesigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      if (!_.isEqual(oldData, newData)) return this.props.onChange(newData);
    }
    if (this.props.data && this.props.data !== oldProps.data) {
      console.log('updatedata', this.props.data);
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

  render() {
    const { schema } = this.props;
    const { show } = this.state;
    return (
      <div className="json-schema-react-editor">
        <SchemaRow
          show={true}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchemaDesigner);