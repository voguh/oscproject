import styled from 'styled-components'

export const SettingsContainer = styled.div``

export const StyledBox = styled.div`
  display: grid;
  gap: 8px;

  > .mantine-InputWrapper-root {
    width: 100%;
  }
`

export const EntryStyledBox = styled.div`
  display: flex;
  gap: 8px;

  > * {
    flex-shrink: 0;
  }

  > .mantine-InputWrapper-root {
    width: calc(100% - (75px + 16px + 36px));

    &:first-child {
      width: 75px;
    }
  }

  > button:not(:first-child) {
    width: 36px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export const SettingsButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: var(--mantine-radius-default);
  border: none;
  background: var(--mantine-color-gray-8);
  margin-left: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: var(--mantine-color-gray-7);
  }
`
