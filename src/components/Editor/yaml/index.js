// @flow
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import MonacoEditor from 'react-monaco-editor';
import MonacoConfig from '../../../monaco.config';
import YamlDefaults from './defaults';

const Yaml = ({value: initValue, onChange, ...props}) => {
  const [value, setValue] = useState(initValue || '');

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const _handleChange = (e) => {
    setValue(e);
    onChange(e);
  };

  const _handleBlur = () => {
    if (value && typeof props.onBlur === 'function') {
      props.onBlur(value);
    }
  };

  const registerYaml = (monaco) => {
    const yamlDefaults = new YamlDefaults('yaml', {
      validate: true,
      schemas: MonacoConfig.schemas.yaml,
      //enableSchemaRequest: false,
    });

    monaco.languages.yaml = {
      yamlDefaults,
    };

    monaco.languages.register({
      id: 'yaml',
      extensions: ['.yaml', '.yml'],
      aliases: ['YAML', 'yaml', 'YML', 'yml'],
      mimetypes: ['application/x-yaml'],
    });
  };

  return (
    <MonacoEditor
      language="yaml"
      theme="my-theme"
      value={value}
      editorWillMount={(monaco) => {
        console.log('willmount', monaco);
        //registerYaml(monaco);
        const yamlDefaults = new YamlDefaults('yaml', {
          validate: true,
          schemas: MonacoConfig.schemas.yaml,
          //enableSchemaRequest: false,
        });

        monaco.languages.yaml = {
          yamlDefaults,
        };

        monaco.languages.register({
          id: 'yaml',
          //extensions: ['.yaml', '.yml'],
          aliases: ['YAML', 'yaml', 'YML', 'yml'],
          //mimetypes: ['application/x-yaml'],
        });
        monaco.languages.onLanguage('yaml', function () {
          var e = [];

          for (var t = 0; arguments.length > t; t++) {
            e[t] = arguments[t];
          }
          console.log('on yaml', e);
        });

        //monaco.languages.yaml.yamlDefaults.setDiagnosticsOptions({
        //validate: true,

        //schemas: [
        //{
        //fileMatch: ['*'],
        //uri: 'file://yaml-OpenAPI-3_1',
        //schema: MonacoConfig.schemas.yaml,
        //},
        //],
        //});
        monaco.editor.defineTheme('my-theme', MonacoConfig.theme);
      }}
      options={{
        glyphMargin: true,
        highlightActiveIndentGuide: false,
        copyWithSyntaxHighlighting: false,
        colorDecorators: false,
        automaticLayout: true,
        minimap: {enabled: false},
        overviewRulerBorder: false,
        readOnly: false,
        renderLineHighlight: 'none',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        wordWrapColumn: 80,
        scrollbar: {
          horizontalScrollbarSize: 6,
          verticalScrollbarSize: 6,
          useShadows: true,
        },
        wordBasedSuggestions: true,
      }}
      onChange={(e) => _handleChange(e)}
    />
  );

  //return (
  //<>
  //<Editor
  //textareaClassName={props.textareaClassName}
  //className={props.className}
  //preClassName=""
  //value={value}
  //highlight={(code) =>
  //code && Prism.highlight(code, Prism.languages.markup, 'markup')
  //}
  //onValueChange={(e) => _handleChange(e)}
  //onBlur={(e) => _handleBlur(e.target.value)}
  //padding={10}
  //style={{
  //fontFamily: '"Fira code", "Fira Mono", monospace',
  //fontSize: 12,
  //width: '100%',
  //}}
  ///>
  //{props.error && <div className="text-sm text-red-400">{props.error}</div>}
  //</>
  //);
};

Yaml.propTypes = {
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

export default Yaml;
