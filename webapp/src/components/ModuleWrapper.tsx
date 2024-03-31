import React from 'react'

interface Props {
  dimensions: Dimensions
  module: OSCModule
}

export const ModuleWrapper: React.FC<Props> = ({ dimensions, module }) => {
  if (module != null && module.render != null) {
    const render = <module.render dimensions={dimensions} />
    if (React.isValidElement(render)) {
      return render
    }
  }

  return <></>
}
