import React, { PureComponent } from 'react';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';

class NumberProperty extends PureComponent {
  changeOtherValue = (value, name) => {
    const { data, onChangeValue } = this.props;
    let cloned = _.clone(data);
    cloned[name] = value;
    // this.context.changeCustomValue(data);
    onChangeValue(cloned);
  };

  changeEnumOtherValue = (arr) => {
    const { data, onChangeValue } = this.props;
    let cloned = _.clone(data);
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete cloned.enum;
      onChangeValue(cloned);
    } else {
      cloned.enum = arr;
      onChangeValue(cloned);
    }
  };

  render() {
    const { data } = this.props;
    return (
      <div className="text-sm overflow-auto p-1">
      <div className="pb-6">
        <div className="uppercase font-semibold pb-3">{LocaleProvider('base_setting')}</div>
        <div className="flex pb-2">
          <Keywords.Default value={data.default} onChange={
              e => this.changeOtherValue(e, 'default')} />
          <Keywords.Format value={data.format} onChange={
              e => this.changeOtherValue(e, 'format')} />
        </div>
        <div className="flex pb-2">
          <Keywords.Enum value={data.enum} onChange={this.changeEnumOtherValue} />
        </div>
      </div>
        <div>
          <div className="uppercase font-semibold pb-3">Number properties</div>
          <Keywords.Minimum
              value={data.minimum}
              exclusiveMinimum={data.exclusiveMinimum}
              onChange={e => this.changeOtherValue(e, 'minimum')}
              onToggle={e => this.changeOtherValue(e, 'exclusiveMinimum')} />
          <Keywords.Maximum
              value={data.maximum}
              exclusiveMinimum={data.exclusiveMaximum}
              onChange={e => this.changeOtherValue(e, 'maximum')}
              onToggle={e => this.changeOtherValue(e, 'exclusiveMaximum')} />
          <Keywords.MultipleOf value={data.maxLength} onChange={
              e => this.changeOtherValue(e, 'multipleOf')} />
        </div>
      </div>
    );
  }
};

export default NumberProperty;