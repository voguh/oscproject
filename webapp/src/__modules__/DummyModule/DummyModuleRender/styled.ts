import styled from 'styled-components'

export const StyledDummyModuleRenderContainer = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  > div.wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;

    > img {
      animation: spin 2s linear infinite;
      width: 100px;
    }
  }
`
