import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html, body, #root, #root > .osc-container {
    width: 100%;
    height: 100%;
  }

  #root > .osc-container {
    padding: var(--mantine-spacing-sm);

    > .mantine-Paper-root {
      padding: var(--mantine-spacing-sm);
      box-shadow: var(--mantine-shadow-sm);

      &:not(:first-child) {
        margin-top: var(--mantine-spacing-sm);
      }
    }

    > .se-connection-status {
      display: flex;
      justify-content: center;
      gap: var(--mantine-spacing-sm);

      > .mantine-InputWrapper-root {
        flex: 1;
      }

      > * {
        align-self: flex-end;
      }
    }

    > .osc-modules {
      justify-content: center;
      gap: var(--mantine-spacing-sm);
    }

    > .osc-module-display {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--mantine-spacing-sm);

      > .osc-module-header {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: var(--mantine-spacing-sm);
        
        > .osc-module-title {
          flex: 1;
        }

        > button {
          width: 25px;
          height: 25px;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      > .osc-module-body {
        position: relative;
      }
    }
  }
`
