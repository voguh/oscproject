import React from 'react'
import { FaCog, FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import { Scrollbar } from 'react-scrollbars-custom'

import { Button, Input, Modal, Switch, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { useDimensions } from '~/hooks/useDimensions'

import { updateTries } from '../../constants'
import { SpinWheelContext } from '../SpinWheelRender'
import { EntryStyledBox, SettingsButton, SettingsContainer, StyledBox } from './styled'

export const SettingsModal: React.FC = () => {
  const [settingsModal, setSettingsModal] = React.useState(false)

  const { getInputProps, insertListItem, onSubmit, removeListItem, setFieldValue, setValues, values } =
    useForm<SpinWheelConfig>()
  const { config, setConfig } = React.useContext(SpinWheelContext)
  const dimensions = useDimensions()

  function handleRemove(idx: number): void {
    removeListItem('entries', idx)
  }

  function handleAdd(): void {
    insertListItem('entries', [1, 'New item'])
  }

  function managePoints(val: number) {
    return () => updateTries.push(val)
  }

  function handleSave(_data: SpinWheelConfig): void {
    setConfig({
      spinDuration: Number(_data.spinDuration),
      spinSpeed: Number(_data.spinSpeed),
      allowMock: _data.allowMock,
      thresholds: {
        bits: Number(_data.thresholds.bits),
        tip: Number(_data.thresholds.tip),
        sub: {
          prime: Number(_data.thresholds.sub.prime),
          '1000': Number(_data.thresholds.sub['1000']),
          '2000': Number(_data.thresholds.sub['2000']),
          '3000': Number(_data.thresholds.sub['3000'])
        }
      },
      entries: _data.entries.map((entry) => [Number(entry[0]), entry[1]])
    })

    setSettingsModal(false)
  }

  React.useEffect(() => {
    if (config) {
      setValues(config)
    }
  }, [config]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SettingsButton onClick={() => setSettingsModal(true)}>
        <FaCog />
      </SettingsButton>
      <Modal opened={settingsModal} onClose={() => setSettingsModal(false)} size="lg" title="Settings" centered>
        <SettingsContainer onSubmit={onSubmit(handleSave)} style={{ height: dimensions.height - (120 + 32) }}>
          <Scrollbar className="form-content" style={{ height: 'calc(100% - (36px + var(--mantine-spacing-sm)))' }}>
            <StyledBox>
              <Text fw="800">Points</Text>
              <div className="styled-box-content">
                <Button fullWidth onClick={managePoints(-100)}>
                  -100
                </Button>
                <Button fullWidth onClick={managePoints(-50)}>
                  -50
                </Button>
                <Button fullWidth onClick={managePoints(-10)}>
                  -10
                </Button>
                <Button fullWidth onClick={managePoints(100)}>
                  +10
                </Button>
                <Button fullWidth onClick={managePoints(50)}>
                  +50
                </Button>
                <Button fullWidth onClick={managePoints(10)}>
                  +100
                </Button>
              </div>
            </StyledBox>

            <StyledBox
              style={{ marginTop: 'var(--mantine-spacing-sm)', marginBottom: 'calc(var(--mantine-spacing-sm) * -1)' }}
            >
              <Text fw="800">Settings</Text>
            </StyledBox>

            <StyledBox style={{ gridTemplateColumns: '100px 1fr 1fr' }}>
              <Input.Wrapper label="Allow mock">
                <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
                  <Switch
                    size="md"
                    checked={values.allowMock}
                    onChange={(event) => setFieldValue('allowMock', event.currentTarget.checked)}
                  />
                </div>
              </Input.Wrapper>
              <TextInput type="number" label="Spin duration (seconds)" {...getInputProps('spinDuration')} />
              <TextInput type="number" label="Spin speed" {...getInputProps('spinSpeed')} />
            </StyledBox>

            <StyledBox>
              <Text fw="800">Thresholds</Text>
              <div className="styled-box-content">
                <TextInput type="number" label="Bits" {...getInputProps('thresholds.bits')} />
                <TextInput type="number" label="Tip" {...getInputProps('thresholds.tip')} />
              </div>
            </StyledBox>

            <StyledBox>
              <Text fw="800">Sub points per tier</Text>
              <div className="styled-box-content">
                <TextInput type="number" label="Sub Prime" {...getInputProps('thresholds.sub.prime')} />
                <TextInput type="number" label="Sub T1" {...getInputProps('thresholds.sub.1000')} />
                <TextInput type="number" label="Sub T2" {...getInputProps('thresholds.sub.2000')} />
                <TextInput type="number" label="Sub T3" {...getInputProps('thresholds.sub.3000')} />
              </div>
            </StyledBox>

            <StyledBox>
              <Text fw="800">Entries</Text>

              <div
                className="items"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 'calc(var(--mantine-spacing-sm) * -1)',
                  gap: 'var(--mantine-spacing-sm)'
                }}
              >
                {values?.entries?.map((value, idx) => (
                  <EntryStyledBox key={idx}>
                    <TextInput type="number" {...getInputProps(`entries.${idx}.0`)} />
                    <TextInput type="text" {...getInputProps(`entries.${idx}.1`)} />
                    <Button variant="light" color="red" onClick={() => handleRemove(idx)}>
                      <FaTrash />
                    </Button>
                  </EntryStyledBox>
                ))}
              </div>

              <Button variant="light" color="green" fullWidth onClick={handleAdd} leftSection={<FaPlus />}>
                Add item
              </Button>
            </StyledBox>
          </Scrollbar>

          <Button type="submit" variant="light" fullWidth leftSection={<FaSave />}>
            Save
          </Button>
        </SettingsContainer>
      </Modal>
    </>
  )
}
