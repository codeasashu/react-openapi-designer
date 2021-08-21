import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {openapi} from 'store/modules/openapi';
import Sidebar from '../Sidebar';
import {Gutter} from '../Common';
import Content from '../Content';
import {BrowserRouter as Router, useHistory} from 'react-router-dom';

const getDarkModeClasses = (dark) =>
  classNames({
    dark: !!dark,
    'bp3-dark': !!dark,
  });

function OasDesignerBare({dark, openapi, ...props}) {
  // const openapi = new OASBuilder(sampleDoc);
  let history = useHistory();

  function handleClick({menu, itemPath = {}}) {
    const queryParams = new URLSearchParams({menu, ...itemPath});
    history.push(`/designer?${queryParams}`);
  }

  return (
    <div className={getDarkModeClasses(dark)}>
      <div className={'bg-white dark:bg-gray-700 OasContainer h-full w-full'}>
        <div className={'Studio h-full flex flex-1 flex-col'}>
          <div className={'flex flex-1'}>
            <Sidebar
              openapi={openapi}
              onClick={handleClick}
              className={'flex flex-col bg-white dark:bg-gray-900 border-r'}
            />
            <Gutter layout="horizontal" />
            <Content
              openapi={openapi}
              onPathChange={({path, pathItem}) =>
                props.handlePathChange({path, pathItem})
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

OasDesignerBare.propTypes = {
  dark: PropTypes.bool,
  openapi: PropTypes.object,
  handlePathChange: PropTypes.func,
};

const OasDesigner = (props) => {
  return (
    <Router>
      <OasDesignerBare {...props} />
    </Router>
  );
};

OasDesigner.displayName = 'OasDesigner';

const mapStateToProps = ({openapi}) => ({openapi});
const mapDispatchToProps = (dispatch) => {
  const openapiActions = bindActionCreators(openapi.actions, dispatch);
  return {...openapiActions};
};

export default connect(mapStateToProps, mapDispatchToProps)(OasDesigner);
