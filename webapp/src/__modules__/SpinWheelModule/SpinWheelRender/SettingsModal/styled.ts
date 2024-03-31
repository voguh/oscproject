import styled from 'styled-components'

export const SettingsContainer = styled.form`
  > .form-content {
    > .ScrollbarsCustom-Wrapper > .ScrollbarsCustom-Scroller > .ScrollbarsCustom-Content {
      display: flex;
      flex-direction: column;
      gap: var(--mantine-spacing-sm);
    }
  }

  > button {
    margin-top: var(--mantine-spacing-sm);
  }
`

export const StyledBox = styled.div`
  display: grid;
  gap: var(--mantine-spacing-sm);

  > .mantine-InputWrapper-root {
    width: 100%;
  }

  > .styled-box-content {
    display: flex;
    margin-top: calc(var(--mantine-spacing-sm) * -1);
    gap: var(--mantine-spacing-sm);

    > .mantine-InputWrapper-root {
      width: 100%;
    }
  }
`

export const EntryStyledBox = styled.div`
  display: flex;
  gap: var(--mantine-spacing-sm);

  > * {
    flex-shrink: 0;
  }

  > .mantine-InputWrapper-root {
    &:first-child {
      width: 75px;
    }

    &:not(:first-child) {
      flex: 1;
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
