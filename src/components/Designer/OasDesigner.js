import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import {Gutter} from '../Common';
import Content from '../Content';
import {BrowserRouter as Router, useHistory} from 'react-router-dom';

const getDarkModeClasses = (dark) =>
  classNames({
    dark: !!dark,
    'bp3-dark': !!dark,
  });

function OasDesignerBare(props) {
  let history = useHistory();

  function handleClick({menu, itemPath}) {
    const queryParams = new URLSearchParams({menu, path: itemPath});
    console.log('item clicked in sidebar', menu, itemPath);
    history.push(`/designer?${queryParams}`);
  }

  return (
    <div className={getDarkModeClasses(props.dark)}>
      <div className={'bg-white dark:bg-gray-700 OasContainer h-full w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          <div className={'flex flex-1'}>
            <Sidebar
              onClick={handleClick}
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

OasDesignerBare.propTypes = {
  dark: PropTypes.bool,
  history: PropTypes.any,
};

export default function OasDesigner(props) {
  return (
    <Router>
      <OasDesignerBare {...props} />
    </Router>
  );
}

OasDesigner.displayName = 'OasDesigner';
