import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {MenuItem, Paths, Responses, Models, Parameters} from './MenuItems';

const StyledSidebar = styled.div`
  max-width: 375px;
  min-width: 290px;
  width: calc(20% - 2px);
`;

const Title = (props) => {
  return (
    <div className={'flex items-center'}>
      <div
        className={
          'flex-1 px-4 py-2 truncate select-none text-gray-6 dark:text-gray-3'
        }>
        {props.text}
      </div>
    </div>
  );
};

Title.propTypes = {
  text: PropTypes.string,
};

const models = {
  Users: {
    title: 'Users',
    type: 'object',
    description: '',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
  Pets: {
    title: 'Pets',
    type: 'object',
    description: '',
    properties: {
      id: {
        type: 'string',
      },
    },
  },
};

const responses = {
  test: {
    description: '',
    content: {
      'application/json': {
        schema: {
          title: 'Users',
          type: 'object',
          description: '',
          properties: {
            id: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

//const paths = {
//'/users': {
//tags: ['get', 'post'],
//},
//'/pet': {
//tags: ['post'],
//},
//};

const Sidebar = ({openapi, onClick}) => {
  console.log('openapi', openapi);
  useEffect(() => {
    console.log('openapi2', openapi);
  }, []);
  return (
    <StyledSidebar
      className={'flex flex-col bg-white dark:bg-gray-900 border-r'}>
      <Title text="Prod" />
      <div className="TreeList SidebarTreeList flex-1 TreeList--interactive">
        <MenuItem
          icon="star"
          label="API Overview"
          onClick={() => onClick({menu: 'info'})}
        />
        <Paths
          paths={openapi.paths}
          onClick={(path) => onClick({menu: 'path', ...path})}
        />
        <Models
          models={models}
          onClick={(path) => onClick({menu: 'model', ...path})}
        />
        <Parameters
          parameters={models}
          onClick={(path) => onClick({menu: 'parameter', ...path})}
        />
        <Responses
          responses={responses}
          onClick={(path) => onClick({menu: 'response', ...path})}
        />
      </div>
    </StyledSidebar>
  );
};

Sidebar.propTypes = {
  onClick: PropTypes.func,
  openapi: PropTypes.object,
};

export default Sidebar;
