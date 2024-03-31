import styled from 'styled-components'

import { SPIN_WHEEL_CONTAINER_WIDTH, WHEEL_RADIUS, WHEEL_SIZE } from '../../constants'

export const SpinWheelContainer = styled.div`
  position: relative;
  width: ${SPIN_WHEEL_CONTAINER_WIDTH}px;
  height: ${WHEEL_SIZE}px;

  > div.wheel-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${WHEEL_SIZE}px;
    height: ${WHEEL_SIZE}px;
  }

  > div.actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px;
  }

  > div.arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(-10px + ${WHEEL_RADIUS}px), -50%);

    > div {
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-right: 40px solid #5d764c;
    }
  }
`

export const SpinResultContainer = styled.div`
  > div.result-header {
    border-radius: var(--mantine-radius-default);
    padding: 4px;
  }

  > div.result-body {
    margin: 32px 0;
  }

  > div.result-footer {
    display: flex;
    justify-content: space-evenly;
    gap: 8px;
  }
`
