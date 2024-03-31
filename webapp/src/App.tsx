import React from 'react'

import { event, invoke } from '@tauri-apps/api'

import { GlobalStyle } from './styles/globalStyle'
import { SE_SOCKET_EVENT } from './utils/constants'

export const App: React.FC = () => {
  async function onSubmit(): Promise<void> {
    try {
      await invoke('connect')
    } catch (e) {
      console.log(e)
    }
  }

  async function onSESocketEvents(...args: Record<string, any>[]): Promise<void> {
    console.log(args)
  }

  React.useEffect(() => {
    event.listen(SE_SOCKET_EVENT, onSESocketEvents)
  }, [])

  return (
    <>
      <button onClick={onSubmit}>Connect</button>

      <GlobalStyle />
    </>
  )
}
