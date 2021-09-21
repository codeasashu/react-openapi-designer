import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import TreeContainer from './Container';
import Provider from './Provider';

const TreeList = observer(
  ({store, className, itemClassName, innerClassName, ...rest}) => {
    return (
      <Provider
        store={store}
        className={className}
        itemClassName={itemClassName}
        innerClassName={innerClassName}>
        <TreeContainer {...rest} />
      </Provider>
    );
  },
);

TreeList.propTypes = {
  store: PropTypes.object,
  className: PropTypes.string,
  innerClassName: PropTypes.string,
  itemClassName: PropTypes.string,
};

export default TreeList;
