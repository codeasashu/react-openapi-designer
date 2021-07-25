import React from 'react';
import PropTypes from 'prop-types';
import {Tag} from '@blueprintjs/core';
import MenuItem from './base';

const PathItem = (props) => {
  return (
    <div className="flex group w-full items-center">
      <div
        className="DesignTreeListItem__path relative h-full flex flex-col justify-center w-full DesignTreeListItem__path--active"
        style={{paddingLeft: '22px'}}>
        <span className="truncate text-left direction-rtl unicode-bidi">
          {props.label}
        </span>
        {props.tags && (
          <div className="uppercase mt-1 mb-1 truncate">
            {props.tags.map((tag) => (
              <Tag key={tag} className="mr-2 mt-1">
                {tag}
              </Tag>
            ))}
          </div>
        )}
        <div className="flex items-center flex-no-wrap mr-2"></div>
      </div>
    </div>
  );
};

PathItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.array,
};

const Paths = (props) => {
  return (
    <>
      <MenuItem icon="folder-open" label="Paths" />
      {Object.keys(props.paths).map((path, i) => (
        <PathItem key={i} label={path} tags={props.paths[path].tags} />
      ))}
    </>
  );
};

Paths.propTypes = {
  paths: PropTypes.object,
};

export default Paths;
