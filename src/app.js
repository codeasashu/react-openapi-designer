//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Sidebar, Gutter, Header, Content, Context} from './components';
import {Import} from './components/Common';
import pjson from '../package.json';
import Stores from './Stores';
import {ImportState} from './Stores/importStore';
import {observer} from 'mobx-react-lite';

const Designer = observer(({showHeader = true}) => {
  const stores = React.useContext(Context.StoresContext);
  const {activeView, views, fullscreen} = stores.uiStore;
  const shouldShowSidebar =
    fullscreen === false && activeView !== views.preview;

  // React.useEffect(() => {
  //   stores.importStore.convert_openapi_url(specUrl);
  // }, [specUrl]);
  return (
    <>
      {stores.importStore.importState !== ImportState.progress && (
        <div className="dark bp4-dark">
          <div className={'OasContainer h-screen w-full'}>
            <div className={'Studio h-full flex flex-1 flex-col'}>
              {stores.uiStore.fullscreen === false && !!showHeader && (
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
      )}
      <Import open={stores.importStore.importState === ImportState.progress} />
    </>
  );
});

Designer.propTypes = {
  dark: PropTypes.bool,
  openapi: PropTypes.object,
};

const App = (props) => {
  return (
    <Context.StoresContext.Provider value={new Stores({...props})}>
      <Designer {...props} />
    </Context.StoresContext.Provider>
  );
};

export default App;
