import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';
import {has, trim} from 'lodash';
import {InputGroup} from '@blueprintjs/core';
import {getValueFromStore, usePatchOperationAt} from '../../utils/selectors';
import {nodeOperations} from '../../datasets/tree';

const StoreInput = observer(
  ({
    errors,
    autoFocus,
    inputType,
    style,
    className,
    title,
    placeholder,
    relativeJsonPath,
    min,
    id,
    onChange,
    handleUpdate,
    readOnly,
    valueInPath,
    cleanuupEmpty,
    jsonOp = nodeOperations.Replace,
    ...props
  }) => {
    const value = getValueFromStore(relativeJsonPath, valueInPath || false);
    const handlePatch = usePatchOperationAt(relativeJsonPath);
    const [draft, setDraft] = React.useState(value === undefined ? '' : value);
    const [original, setOriginal] = React.useState(draft);
    const handleChange = React.useCallback(
      (e) => {
        if (has(e, 'target.value')) {
          setDraft(e.target.value);
        } else {
          setDraft(e);
        }

        if (onChange) {
          onChange(e);
        }
      },
      [setDraft],
    );

    React.useEffect(() => {
      setDraft(value === undefined ? '' : value);
    }, [value]);

    return (
      <InputGroup
        errors={errors}
        autoFocus={autoFocus}
        type={inputType}
        style={style}
        title={title}
        placeholder={placeholder}
        min={min}
        id={id}
        value={draft}
        className={classnames(className, 'StudioInput')}
        readOnly={readOnly}
        onChange={handleChange}
        onBlur={() => {
          if (readOnly) {
            return;
          }
          if (handleUpdate) {
            handleUpdate(relativeJsonPath, draft, original);
            setOriginal(draft);
            return;
          }
          let _draft = draft;
          if (trim(_draft) === '' && cleanuupEmpty) {
            handlePatch();
          } else {
            handlePatch(jsonOp, _draft);
          }
          setOriginal(draft);
        }}
        {...props}
      />
    );
  },
);

StoreInput.propTypes = {
  errors: PropTypes.array,
  autoFocus: PropTypes.bool,
  inputType: PropTypes.string,
  style: PropTypes.any,
  className: PropTypes.any,
  jsonOp: PropTypes.string,
  cleanuupEmpty: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleUpdate: PropTypes.func,
  id: PropTypes.any,
  onChange: PropTypes.func,
  min: PropTypes.number,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  relativeJsonPath: PropTypes.array,
  valueInPath: PropTypes.bool,
};
export default StoreInput;
