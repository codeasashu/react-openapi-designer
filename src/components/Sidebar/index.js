import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Classes, Intent, Icon, TreeNodeInfo, Tree} from '@blueprintjs/core';
import {
  Classes as Popover2Classes,
  ContextMenu2,
  Tooltip2,
} from '@blueprintjs/popover2';

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const contentSizing = {
  popoverProps: {popoverClassName: Popover2Classes.POPOVER2_CONTENT_SIZING},
};
const INITIAL_STATE: TreeNodeInfo[] = [
  {
    id: 0,
    hasCaret: false,
    icon: 'star',
    label: 'API Overview',
  },
  {
    id: 1,
    hasCaret: false,
    icon: 'folder-close',
    isExpanded: true,
    label: (
      <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
        Path
      </ContextMenu2>
    ),
    childNodes: [
      {
        id: 2,
        label: (
          <div>
            <span>/users/get</span>
          </div>
        ),
      },
      {
        id: 3,
        icon: (
          <Icon
            icon="tag"
            intent={Intent.PRIMARY}
            className={Classes.TREE_NODE_ICON}
          />
        ),
        label:
          'Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.',
      },
      {
        id: 4,
        hasCaret: true,
        icon: 'folder-close',
        label: (
          <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
            <Tooltip2 content="foo" placement="right">
              Folder 2
            </Tooltip2>
          </ContextMenu2>
        ),
        childNodes: [
          {id: 5, label: 'No-Icon Item'},
          {id: 6, icon: 'tag', label: 'Item 1'},
          {
            id: 7,
            hasCaret: true,
            icon: 'folder-close',
            label: (
              <ContextMenu2
                {...contentSizing}
                content={<div>Hello there!</div>}>
                Folder 3
              </ContextMenu2>
            ),
            childNodes: [
              {id: 8, icon: 'document', label: 'Item 0'},
              {id: 9, icon: 'tag', label: 'Item 1'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    hasCaret: false,
    icon: 'folder-close',
    label: 'Super secret files',
    disabled: true,
  },
];

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

class Sidebar extends React.Component {
  render() {
    return (
      <StyledSidebar
        className={'flex flex-col bg-white dark:bg-gray-800 border-r'}>
        <Title text="Prod" />
        <Tree contents={INITIAL_STATE} className={Classes.ELEVATION_0} />
      </StyledSidebar>
    );
  }
}

export default Sidebar;
