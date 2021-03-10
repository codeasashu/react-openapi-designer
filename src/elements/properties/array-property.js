import React, { PureComponent } from 'react';
import LocaleProvider from '../../locale';
import * as Keywords from '../keywords';

const ArrayProperty = ({ data, onChange }) => {
  return (
      <div className="text-sm overflow-auto p-1">
        <div className="pb-6">
            <div className="uppercase font-semibold pb-3">{LocaleProvider('base_setting')}</div>
            <div className="flex pb-2">
                <Keywords.UniqueItems value={data.uniqueItems} onToggle={
                    e => onChange(_.set(_.clone(data), 'uniqueItems', e))} />
            </div>
            <div className="flex pb-2">
                <Keywords.MinItems value={data.minItems} onChange={
                    e => onChange(_.set(_.clone(data), 'minItems', e))} />
                <Keywords.MaxItems value={data.maxItems} onChange={
                    e => onChange(_.set(_.clone(data), 'maxItems', e))} />
            </div>
        </div>
      </div>
  );
};

export default ArrayProperty;