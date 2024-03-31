import React from 'react'

import { LoadingOverlay } from '@mantine/core'

import { getSpinTries, getSpinWheelConfig, setSpinWheelConfig, updateTries } from '../constants'
import { HistoryModal } from './HistoryModal'
import { SettingsModal } from './SettingsModal'
import { SpinWheel } from './SpinWheel'
import { SpinWheelRenderContainer } from './styled'

interface SpinWheelContext {
  config: SpinWheelConfig
  setConfig(config: SpinWheelConfig): void

  tries: number
  setTries: (triesToAdd: number) => void
}

export const SpinWheelContext = React.createContext({} as SpinWheelContext)

export const SpinWheelRender: React.FC<OSCModuleRenderProps> = ({ dimensions }) => {
  const [loading, setLoading] = React.useState(false)

  const [results, setResults] = React.useState<string[]>([])
  const [config, setConfigLocal] = React.useState<SpinWheelConfig>()
  const [tries, setTries] = React.useState(0)

  async function initialGetConfig(): Promise<void> {
    try {
      setLoading(true)

      const _config = await getSpinWheelConfig()
      setConfigLocal(_config)

      const tries = await getSpinTries()
      setTries(tries)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  function setConfig(_config: SpinWheelConfig): void {
    setConfigLocal(_config)
    setSpinWheelConfig(_config)
  }

  React.useEffect(() => {
    initialGetConfig()
    updateTries.drain(async () => {
      const tries = await getSpinTries()
      setTries(tries)
    })

    return () => {
      setResults([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SpinWheelContext.Provider value={{ config, setConfig, tries, setTries: (tries) => updateTries.push(tries) }}>
      <SpinWheelRenderContainer style={dimensions}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 1 }} />

        <SpinWheel setResults={setResults} />
        <HistoryModal results={results} />

        <SettingsModal />
      </SpinWheelRenderContainer>
    </SpinWheelContext.Provider>
  )
}
