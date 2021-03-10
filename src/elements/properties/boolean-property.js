import React, { PureComponent } from 'react';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';

const isTrue = e => e.target.value === 'true';

class BooleanProperty extends PureComponent {
  render() {
    const { data, onChange } = this.props;
    let value = _.isUndefined(data.default) ? '' : data.default ? 'true' : 'false';
    return (
      <div className="text-sm overflow-auto p-1">
        <div className="pb-6">
            <div className="uppercase font-semibold pb-3">{LocaleProvider('base_setting')}</div>
            <div className="flex pb-2">
            <Keywords.BoolDefault value={value} onChange={
                e => onChange(_.set(_.clone(data), 'default', isTrue(e)))} />
            </div>
        </div>
      </div>
    );
  }
};

export default BooleanProperty;