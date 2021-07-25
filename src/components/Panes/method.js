import React from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {responseStore} from '../../redux/store';
import {Switch, ButtonGroup, Button} from '@blueprintjs/core';
import {TitleEditor as Title, MarkdownEditor as Markdown} from '../Editor';
import RequestBody from '../Designer/RequestBody';
import Responses from '../Designer/Responses';

class Method extends React.Component {
  render() {
    const {methodName} = this.props;
    return (
      <div className="relative">
        <div className="w-full p-10 pb-16 max-w-6xl">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div>
                <div className="text-xs uppercase p-2">Operation ID</div>
                <Title small value="get-user" />
              </div>
              <div className="flex items-baseline">
                <div className="text-xs uppercase">Deprecated</div>
                <Switch checked={false} className="ml-2 py-1" />
              </div>
            </div>
            <div className="text-xs uppercase px-2 pt-2">Description</div>
            <div className="flex-1">
              <Markdown
                className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
                placeholder="Description...."
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
}

Method.propTypes = {
  methodName: PropTypes.string,
};

export default Method;
