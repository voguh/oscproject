import React from 'react'

import { event, invoke } from '@tauri-apps/api'

import { storageService } from './services/storageService'
import { GlobalStyle } from './styles/globalStyle'
import { SE_SOCKET_EVENT } from './utils/constants'

export const App: React.FC = () => {
  const [token, setToken] = React.useState('')
  const [initialized, setInitialized] = React.useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    try {
      await storageService.set<string>('jwt_token', token)
      await invoke('connect', { token })
    } catch (e) {
      console.log(e)
    }
  }

  async function onSESocketEvents(...args: Record<string, any>[]): Promise<void> {
    console.log(args)
  }

  async function init(): Promise<void> {
    try {
      await storageService.initialize()

      event.listen(SE_SOCKET_EVENT, onSESocketEvents)

      const token = await storageService.get<string>('jwt_token')
      if (token != null && token.trim() !== '') {
        setToken(token)
      }

      setInitialized(true)
    } catch (err) {
      console.log(err)
    }
  }

  React.useEffect(() => {
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.currentTarget.value)}
          placeholder="Enter a StreamElements JWT token..."
        />
        <button disabled={initialized === false || token == null || token.trim() === ''}>Connect</button>
      </form>

      <GlobalStyle />
    </>
  )
}
