// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {InputGroup, TextArea} from '@blueprintjs/core';

const DEBOUNCE_MILLIS = 100;

function keyedDebounce(
  callback: Function,
  millis: number = DEBOUNCE_MILLIS,
): Function {
  let timeout;
  let results = {};

  return function (key, ...args) {
    results[key] = args;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!Object.keys(results).length) {
        return;
      }

      callback(results);
      results = {};
    }, millis);
  };
}

function debounce(
  callback: Function,
  millis: number = DEBOUNCE_MILLIS,
): Function {
  // For regular debounce, just use a keyed debounce with a fixed key
  return keyedDebounce((results) => {
    callback.apply(null, results.__key__);
  }, millis).bind(null, '__key__');
}

@autoBindMethodsForReact()
class DebouncedInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {value: ''};

    if (!props.delay) {
      this._handleValueChange = props.onChange;
    } else {
      this._handleValueChange = debounce(props.onChange, props.delay || 500);
    }

    this._hasFocus = false;
  }

  componentDidMount() {
    const {value} = this.props;
    this.setState({value});
  }

  componentDidUpdate(oldProps) {
    const {value} = this.props;
    if (oldProps.value != value) {
      this.setState({value});
    }
  }

  _handleChange(e) {
    this.setState({value: e.target.value});
    this._handleValueChange(e.target.value);
  }

  _handleFocus() {
    const {value} = this.state;
    this._hasFocus = true;
    this.props.onFocus && this.props.onFocus(value);
  }

  _handleBlur() {
    const {value} = this.state;
    this._hasFocus = false;
    this.props.onBlur && this.props.onBlur(value);
  }

  _setRef(n) {
    this._input = n;
  }

  setAttribute(name, value) {
    this._input.setAttribute(name, value);
  }

  removeAttribute(name) {
    this._input.removeAttribute(name);
  }

  getAttribute(name) {
    this._input.getAttribute(name);
  }

  hasFocus() {
    return this._hasFocus;
  }

  getSelectionStart() {
    if (this._input) {
      return this._input.selectionStart;
    } else {
      return -1;
    }
  }

  getSelectionEnd() {
    if (this._input) {
      return this._input.selectionEnd;
    } else {
      return -1;
    }
  }

  focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  focusEnd() {
    if (this._input) {
      // Hack to focus the end (set value to current value);
      this._input.value = this.getValue();
      this._input.focus();
    }
  }

  blur() {
    if (this._input) {
      this._input.blur();
    }
  }

  select() {
    if (this._input) {
      this._input.select();
    }
  }

  getValue() {
    if (this._input) {
      return this.state.value;
    } else {
      return '';
    }
  }

  render() {
    const {textarea, ...props} = this.props;
    if (textarea) {
      return (
        <TextArea
          ref={this._setRef}
          {...props}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
        />
      );
    } else {
      return (
        <InputGroup
          ref={this._setRef}
          value={this.state.value || ''}
          {...props}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
        />
      );
    }
  }
}

DebouncedInput.propTypes = {
  // Required
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // Optional
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  textarea: PropTypes.bool,
  delay: PropTypes.number,
};

export default DebouncedInput;
