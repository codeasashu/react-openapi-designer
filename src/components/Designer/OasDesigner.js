//@flow
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import {Gutter} from '../Common';
import Content from '../Content';

const getDarkModeClasses = (dark) =>
  classNames({
    dark: !!dark,
    'bp3-dark': !!dark,
  });

function OasDesigner() {
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

OasDesigner.propTypes = {
  dark: PropTypes.bool,
  openapi: PropTypes.object,
};

export default OasDesigner;
