//@flow
import React from 'react';
import PropTypes from 'prop-types';
import pjson from '../package.json';
import {Sidebar, Gutter, Content, Context} from './components';
import Stores from './Stores';
import {observer} from 'mobx-react-lite';
import {Tag} from '@blueprintjs/core';

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
                <Tag>Ver: {pjson.version}</Tag>
              </div>
              <div className="flex items-center">
                <div className="text-base overflow-hidden mx-2">
                  Openapi Designer
                </div>
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
                className={'flex flex-col bg-white dark:bg-gray-900 border-r'}
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
