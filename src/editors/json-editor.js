// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import {isObject} from 'lodash';

class JsonEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: '', error: null, json: null};
  }

  componentDidMount() {
    const {value} = this.props;
    const content = isObject(value) ? JSON.stringify(value, null, 4) : value;
    this.setState({value: content});
  }

  componentDidUpdate(oldProps) {
    const {value} = this.props;
    if (oldProps.value != value) {
      const content = isObject(value) ? JSON.stringify(value, null, 4) : value;
      this.setState({value: content});
    }
  }

  _handleChange(e) {
    this.setState({value: e});
    this._parseJson(e);
  }

  _parseJson(e) {
    let content = e;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(content);
    }
    try {
      content = JSON.parse(content);
      this.setState({json: content, error: null});
      if (typeof this.props.onValidJson === 'function') {
        this.props.onValidJson(content);
      }
    } catch (error) {
      this.setState({error: 'Invalid JSON'});
      if (typeof this.props.onInValidJson === 'function') {
        this.props.onInValidJson(content);
      }
    }
  }

  _handleBlur() {
    const {json} = this.state;
    if (json && typeof this.props.onBlur === 'function') {
      this.props.onBlur(json);
    }
  }

  render() {
    const {value, error} = this.state;
    return (
      <>
        <Editor
          textareaClassName="bp3-code bp3-input bp3-fill reactopenapidesigner__simple__editor"
          preClassName=""
          value={value}
          highlight={(code) =>
            code && Prism.highlight(code, Prism.languages.json, 'json')
          }
          onValueChange={(e) => this._handleChange(e)}
          onBlur={(e) => this._handleBlur(e.target.value)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            width: '100%',
          }}
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
      </>
    );
  }
}

JsonEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onValidJson: PropTypes.func,
  onInValidJson: PropTypes.func,
  onBlur: PropTypes.func,
};

export default JsonEditor;
