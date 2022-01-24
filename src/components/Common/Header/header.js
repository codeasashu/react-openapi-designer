import React from 'react';
import PropTypes from 'prop-types';
import {
  AnchorButton,
  Intent,
  Alert,
  Icon,
  Button,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
import {observer} from 'mobx-react';
import {StoresContext} from '../../Context';

const Header = observer(({repoUrl, version, ...props}) => {
  const stores = React.useContext(StoresContext);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const clearLocalDoc = () => {
    stores.storageStore.clear();
    setAlertOpen(false);
  };

  return (
    <>
      <div
        className="grid py-4 px-5 w-100 bg-canvas border-b"
        style={{gridTemplateColumns: '1fr auto 1fr'}}>
        <div className="flex justify-start items-center">
          <Popover2
            placement="bottom"
            content={
              <Menu>
                <MenuItem
                  text="Reset data"
                  onClick={() => setAlertOpen(true)}
                />
                <MenuItem text={`Version: ${version}`} />
              </Menu>
            }>
            <Button icon="menu" minimal small outlined />
          </Popover2>
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
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Reset Data"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={alertOpen}
        onCancel={() => setAlertOpen(false)}
        onConfirm={() => clearLocalDoc()}>
        You will loose all the data. Do you wish to continue?
      </Alert>
    </>
  );
});

Header.propTypes = {
  repoUrl: PropTypes.string,
  version: PropTypes.any,
  children: PropTypes.any,
};

export default Header;
