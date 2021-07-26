// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {isEqual, set, unset} from 'lodash';
import produce from 'immer';
import {defaultSchema, ContentTypes} from '../../../utils';
import MarkupEditor from '../../Editor/markdown';
import BodySelector from '../../body-selector';
import SchemaDesigner from '../Schema/root';
import Headers from './headers';
import StatusCodePicker from '../../Pickers/StatusCode';
import {ButtonGroup, Button, Icon} from '@blueprintjs/core';

@autoBindMethodsForReact()
class ResponseDesigner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMediaType: null,
      response: {
        description: '',
        headers: {},
        content: {[ContentTypes.json]: {schema: defaultSchema.object}},
        ...props.initschema,
      },
    };
  }

  componentDidUpdate(oldProps, oldState) {
    const {response} = this.state;
    if (
      !isEqual(oldState.response, response) &&
      Object.prototype.hasOwnProperty.call(this.props, 'onChange')
    ) {
      this.props.onChange(response);
    }
  }

  handleMediaType(action, mediaType, oldMediaType) {
    if (action === 'select') {
      this.setState({selectedMediaType: mediaType});
    } else if (action === 'add') {
      const schema = defaultSchema.object;
      this.setState(
        produce((draft) => {
          draft.selectedMediaType = mediaType;
          set(draft.response, `content.${mediaType}`, {schema});
        }),
      );
    } else if (action === 'update') {
      this.setState(
        produce((draft) => {
          const schema = draft.response.content[oldMediaType]?.schema;
          delete draft.response.content[oldMediaType];
          draft.selectedMediaType = mediaType;
          set(draft.response, `content.${mediaType}`, {schema});
        }),
      );
    } else if (action === 'delete') {
      // @TODO check if response has any contenttype left. If not,
      // trigger the deleteResponse event from here
      this.setState(
        produce((draft) => {
          draft.selectedMediaType = oldMediaType;
          unset(draft.response, `content.${mediaType}`);
        }),
      );
    }
  }

  updateState(propertyPath, value) {
    this.setState(
      produce((draft) => {
        set(draft.response, propertyPath, value);
      }),
    );
  }

  mediaTypeRenderer() {
    const {content} = this.state.response;
    return (
      <BodySelector
        contentTypes={Object.keys(content)}
        onSelect={(c) => this.handleMediaType('select', c)}
        onAdd={(c) => this.handleMediaType('add', c)}
        onDelete={(_new, _old) => this.handleMediaType('delete', _new, _old)}
        onUpdate={(_new, _old) => this.handleMediaType('update', _new, _old)}
      />
    );
  }

  schemaRenderer() {
    const {selectedMediaType, response} = this.state;
    const hasMediaType =
      !!selectedMediaType &&
      Object.keys(response.content).indexOf(selectedMediaType) >= 0;
    const schema = hasMediaType
      ? response.content[selectedMediaType]?.schema
      : null;
    return (
      <SchemaDesigner
        dark
        initschema={schema}
        onChange={(e) =>
          this.updateState(`content.${selectedMediaType}.schema`, e)
        }
      />
    );
  }

  renderResponseHeader() {
    return (
      <div className="flex items-center">
        <ButtonGroup className="flex-1 flex-no-wrap overflow-x-auto pb-4 -mb-4">
          <Button icon="plus" text="Response" />
          <Button
            icon={<Icon icon="full-circle" color="green" iconSize={10} />}
            text="200"
          />
          <Button
            icon={<Icon icon="full-circle" color="green" iconSize={10} />}
            text="201"
          />
        </ButtonGroup>
        <div className="ml-3">
          <StatusCodePicker />
        </div>
      </div>
    );
  }

  render() {
    const {dark} = this.props;
    const {description, headers} = this.state.response;
    return (
      <div className={`flex flex-col ${dark && 'bp3-dark'}`}>
        {this.renderResponseHeader()}
        <div className="flex-1">
          <MarkupEditor
            value={description}
            onChange={(e) => this.updateState('description', e)}
          />
        </div>
        <Headers
          parameters={headers}
          onChange={(e) => this.updateState('headers', e)}
        />
        <div className="mt-8">
          {this.mediaTypeRenderer()}
          <div className="mt-8">{this.schemaRenderer()}</div>
        </div>
      </div>
    );
  }
}

ResponseDesigner.propTypes = {
  dark: PropTypes.bool,
  initschema: PropTypes.object,
  onChange: PropTypes.func,
};

export default ResponseDesigner;
