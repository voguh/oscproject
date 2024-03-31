import React from 'react'

import reactLogo from '~/assets/react.svg'

import { StyledDummyModuleRenderContainer } from './styled'

export const DummyModuleRender: React.FC<OSCModuleRenderProps> = ({ dimensions }) => {
  return (
    <StyledDummyModuleRenderContainer style={dimensions}>
      <div className="wrapper">
        <img src={reactLogo} />
      </div>
    </StyledDummyModuleRenderContainer>
  )
}
