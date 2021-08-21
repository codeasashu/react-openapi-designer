import React from 'react';
import PropTypes from 'prop-types';
import {autoBindMethodsForReact} from 'class-autobind-decorator';
import {Provider} from 'react-redux';
import {responseStore} from '../../redux/store';
import {Switch, ButtonGroup, Button, Intent} from '@blueprintjs/core';
import {TitleEditor as Title, MarkdownEditor as Markdown} from '../Editor';
import RequestBody from '../Designer/RequestBody';
import Responses from '../Designer/Responses';

@autoBindMethodsForReact()
class Method extends React.Component {
  handleDeprecated(value) {
    console.log('deprecated', value);
  }

  renderOperation() {
    const {methodName, operation, onChange} = this.props;
    return (
      <div className="relative">
        <div className="w-full p-10 pb-16 max-w-6xl">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div>
                <div className="uppercase p-2" style={{fontSize: '9px'}}>
                  Operation ID
                </div>
                <Title small value={operation['operationId']} />
              </div>
              <div className="flex items-baseline">
                <div className="text-xs uppercase">Deprecated</div>
                <Switch
                  checked={false}
                  onChange={this.handleDeprecated}
                  className="ml-2 py-1"
                />
              </div>
            </div>
            <div className="uppercase px-2 pt-2" style={{fontSize: '9px'}}>
              Description
            </div>
            <div className="flex-1">
              <Markdown
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
                value={operation['description'] || ''}
                onChange={(e) => onChange({description: e})}
              />
            </div>
            <div className="my-8 -mx-1 border-t dark:border-darken-4" />
            <ButtonGroup>
              <Button text="Security" icon="plus" />
              <Button text="Header" icon="plus" />
              <Button text="Query Param" icon="plus" />
              <Button text="Cookie" icon="plus" />
            </ButtonGroup>
            <div className="my-8 -mx-1 border-t dark:border-darken-4" />
            <RequestBody />
            <div className="my-8 -mx-1 border-t dark:border-darken-4" />
            <Provider store={responseStore}>
              <Responses />
            </Provider>
          </div>
          <p>Method pane: {methodName}</p>
        </div>
      </div>
    );
  }

  renderAddOperation() {
    const {methodName} = this.props;
    return (
      <div className="pt-24 text-center">
        <Button
          large
          intent={Intent.PRIMARY}
          icon="plus"
          onClick={this.props.onAddOperation}
          text={`${methodName.toUpperCase()} Operation`}
        />
      </div>
    );
  }

  render() {
    const {methodName, operation} = this.props;
    console.log('method', methodName, operation);
    return operation ? this.renderOperation() : this.renderAddOperation();
  }
}

Method.propTypes = {
  methodName: PropTypes.string,
  operation: PropTypes.object,
  onChange: PropTypes.func,
  onAddOperation: PropTypes.func,
};

export default Method;
