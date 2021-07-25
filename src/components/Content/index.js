import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Options from './options';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {TitleEditor, UrlEditor} from '../Editor';
import {MethodPane} from '../Panes';

const StyledContent = styled.div`
  width: calc(80% - 2px);
`;

class Content extends React.Component {
  render() {
    return (
      <StyledContent className={'flex flex-col flex-1'}>
        <div className="bp3-dark relative flex flex-1 flex-col bg-canvas">
          <Options />
          <div className="flex-1 relative">
            <div className="EditorPanel EditorPanel--primary EditorPanel--forms group p-0 flex flex-col relative inset-0">
              <div className="flex px-10 mt-10 max-w-6xl justify-between">
                <TitleEditor xl value="abc" />
              </div>
              <div className="px-10 pb-2 max-w-6xl">
                <div className="mt-6">
                  <UrlEditor />
                </div>
              </div>
              <Tabs
                className="flex flex-col flex-1"
                selectedTabClassName="selected-tab"
                selectedTabPanelClassName="block">
                <TabList className="mt-6 px-10 flex bp3-simple-tab-list">
                  <Tab className="bp3-simple-tab uppercase">get</Tab>
                  <Tab className="bp3-simple-tab uppercase">post</Tab>
                  <Tab className="bp3-simple-tab uppercase">put</Tab>
                  <Tab className="bp3-simple-tab uppercase">delete</Tab>
                </TabList>
                <TabPanel className="bp3-simple-tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative">
                  <MethodPane methodName="get" />
                </TabPanel>
                <TabPanel className="bp3-simple-tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative">
                  <MethodPane methodName="post" />
                </TabPanel>
                <TabPanel className="bp3-simple-tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative">
                  <MethodPane methodName="put" />
                </TabPanel>
                <TabPanel className="bp3-simple-tab-panel rounded-none flex-1 border-l-0 border-r-0 border-b-0 relative">
                  <MethodPane methodName="delete" />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </StyledContent>
    );
  }
}

export default Content;
