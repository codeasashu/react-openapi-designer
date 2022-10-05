import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Classes,
  AnchorButton,
  Intent,
  Alert,
  Icon,
  Button,
  FileInput,
  Dialog,
  Menu,
  MenuItem,
  InputGroup,
} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';
import {observer} from 'mobx-react';
import {StoresContext} from '../../Context';

const AskSpec = ({onChange, ...props}) => {
  const inputRef = React.useRef(null);
  const [url, updateUrl] = React.useState('');

  React.useEffect(() => {
    // current property is refered to input element
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Dialog title="Import openapi" {...props}>
      <div className={Classes.DIALOG_BODY}>
        <p>Enter the Openapi spec url</p>
        <InputGroup
          placeholder="url"
          value={url}
          ref={inputRef}
          onChange={(e) => updateUrl(e.currentTarget.value)}
        />
        <Button
          onClick={() => onChange(url)}
          text="Import"
          icon={<Icon icon="import" iconSize={12} />}
        />
      </div>
    </Dialog>
  );
};

AskSpec.propTypes = {
  onChange: PropTypes.func,
};

const Header = observer(({repoUrl, version, ...props}) => {
  const uploadFileRef = React.useRef();
  const stores = React.useContext(StoresContext);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [askOpenapiUrl, setAskOpenapiUrl] = React.useState(false);
  // const [importInProgress, setImportProgress] = React.useState(false);

  // React.useEffect(() => {
  //   if (stores.importStore.importState == ImportState.complete) {
  //     setImportProgress(false);
  //   }
  // }, [stores.importStore.importState]);

  const clearLocalDoc = () => {
    stores.storageStore.clear();
    setAlertOpen(false);
  };

  const importPostmanCollection = () => {
    if (uploadFileRef) {
      uploadFileRef.current.click();
    }
  };

  const importOpenapiUrl = (url) => {
    stores.importStore.convert_openapi_url(url);
  };

  const handleImport = () => {
    const fileList = uploadFileRef.current.files;
    if (fileList.length) {
      stores.importStore.convert_postman_file(fileList[0]);
    }
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
                <MenuItem text="Import From">
                  <MenuItem
                    text="Postman Collection"
                    onClick={importPostmanCollection}
                  />
                  <MenuItem
                    text="Openapi URL"
                    onClick={() => setAskOpenapiUrl(true)}
                  />
                </MenuItem>
                <MenuItem text={`Version: ${version}`} />
              </Menu>
            }>
            <Button icon="menu" minimal small outlined />
          </Popover2>
        </div>
        <FileInput
          text="Choose file..."
          inputProps={{
            ref: uploadFileRef,
            onChange: handleImport,
          }}
          style={{
            display: 'None',
          }}
        />
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
      <AskSpec
        isOpen={askOpenapiUrl}
        onClose={() => setAskOpenapiUrl(false)}
        onChange={(url) => {
          setAskOpenapiUrl(false);
          importOpenapiUrl(url);
        }}
      />
    </>
  );
});

Header.propTypes = {
  repoUrl: PropTypes.string,
  version: PropTypes.any,
  children: PropTypes.any,
};

export default Header;
