import React, { PureComponent } from 'react';
import { clone } from 'lodash';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';
import Properties from './index';

class ArrayProperty extends PureComponent {
    changeOtherValue = (name, value) => {
        const { data, onChange } = this.props;
        let cloned = clone(data);
        cloned[name] = value;
        onChange(cloned);
    };

    render() {
      const { data, child, isSubtype } = this.props;
      const heading = `${isSubtype ? 'subtype' : ''} ${data.type} properties`;
      return (
        <div className="text-sm overflow-auto p-1">
            <div className="pb-6">
                <div className="uppercase font-semibold pb-3">{heading}</div>
                <div className="flex pb-2">
                    <Keywords.UniqueItems value={data.uniqueItems} onToggle={
                        e => this.changeOtherValue('uniqueItems', e.target.checked)} />
                </div>
                <div className="flex pb-2">
                    <Keywords.MinItems value={data.minItems} onChange={
                        e => this.changeOtherValue('minItems', e)} />
                    <Keywords.MaxItems value={data.maxItems} onChange={
                        e => this.changeOtherValue('maxItems', e)} />
                </div>
            </div>
            {child}
        </div>
      );
    }
};

export default ArrayProperty;