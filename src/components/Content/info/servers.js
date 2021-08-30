//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlGroup, InputGroup, Icon} from '@blueprintjs/core';

const Heading = ({onAdd}) => {
  return (
    <div className="flex items-center mt-5 mb-2">
      <div className="font-semibold text-gray-6 dark:text-lighten-8">
        Servers
      </div>
      <Button icon="plus" className="ml-1" small minimal onClick={onAdd} />
    </div>
  );
};

const Server = ({url, description, onChange}) => {
  return (
    <ControlGroup>
      <InputGroup
        placeholder="http://example.tld"
        value={url}
        onChange={(e) => onChange({url: e.target.value})}
      />
      <InputGroup placeholder="http://example.tld" value={description} />
    </ControlGroup>
  );
};

Server.propTypes = {
  url: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
};

Heading.propTypes = {
  onAdd: PropTypes.func,
};

const Servers = ({servers, onChange}) => {
  const handleChange = (index, change) => {
    const newServers = servers.slice(0);
    newServers.splice(index, 1, {...servers[index], ...change});
    onChange(newServers);
  };

  const deleteServer = (index) => {
    const newServers = servers.slice(0);
    newServers.splice(index, 1);
    onChange(newServers);
  };

  return (
    <div className="servers">
      <Heading
        onAdd={() => onChange([...servers, {url: '', description: ''}])}
      />
      {servers.map((server, i) => (
        <ControlGroup key={i}>
          <InputGroup
            placeholder="http://example.tld"
            value={server?.url || ''}
            onChange={(e) => handleChange(i, {url: e.target.value})}
          />
          <InputGroup
            placeholder="http://example.tld"
            value={server?.description || ''}
            onChange={(e) => handleChange(i, {description: e.target.value})}
          />
          <Button
            icon={<Icon size={12} icon="trash" />}
            onClick={() => deleteServer(i)}
          />
        </ControlGroup>
      ))}
    </div>
  );
};

Servers.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};

export default Servers;
