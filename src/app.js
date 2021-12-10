//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Sidebar, Gutter, Header, Content, Context} from './components';
import pjson from '../package.json';
import Stores from './Stores';
import {observer} from 'mobx-react-lite';

const Designer = observer(() => {
  const stores = React.useContext(Context.StoresContext);
  const {activeView, views, fullscreen} = stores.uiStore;
  const shouldShowSidebar =
    fullscreen === false && activeView !== views.preview;
  return (
    <div className="dark bp3-dark">
      <div className={'OasContainer h-screen w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          {stores.uiStore.fullscreen === false && (
            <Header repoUrl={pjson.repository.url} version={pjson.version}>
              Openapi Designer
            </Header>
          )}
          <div className={'flex flex-1'}>
            {shouldShowSidebar && (
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
