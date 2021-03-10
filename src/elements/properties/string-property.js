import React, { PureComponent } from 'react';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';

class StringProperty extends PureComponent {
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
        <div className="uppercase font-semibold pb-3">string properties</div>
        <div className="flex pb-2">
          <Keywords.Pattern value={data.pattern} onChange={
              e => this.changeOtherValue(e, 'pattern')} />
        </div>
        <div className="flex pb-2">
          <Keywords.MinLength value={data.minLength} onChange={
              e => this.changeOtherValue(e, 'minLength')} />
          <Keywords.MaxLength value={data.maxLength} onChange={
              e => this.changeOtherValue(e, 'maxLength')} />
        </div>
      </div>
      </div>
    );
  }
};

export default StringProperty;