// @flow
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {clone} from 'lodash';
import * as Keywords from '../keywords';

class ObjectProperty extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {behaviour: ''};
  }

  changeValues = (data, value, name) => {
    if (!value || value === '') {
      delete data[name];
    } else data[name] = value;
    return data;
  };

  changeOtherValue = (value, name) => {
    const {data, onChange} = this.props;
    let cloned = clone(data);
    const modified = this.changeValues(cloned, value, name);
    onChange(modified);
  };

  changeAdditionalProperty = (value) => {
    const name = 'additionalProperties';
    const {data, onChange} = this.props;
    let cloned = clone(data);
    if (!value || value === '') {
      delete cloned[name];
    } else cloned[name] = !value;
    // this.context.changeCustomValue(data);
    onChange(cloned);
  };

  componentDidMount() {
    const {data} = this.props;
    const behaviour = this.determineBehaviour(data);
    this.setState({behaviour});
  }

  determineBehaviour(data) {
    let behaviour = '';
    if (data.readOnly === true) {
      behaviour = 'readOnly';
    } else if (data.writeOnly === true) {
      behaviour = 'writeOnly';
    }
    return behaviour;
  }

  componentDidUpdate(prevProps) {
    const {data} = this.props;
    //@TODO objects should be compared deeply
    if (prevProps.data !== data) {
      const behaviour = this.determineBehaviour(data);
      this.setState({behaviour});
    }
  }

  changeBehaviour(e) {
    const {data, onChange} = this.props;
    let cloned = clone(data);
    const behaviour = e.target.value;
    let modifiedData = cloned;
    console.log('readonly', behaviour);
    if (behaviour.toLowerCase() === 'readonly') {
      modifiedData = this.changeValues(modifiedData, true, 'readOnly');
      modifiedData = this.changeValues(modifiedData, null, 'writeOnly');
    } else if (behaviour.toLowerCase() === 'writeonly') {
      modifiedData = this.changeValues(modifiedData, null, 'readOnly');
      modifiedData = this.changeValues(modifiedData, true, 'writeOnly');
    } else {
      modifiedData = this.changeValues(modifiedData, null, 'readOnly');
      modifiedData = this.changeValues(modifiedData, null, 'writeOnly');
    }
    console.log('readonly.2', modifiedData);
    onChange(modifiedData);
  }

  render() {
    const {data, isSubtype} = this.props;
    const {behaviour} = this.state;
    const heading = `${isSubtype ? 'subtype' : 'object'} properties`;
    isSubtype;
    return (
      <div className="text-sm overflow-auto p-1">
        <div className="pb-6">
          <div className="uppercase font-semibold pb-3">{heading}</div>
          <div className="flex pb-2">
            <Keywords.DisallowAdditionalProperties
              value={data.additionalProperties}
              onToggle={(e) => this.changeAdditionalProperty(e.target.checked)}
            />
            {/* <Keywords.Format value={data.format} onChange={
              e => this.changeOtherValue(e.target.value, 'format')} /> */}
          </div>
          <div className="flex pb-2">
            <Keywords.ObjectBehaviour
              value={behaviour}
              onChange={(e) => this.changeBehaviour(e)}
            />
          </div>
          <div className="flex pb-2">
            <Keywords.MinProperty
              value={data.minProperties}
              onChange={(e) => this.changeOtherValue(e, 'minProperties')}
            />
            <Keywords.MaxProperty
              value={data.maxProperties}
              onChange={(e) => this.changeOtherValue(e, 'maxProperties')}
            />
          </div>
        </div>
      </div>
    );
  }
}

ObjectProperty.propTypes = {
  // Required
  onChange: PropTypes.func.isRequired,
  data: PropTypes.string.isRequired,
  isSubtype: PropTypes.string,
  child: PropTypes.string, // @TODO: React node
};

export default ObjectProperty;
