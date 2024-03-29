import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const maxWidth = '250px';

const InlineDiv = styled.div`
  display: inline-block;
`;

const calculateWidth = (ref) => {
  return ref.current.getBoundingClientRect().width - 10;
};

const SchemaTitle = (props) => {
  const hiddenDiv = useRef();
  const inputRef = useRef();

  const [width, setWidth] = useState(5);
  const [inputValue, setInputValue] = useState(props.value || '');

  useEffect(() => {
    setWidth(calculateWidth(hiddenDiv));
  }, [inputValue]);

  return (
    <span style={{maxWidth}}>
      <InlineDiv>
        <input
          ref={inputRef}
          className="bg-transparent hover:bg-darken-1 focus:bg-darken-2"
          style={{
            width,
            fontSize: '11px',
            fontWeight: 400,
          }}
          value={props.value}
          onChange={(e) => {
            setInputValue(e.target.value);
            props.onChange && props.onChange(e.target.value);
          }}
          onBlur={(e) => {
            setInputValue(e.target.value);
            props.onBlur && props.onBlur(e.target.value);
          }}
          onFocus={(e) => {
            setInputValue(e.target.value);
            props.onFocus && props.onFocus(e.target.value);
          }}
        />
      </InlineDiv>
      <div ref={hiddenDiv} className="very-hidden-input">
        {inputValue}
      </div>
    </span>
  );
};

SchemaTitle.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default SchemaTitle;
