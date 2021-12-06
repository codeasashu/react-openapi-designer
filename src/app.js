//@flow
import React from 'react';
import PropTypes from 'prop-types';
import pjson from '../package.json';
import {Sidebar, Gutter, Content, Context} from './components';
import Stores from './Stores';
import {observer} from 'mobx-react-lite';
import {AnchorButton, Icon, Tag} from '@blueprintjs/core';

const Designer = observer(() => {
  const stores = React.useContext(Context.StoresContext);
  return (
    <div className="dark bp3-dark">
      <div className={'OasContainer h-screen w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          {stores.uiStore.fullscreen === false && (
            <div
              className="grid py-4 px-5 w-100 bg-canvas border-b"
              style={{gridTemplateColumns: '1fr auto 1fr'}}>
              <div className="flex justify-start items-center">
                <Tag large minimal icon="git-commit">
                  {pjson.version}
                </Tag>
              </div>
              <div className="flex items-center">
                <div className="text-base overflow-hidden mx-2">
                  <a
                    href={pjson.repository.url}
                    target="_blank"
                    rel="noreferrer">
                    Openapi Designer
                  </a>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <AnchorButton
                  icon={<Icon size={12} icon="git-repo" />}
                  href={pjson.repository.url}
                  target="_blank"
                  text="View on Github"
                />
              </div>
            </div>
          )}
          <div className={'flex flex-1'}>
            {stores.uiStore.fullscreen === false && (
              <Sidebar
                fullscreen={stores.uiStore.fullscreen}
                style={{
                  width: 'calc(18% - 2px)',
                  maxWidth: '375px',
                  minWidth: '290px',
                }}
                className={'flex flex-col border-r'}
              />
            )}
            <Gutter layout="horizontal" />
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
});

Designer.propTypes = {
  dark: PropTypes.bool,
  openapi: PropTypes.object,
};

const App = (props) => {
  return (
    <Context.StoresContext.Provider value={new Stores()}>
      <Designer {...props} />
    </Context.StoresContext.Provider>
  );
};

export default App;
