// @flow
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Editor from 'react-simple-code-editor';
import hljs from 'highlight.js';

const Markdown = ({value: initValue, onChange, ...props}) => {
  const [value, setValue] = useState(initValue || '');

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const _handleChange = (e) => {
    setValue(e);
    if (onChange) {
      onChange(e);
    }
  };

  const _handleBlur = () => {
    if (value && typeof props.onBlur === 'function') {
      props.onBlur(value);
    }
  };

  return (
    <>
      <Editor
        textareaClassName={props.textareaClassName}
        className={classnames(
          props.className,
          'relative max-h-400px overflow-auto',
        )}
        preClassName=""
        placeholder={props.placeholder || ''}
        value={value}
        highlight={(code) =>
          code && hljs.highlight(code, {language: 'markdown'}).value
        }
        onValueChange={(e) => _handleChange(e)}
        onBlur={(e) => _handleBlur(e.target.value)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          minHeight: 38,
        }}
      />
      {props.error && <div className="text-sm text-red-400">{props.error}</div>}
    </>
  );
};

Markdown.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onValidJson: PropTypes.func,
  onInValidJson: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
  error: PropTypes.any,
};

export default Markdown;
