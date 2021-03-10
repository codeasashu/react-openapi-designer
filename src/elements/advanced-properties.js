import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Properties from './properties';
// import AceEditor from '../AceEditor/AceEditor.js';

const changeOtherValue = (value, name, data, change) => {
  data[name] = value;
  change(data);
};

const mapping = (data, onChange) => {
  return {
    string: <Properties.String onChange={onChange} data={data} />,
    number: <Properties.Number onChange={onChange} data={data} />,
    boolean: <Properties.Boolean onChange={onChange} data={data} />,
    integer: <Properties.Number onChange={onChange} data={data} />,
    array: <Properties.Array onChange={onChange} data={data} />
  }[data.type];
};

const CustomItem = (props, context) => {
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

export default CustomItem;
