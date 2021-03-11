import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Properties from './properties';
// import AceEditor from '../AceEditor/AceEditor.js';

const changeOtherValue = (value, name, data, change) => {
  data[name] = value;
  change(data);
};

const getArrayProperty = (data, onChange, requestedLevel=1, level=1) => {
  if(level === requestedLevel && data.hasOwnProperty('items') && data.items.hasOwnProperty('type')) {
    return <Properties.Array
      onChange={onChange}
      data={data}
      isSubtype={level > 1}
      child={mapping(data.items, onChange, requestedLevel, (level+1))} />
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
