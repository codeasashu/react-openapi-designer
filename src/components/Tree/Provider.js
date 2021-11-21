import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {StoreContext, DesignContext} from '../Context';

const TreeProvider = observer(
  ({store, className, innerClassName, itemClassName, children}) => {
    return (
      <StoreContext.Provider value={store}>
        <DesignContext.Provider
          value={{
            itemClassName,
            innerClassName,
            className,
          }}>
          {children}
        </DesignContext.Provider>
      </StoreContext.Provider>
    );
  },
);

TreeProvider.propTypes = {
  store: PropTypes.object,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  children: PropTypes.element,
};

export default TreeProvider;
