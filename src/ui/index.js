import styled from 'styled-components';
import { Tooltip } from 'insomnia-components';
import DebouncedInput from '../elements/debounced-input';

export const StyledActions = styled.span`
    display: inline-flex;
    justify-content: center;

    &:hover {
        background-color: rgba(0,0,0,0.1);
    }

    ${({ width = 20 }) => `width: ${width}px;`}
    ${({ font = 0.8 }) => `font-size: ${font}rem;`}
    ${({ height }) => height && `height: ${height};`}
`;

export const StyledFormInput = styled.div`
  outline: none;
  border: 0;
  margin-bottom: var(--padding-sm);
  width: 100%;
  box-sizing: border-box;

  input {
    border-radius: 0;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    background: none;
    padding-left: var(--padding-xxs);
    padding-right: var(--padding-xxs);
    border: 1px solid var(--hl-md);
    padding: var(--padding-sm);
    width: 100%;
    display: block;
    margin-top: var(--padding-xs);
    box-sizing: border-box;
    transition: all 130ms ease-out;
    outline: 0;
    margin: 0;
    color: inherit;
    text-align: left;
  }
`;

// export const InlineActions = styled.span`
//     display: inline-grid;
//     height: 100%;
//     vertical-align: middle;
//     margin: 0 auto;
//     width: 20px;
// `;

export const StyledAction = styled.span`
  display: inline-block;
`;

export const StyledNavigate = styled(StyledActions)`
  ${({ show }) => !show && `transform: rotate(-90deg);`}
`;

export const FlexRow = styled.div`
  width: 100%;
  display: flex;

  input {
    padding: 1px 13px;
  }
`;

export const FlexItem = styled.div`
  display: flex;
  flex: 1 1 0%;

  ${({ center }) => center && `align-items: center;`}
`;

export const FieldInput = styled(DebouncedInput)`
  background-color: rgba(0, 0, 0, 0);
  &:focus {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

export const StyledTooltip = styled(Tooltip)`
  display: inline-flex !important;
`;
