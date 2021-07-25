import React from 'react';
import PropTypes from 'prop-types';
//import {Switch, ButtonGroup, Button, ControlGroup, HTMLSelect} from '@blueprintjs/core';
import BodySelector from '../../body-selector';
import SchemaDesigner from '../../../designers/schema';
import {MarkdownEditor as Markdown} from '../../Editor';
import {Provider} from 'react-redux';
import {schemaStore} from '../../../redux/store';

class RequestBody extends React.Component {
  render() {
    const bodyOptions = ['application/json', 'application/xml'];
    const initSchema = {
      title: 'abc',
      type: 'object',
      properties: {
        a: {type: 'string'},
      },
      required: ['a'],
      examples: {},
    };

    return (
      <div>
        <BodySelector contentTypes={bodyOptions} />
        <div className="flex-1">
          <Markdown
            className="mt-6 -mx-1 relative hover:bg-darken-2 rounded-lg"
            placeholder="abcdef"
          />
        </div>
        <div className="mt-6">
          <Provider store={schemaStore}>
            <SchemaDesigner dark initschema={initSchema} />
          </Provider>
        </div>
      </div>
    );
  }
}

export default RequestBody;
