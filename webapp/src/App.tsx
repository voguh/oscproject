import React from 'react'

import { invoke } from '@tauri-apps/api'

import { GlobalStyle } from './styles/globalStyle'

export const App: React.FC = () => {
  const [greetMsg, setGreetMsg] = React.useState('')
  const [name, setName] = React.useState('')

  async function greet(): Promise<void> {
    const greetingMessage = await invoke<string>('greet', { name })
    setGreetMsg(greetingMessage)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    greet()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input id="greet-input" onChange={(e) => setName(e.currentTarget.value)} placeholder="Enter a name..." />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>

      <GlobalStyle />
    </>
  )
}
