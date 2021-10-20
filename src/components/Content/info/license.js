//@flow
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {omit} from 'lodash';
import {InputGroup} from '@blueprintjs/core';

const isUrlKind = (license) =>
  license && Object.prototype.hasOwnProperty.call(license, 'url');

const isIdentifierKind = (license) =>
  license && Object.prototype.hasOwnProperty.call(license, 'identifier');

const License = ({license, onChange}) => {
  const [licenseKind, setLicenseKind] = useState(
    isUrlKind(license)
      ? 'url'
      : isIdentifierKind(license)
      ? 'identifier'
      : 'url',
  );

  return (
    <>
      <div className="font-semibold text-gray-6 dark:text-lighten-8 ml-1">
        License
      </div>
      <div className="mt-4 flex items-center">
        <InputGroup
          className="flex-1 mr-2"
          title="License (MIT, Apache 2.0, etc)"
          placeholder="License (MIT, Apache 2.0, etc)"
          value={license?.name || ''}
          onChange={(e) => onChange({...license, name: e.target.value})}
        />
        <div className="bp3-html-select">
          <select
            value={license?.url ? 'url' : 'identifier'}
            onChange={(e) => setLicenseKind(e.target.value)}>
            <option value="url" label="URL">
              URL
            </option>
            <option value="identifier" label="Identifier">
              Identifier
            </option>
          </select>
          <span className="bp3-icon bp3-icon-double-caret-vertical"></span>
        </div>
        {licenseKind === 'url' && (
          <InputGroup
            className="pr-0"
            value={license?.url || ''}
            onChange={(e) =>
              onChange({...omit(license, ['identifier']), url: e.target.value})
            }
            title="https://www.apache.org/licenses/LICENSE-2.0.html"
            placeholder="https://www.apache.org/licenses/LICENSE-2.0.html"
          />
        )}
        {licenseKind === 'identifier' && (
          <div className="bp3-html-select">
            <select
              value={license.identifier}
              onChange={(e) =>
                onChange({
                  ...omit(license, ['url']),
                  identifier: e.target.value,
                })
              }>
              <option value="" label="">
                Choose a license identifier
              </option>
              <option value="0BSD" label="0BSD">
                0BSD
              </option>
            </select>
            <span className="bp3-icon bp3-icon-double-caret-vertical"></span>
          </div>
        )}
      </div>
    </>
  );
};

License.propTypes = {
  license: PropTypes.object,
  onChange: PropTypes.func,
};

export default License;
