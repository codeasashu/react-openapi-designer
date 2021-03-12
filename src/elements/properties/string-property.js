import React, { PureComponent } from 'react';
import { clone } from 'lodash';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';

class StringProperty extends PureComponent {
  changeOtherValue = (value, name) => {
    const { data, onChange } = this.props;
    let cloned = clone(data);
    if(!value || value === '') {
      delete cloned[name];
    }
    else cloned[name] = value;
    // this.context.changeCustomValue(data);
    onChange(cloned);
  };

  changeEnumOtherValue = (arr) => {
    const { data, onChange } = this.props;
    let cloned = clone(data);
    if (arr.length === 0 || (arr.length == 1 && !arr[0])) {
      delete cloned.enum;
    } else {
      cloned.enum = arr;
    }
    onChange(cloned);
  };

  render() {
    const { data, isSubtype } = this.props;
    const heading = `${isSubtype ? 'subtype' : 'other'} properties`;
    isSubtype
    return (
      <div className="text-sm overflow-auto p-1">
      <div className="pb-6">
        <div className="uppercase font-semibold pb-3 text-black dark:text-white">{heading}</div>
        <div className="flex pb-2">
          <Keywords.Default value={data.default} onChange={
              e => this.changeOtherValue(e, 'default')} />
          <Keywords.Format value={data.format} onChange={
              e => this.changeOtherValue(e.target.value, 'format')} />
        </div>
        <div className="flex pb-2">
          <Keywords.Enum value={data.enum} onChange={this.changeEnumOtherValue} />
        </div>
      </div>
      <div>
        <div className="uppercase font-semibold pb-3 text-black dark:text-white">{isSubtype ? 'subtype': ''} string properties</div>
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