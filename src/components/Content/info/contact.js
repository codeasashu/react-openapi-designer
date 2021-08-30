//@flow
import React from 'react';
import PropTypes from 'prop-types';
import {InputGroup} from '@blueprintjs/core';

const Contact = ({contact, onChange}) => {
  return (
    <>
      <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1">
        Contact
      </div>
      <div className="mt-4 flex items-center">
        <InputGroup
          className="flex-1 pr-0"
          title="Contact Name"
          placeholder="Contact Name"
          value={contact?.name}
          onChange={(e) => onChange({...contact, name: e.target.value})}
        />
        <InputGroup
          className="flex-1 ml-2 pr-0"
          title="Contact Url"
          placeholder="Contact Url"
          value={contact?.url}
          onChange={(e) => onChange({...contact, url: e.target.value})}
        />
        <InputGroup
          className="flex-1 ml-2 pr-0"
          title="Contact Email"
          placeholder="Contact Email"
          value={contact?.email}
          onChange={(e) => onChange({...contact, email: e.target.value})}
        />
      </div>
    </>
  );
};

Contact.propTypes = {
  contact: PropTypes.object,
  onChange: PropTypes.func,
};

export default Contact;
