import styled from 'styled-components';

const Primary = styled.button`
  background-color: #9086d6;
  padding: 8px 24px;
  font-size: 26px;
  font-weight: 300;
  border-radius: 7px;
  color: white;
  border: none;
  cursor: pointer;
  font-family: Roboto;
  outline: none;
  transition: background-color 200ms;
  &:hover {
    background-color: #a187d7;
  }

  :disabled {
    cursor: not-allowed;
    pointer-events: none;

    color: #c0c0c0;
    background-color: #d3d3d3;
  }
`;

export const Button = {
  Primary,
};
