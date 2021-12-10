import React from 'react';
import {AnchorButton, Icon, Tag} from '@blueprintjs/core';

const Header = ({repoUrl, version, ...props}) => {
  return (
    <div
      className="grid py-4 px-5 w-100 bg-canvas border-b"
      style={{gridTemplateColumns: '1fr auto 1fr'}}>
      <div className="flex justify-start items-center">
        <Tag large minimal icon="git-commit">
          {version}
        </Tag>
      </div>
      <div className="flex items-center">
        <div className="text-base overflow-hidden mx-2">
          <a href={repoUrl} target="_blank" rel="noreferrer">
            {props.children}
          </a>
        </div>
      </div>
      <div className="flex justify-end items-center">
        <AnchorButton
          icon={<Icon size={12} icon="git-repo" />}
          href={repoUrl}
          target="_blank"
          text="View on Github"
        />
      </div>
    </div>
  );
};

export default Header;
