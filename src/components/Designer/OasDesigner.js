import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sidebar from '../Sidebar';
import {Gutter} from '../Common';
import Content from '../Content';

class OasDesigner extends React.Component {
  getDarkMode() {
    const isDarkMode = !!this.props.dark;
    return classNames({
      dark: isDarkMode,
      'bp3-dark': isDarkMode,
    });
  }

  render() {
    return (
      <div className={this.getDarkMode()}>
        <div
          className={'bg-white dark:bg-gray-700 OasContainer h-screen w-full'}>
          <div className={'Studio h-full flex flex-1 flex-col overflow-hidden'}>
            <div className={'flex flex-1'}>
              <Sidebar
                className={'flex flex-col bg-white dark:bg-gray-900 border-r'}>
                <p>Hello World</p>
              </Sidebar>
              <Gutter layout="horizontal" />
              <Content />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OasDesigner.propTypes = {
  dark: PropTypes.bool,
};

export default OasDesigner;
