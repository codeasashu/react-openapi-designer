//@flow
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Sidebar, Gutter, Content, Context} from './components';
import Stores from './Stores';

const getDarkModeClasses = (dark) =>
  classNames({
    dark: !!dark,
    'bp3-dark': !!dark,
  });

function Designer() {
  return (
    <div className={getDarkModeClasses(true)}>
      <div className={'OasContainer h-screen w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          <div className={'flex flex-1'}>
            <Sidebar
              style={{
                width: 'calc(18% - 2px)',
                maxWidth: '375px',
                minWidth: '290px',
              }}
              className={'flex flex-col bg-white dark:bg-gray-900 border-r'}
            />
            <Gutter layout="horizontal" />
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}

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
