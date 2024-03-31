import styled from 'styled-components'

export const HistoryButton = styled.button`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 30px;
  border-radius: var(--mantine-radius-default);
  border: none;
  background: var(--mantine-color-blue-5);
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: var(--mantine-color-blue-6);
  }

  &:disabled {
    background: none;
    cursor: not-allowed;
  }
`
