import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    outline: none;
  }

  html, body, #root {
    background: #495057;
  }

  #root {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > button {
      height: 36px;
      font-weight: 800;
      background: #1c7ed6;
      color: #fff;
      border: none;
      border-radius: 4px;
    }
  }
`
