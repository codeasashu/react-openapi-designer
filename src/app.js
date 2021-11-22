//@flow
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Sidebar, Gutter, Content, Context} from './components';
import Stores from './Stores';
import {observer} from 'mobx-react-lite';

const getDarkModeClasses = (dark) =>
  classNames({
    dark: !!dark,
    'bp3-dark': !!dark,
  });

const Designer = observer(() => {
  const stores = React.useContext(Context.StoresContext);
  return (
    <div className={getDarkModeClasses(true)}>
      <div className={'OasContainer h-screen w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
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
