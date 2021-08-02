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
  });

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
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            props.onChange(e.target.value);
          }}
          onBlur={() => props.onBlur && props.onBlur(inputValue)}
          onFocus={() => props.onFocus && props.onFocus(inputValue)}
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
