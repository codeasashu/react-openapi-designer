// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {clone} from 'lodash';
import * as Keywords from '../keywords';

class NumberProperty extends PureComponent {
  changeOtherValue = (value, name) => {
    const {data, onChange} = this.props;
    let cloned = clone(data);
    if (!value || value === '') {
      delete cloned[name];
    } else cloned[name] = value;
    // this.context.changeCustomValue(data);
    onChange(cloned);
  };

  changeEnumOtherValue = (arr) => {
    const {data, onChange} = this.props;
    let cloned = clone(data);
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete cloned.enum;
      onChange(cloned);
    } else {
      cloned.enum = arr;
      onChange(cloned);
    }
  };

  render() {
    const {data, isSubtype} = this.props;
    const heading = `${isSubtype ? 'subtype' : 'other'} properties`;
    return (
      <div className="text-sm overflow-auto p-1">
        <div className="pb-6">
          <div className="uppercase font-semibold pb-3">{heading}</div>
          <div className="flex pb-2">
            <Keywords.Default
              value={data.default || ''}
              onChange={(e) => this.changeOtherValue(e, 'default')}
            />
            <Keywords.Format
              format={'number'}
              value={data.format}
              onChange={(e) => this.changeOtherValue(e.target.value, 'format')}
            />
          </div>
          <div className="flex pb-2">
            <Keywords.Enum
              value={data.enum}
              onChange={this.changeEnumOtherValue}
            />
          </div>
        </div>
        <div>
          <div className="uppercase font-semibold pb-3">
            {isSubtype ? 'subtype' : ''} Number properties
          </div>
          <Keywords.Minimum
            value={data.minimum || ''}
            exclusiveMinimum={data.exclusiveMinimum}
            onChange={(e) => this.changeOtherValue(e, 'minimum')}
            onToggle={(e) =>
              this.changeOtherValue(e.target.checked, 'exclusiveMinimum')
            }
          />
          <Keywords.Maximum
            value={data.maximum || ''}
            exclusiveMaximum={data.exclusiveMaximum}
            onChange={(e) => this.changeOtherValue(e, 'maximum')}
            onToggle={(e) =>
              this.changeOtherValue(e.target.checked, 'exclusiveMaximum')
            }
          />
          <Keywords.MultipleOf
            value={data.multipleOf}
            onChange={(e) => this.changeOtherValue(e, 'multipleOf')}
          />
        </div>
      </div>
    );
  }
}

NumberProperty.propTypes = {
  // Required
  onChange: PropTypes.func.isRequired,
  data: PropTypes.shape({
    minimum: PropTypes.any,
    maximum: PropTypes.any,
    exclusiveMinimum: PropTypes.any,
    exclusiveMaximum: PropTypes.any,
    enum: PropTypes.array,
    default: PropTypes.any,
    format: PropTypes.string,
    multipleOf: PropTypes.any,
  }),
  isSubtype: PropTypes.bool,
  child: PropTypes.element, // @TODO: React node
};

export default NumberProperty;
