// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {set, clone, isUndefined} from 'lodash';
import * as Keywords from '../keywords';

const isTrue = (e) => e.target.value === 'true';

class BooleanProperty extends PureComponent {
  render() {
    const {data, isSubtype, onChange} = this.props;
    const heading = `${isSubtype ? 'subtype' : 'other'} properties`;
    let value = isUndefined(data.default)
      ? ''
      : data.default
      ? 'true'
      : 'false';
    return (
      <div className="text-sm overflow-auto p-1">
        <div className="pb-6">
          <div className="uppercase font-semibold pb-3">{heading}</div>
          <div className="flex pb-2">
            <Keywords.BoolDefault
              value={value}
              onChange={(e) => onChange(set(clone(data), 'default', isTrue(e)))}
            />
          </div>
        </div>
      </div>
    );
  }
}

BooleanProperty.propTypes = {
  // Required
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isSubtype: PropTypes.bool,
  child: PropTypes.string, // @TODO: React node
};

export default BooleanProperty;
