import '@mantine/core/styles.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import { spinWheelModule } from './__modules__/SpinWheelModule'
import { App } from './App'
import { modulesExtensionService } from './services/modulesExtensionService'

const root = createRoot(document.querySelector('#root'))
root.render(<App />)

modulesExtensionService.addModule(spinWheelModule)
