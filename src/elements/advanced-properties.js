import React, { PureComponent } from 'react';
import { clone } from 'lodash';
import PropTypes from 'prop-types';
import Properties from './properties';
// import AceEditor from '../AceEditor/AceEditor.js';

const onChildChange = (data, value, name, onChange) => {
    let cloned = clone(data);
    if(!value || value === '') {
      delete cloned[name];
    }
    else cloned[name] = value;
    // this.context.changeCustomValue(data);
    onChange(cloned);
}

const getArrayProperty = (data, onChange, requestedLevel=1, level=1) => {
  if(level === requestedLevel && data.hasOwnProperty('items') && data.items.hasOwnProperty('type')) {
    return <Properties.Array
      onChange={onChange}
      data={data}
      isSubtype={level > 1}
      child={mapping(data.items, e => onChildChange(data, e, 'items', onChange), requestedLevel, (level+1))} />
  } else {
    return <Properties.Array isSubtype={level > 1} onChange={onChange} data={data} />
  }
}

const mapping = (data, onChange, requestedLevel=1, level=1) => {
  return {
    string: <Properties.String isSubtype={level > 1} onChange={onChange} data={data} />,
    number: <Properties.Number isSubtype={level > 1} onChange={onChange} data={data} />,
    boolean: <Properties.Boolean isSubtype={level > 1} onChange={onChange} data={data} />,
    integer: <Properties.Number isSubtype={level > 1} onChange={onChange} data={data} />,
    array: getArrayProperty(data, onChange, requestedLevel, level),
  }[data.type];
};

const AdvancedProperties = (props, context) => {
  const { data, onChange } = props;
  const optionForm = mapping(JSON.parse(data), onChange);

  return (
    <div>
      <div className="text-sm overflow-auto p-1">{optionForm}</div>
      {/* <AceEditor
        data={data}
        mode="json"
        onChange={e => handleInputEditor(e, context.changeCustomValue)}
      /> */}
    </div>
  );
};

export default AdvancedProperties;
