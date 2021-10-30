//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {omit} from 'lodash';
import {
  Button,
  ControlGroup,
  InputGroup,
  Icon,
  TextArea,
} from '@blueprintjs/core';
import {Popover2, Tooltip2} from '@blueprintjs/popover2';
import {defaultSecuritySchemes} from '../../../model';
import {getLongestIndex, renameObjectKey} from '../../../utils';

const Heading = ({onAdd}) => {
  return (
    <div className="flex items-center mt-5 mb-2">
      <div className="font-semibold text-gray-6 dark:text-lighten-8">
        Security Schemes
      </div>
      <Button icon="plus" className="ml-1" small minimal onClick={onAdd} />
    </div>
  );
};

Heading.propTypes = {
  onAdd: PropTypes.func,
};

const ApiKey = ({scheme, name, onChange}) => {
  return (
    <>
      <InputGroup
        title="key"
        placeholder="key"
        value={name}
        onChange={(e) => {
          onChange(scheme, e.target.value);
        }}
        className="pr-0 StudioInput flex-1"
      />
      <InputGroup
        title="name"
        placeholder="name"
        value={scheme?.name}
        onChange={(e) => onChange({...scheme, name: e.target.value})}
        className="pr-0 StudioInput flex-1"
      />
      <div className="bp3-html-select">
        <select
          placeholder="in"
          value={scheme.in}
          onChange={(e) => onChange({...scheme, in: e.target.value})}>
          <option value="query">query</option>
          <option value="header">header</option>
          <option value="cookie">cookie</option>
        </select>
        <span className="bp3-icon bp3-icon-double-caret-vertical"></span>
      </div>
    </>
  );
};

ApiKey.propTypes = {
  scheme: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

const Http = ({scheme, name, onChange}) => {
  return (
    <>
      <InputGroup
        title="key"
        placeholder="key"
        value={name}
        className="pr-0 StudioInput flex-1"
        onChange={(e) => onChange(scheme, e.target.value)}
      />
      <div className="bp3-html-select">
        <select
          placeholder="scheme"
          value={scheme.scheme}
          onChange={(e) => onChange({...scheme, scheme: e.target.value})}>
          <option value="basic">basic</option>
          <option value="bearer">bearer</option>
          <option value="digest">digest</option>
        </select>
        <span className="bp3-icon bp3-icon-double-caret-vertical"></span>
      </div>
    </>
  );
};

Http.propTypes = {
  scheme: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

const OpenIdConnect = ({scheme, name, onChange}) => {
  return (
    <>
      <InputGroup
        title="key"
        placeholder="key"
        value={name}
        className="pr-0 StudioInput flex-1"
        onChange={(e) => onChange(scheme, e.target.value)}
      />
      <InputGroup
        title="key"
        placeholder="key"
        value={scheme.openIdConnectUrl}
        className="pr-0 StudioInput flex-1"
        onChange={(e) =>
          onChange({...scheme, openIdConnectUrl: e.target.value})
        }
      />
    </>
  );
};

OpenIdConnect.propTypes = {
  scheme: PropTypes.object,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

const DescriptionButton = ({description, onChange}) => {
  return (
    <Popover2
      inheritDarkTheme
      content={
        <TextArea
          className="outline-none border-0"
          aria-label={'description'}
          growVertically
          value={description || ''}
          onChange={onChange}
        />
      }
      placement="left">
      <Tooltip2 role={'description'} content={<span>Description</span>}>
        <Button icon={<Icon iconSize={12} icon="manual" />} />
      </Tooltip2>
    </Popover2>
  );
};

DescriptionButton.propTypes = {
  description: PropTypes.string,
  onChange: PropTypes.func,
};

const SecuritySchemes = ({schemes, onChange}) => {
  const handleChange = (name, scheme, newName = null) => {
    let updatedSchemes = Object.assign({}, schemes, {[name]: scheme});
    if (newName !== null) {
      const renamedObj = renameObjectKey(schemes, name, newName);
      updatedSchemes = Object.assign({}, renamedObj, {[newName]: scheme});
    }
    onChange(updatedSchemes);
  };

  const handleTypeChange = (scheme, type) => {
    const updatedSchemes = Object.assign({}, schemes, {
      [scheme]: defaultSecuritySchemes[type],
    });
    onChange(updatedSchemes);
  };

  const generateName = () => {
    const keys = Object.keys(schemes);
    const longestIndex = getLongestIndex(keys, /API Key - ([\d]+)/g);
    return `API Key - ${longestIndex + 1}`;
  };

  const onDelete = (scheme) => {
    const rest = omit(schemes, scheme);
    onChange(rest);
  };

  return (
    <div className="Security">
      <Heading onAdd={() => handleTypeChange(generateName(), 'apiKey')} />
      {schemes &&
        Object.keys(schemes).map((scheme, i) => {
          return (
            <ControlGroup className="items-center" key={i}>
              <div className="bp3-html-select">
                <select
                  placeholder="type"
                  value={schemes[scheme].type}
                  onChange={(e) => handleTypeChange(scheme, e.target.value)}>
                  <option value="apiKey">apiKey</option>
                  <option value="http">http</option>
                  <option value="oauth2">oauth2</option>
                  <option value="openIdConnect">openIdConnect</option>
                </select>
                <span className="bp3-icon bp3-icon-double-caret-vertical"></span>
              </div>
              {schemes[scheme].type == 'apiKey' && (
                <ApiKey
                  scheme={schemes[scheme]}
                  name={scheme}
                  onChange={(e, newName) => handleChange(scheme, e, newName)}
                />
              )}
              {schemes[scheme].type == 'http' && (
                <Http
                  scheme={schemes[scheme]}
                  name={scheme}
                  onChange={(e, newName) => handleChange(scheme, e, newName)}
                />
              )}
              {schemes[scheme].type == 'openIdConnect' && (
                <OpenIdConnect
                  scheme={schemes[scheme]}
                  name={scheme}
                  onChange={(e, newName) => handleChange(scheme, e, newName)}
                />
              )}
              <DescriptionButton
                description={schemes[scheme]?.description}
                onChange={(e) => {
                  handleChange(scheme, {
                    ...schemes[scheme],
                    description: e.target.value,
                  });
                }}
              />
              <Button
                icon={<Icon size={12} icon="trash" />}
                onClick={() => onDelete(scheme)}
              />
            </ControlGroup>
          );
        })}
    </div>
  );
};

SecuritySchemes.propTypes = {
  schemes: PropTypes.object,
  onChange: PropTypes.func,
};

export default SecuritySchemes;
