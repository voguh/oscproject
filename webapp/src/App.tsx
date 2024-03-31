import React from 'react'
import { FaTimes } from 'react-icons/fa'

import { Button, LoadingOverlay, MantineProvider, Paper, PasswordInput, Tooltip } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { event, invoke } from '@tauri-apps/api'
import { Event } from '@tauri-apps/api/event'

import { ModuleWrapper } from './components/ModuleWrapper'
import { useDimensions } from './hooks/useDimensions'
import { modulesExtensionService } from './services/modulesExtensionService'
import { storageService } from './services/storageService'
import { GlobalStyle } from './styles/globalStyle'
import { SE_SOCKET_EVENT } from './utils/constants'
import { theme } from './utils/theme'

type SocketStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export const App: React.FC = () => {
  const [token, setToken] = React.useState('')
  const [selectedModule, setSelectedModule] = React.useState<OSCModule>()
  const [initialized, setInitialized] = React.useState(false)
  const [connectStatus, setConnectStatus] = React.useState<SocketStatus>('disconnected')

  const dimensions = useDimensions()

  function onTokenEdit(e: React.ChangeEvent<HTMLInputElement>): void {
    e.persist()
    setToken(e.target.value)
  }

  async function handleConnectDisconnect(): Promise<void> {
    if (connectStatus === 'disconnected') {
      await storageService.set<string>('jwt_token', token)
      setConnectStatus('connecting')
      await invoke('connect', { token })
    } else if (connectStatus === 'connected') {
      await invoke('disconnect')
    }
  }

  async function handleEventMessage(event: SESocketEventMessage): Promise<void> {
    console.log(event)
    for (const module of modulesExtensionService.listModules()) {
      if (module.onEvent) {
        module.onEvent(event.data)
      }
    }
  }

  async function onSESocketEvents(eventMessage: Event<SESocketEvent>): Promise<void> {
    const event = eventMessage.payload

    switch (event.type) {
      case 'socket_authorized':
        setConnectStatus('connected')
        break
      case 'socket_disconnected':
        setConnectStatus('disconnected')
        break
      case 'socket_unauthorized':
        setConnectStatus('error')
        break
      case 'event_message':
        await handleEventMessage(event)
        break
    }
  }

  async function init(): Promise<void> {
    try {
      await storageService.initialize()

      event.listen(SE_SOCKET_EVENT, onSESocketEvents)

      const token = await storageService.get<string>('jwt_token')
      if (token != null && token.trim() !== '') {
        setToken(token)
        await invoke('connect', { token })
        setConnectStatus('connecting')
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
    <MantineProvider theme={theme} withCssVariables forceColorScheme="dark">
      <ModalsProvider modalProps={{ centered: true }}>
        <LoadingOverlay visible={!initialized || connectStatus === 'connecting'} />

        <div className="osc-container">
          <Paper withBorder className="se-connection-status">
            <PasswordInput label="StreamElements JWT Token" value={token} onChange={onTokenEdit} />
            <Button loading={connectStatus === 'connecting'} onClick={handleConnectDisconnect}>
              {connectStatus === 'disconnected' ? 'Connect' : 'Disconnect'}
            </Button>
          </Paper>

          <Paper withBorder className="osc-modules" display={selectedModule == null ? 'flex' : 'none'}>
            {modulesExtensionService
              .listModules()
              .filter((mod) => mod.render)
              .map((mod) => {
                if (mod.description) {
                  return (
                    <Tooltip key={mod.id} label={mod.description}>
                      <Button onClick={() => setSelectedModule(mod)}>{mod.displayName}</Button>
                    </Tooltip>
                  )
                }

                return (
                  <Button key={mod.id} onClick={() => setSelectedModule(mod)}>
                    {mod.displayName}
                  </Button>
                )
              })}
          </Paper>

          <Paper
            withBorder
            className="osc-module-display"
            style={{ height: dimensions.height - (87 + 12 * 3) }}
            display={selectedModule != null ? 'flex' : 'none'}
          >
            <div className="osc-module-header">
              <div className="osc-module-title">{selectedModule?.displayName}</div>
              <Button variant="light" onClick={() => setSelectedModule(null)}>
                <FaTimes />
              </Button>
            </div>
            <div className="osc-module-body">
              <ModuleWrapper
                dimensions={{
                  width: dimensions.width - (12 * 4 + 2),
                  height: dimensions.height - (87 + 25 + 12 * 6 + 2)
                }}
                module={selectedModule}
              />
            </div>
          </Paper>
        </div>
        <GlobalStyle />
        <Notifications position="bottom-right" autoClose={5000} />
      </ModalsProvider>
    </MantineProvider>
  )
}
