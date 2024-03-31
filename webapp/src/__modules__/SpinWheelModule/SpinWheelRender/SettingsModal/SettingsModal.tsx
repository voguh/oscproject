import React from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { FaCog, FaPlus, FaSave, FaTrash } from 'react-icons/fa'

import { Button, Input, Modal, Switch, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

import { useDimensions } from '~/hooks/useDimensions'

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
        <SettingsContainer>
          <form onSubmit={onSubmit(handleSave)}>
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

            <StyledBox style={{ marginTop: 16 }}>
              <Text fw="800">Thresholds</Text>
              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '100px 1fr 1fr 1fr 1fr' }}>
                <TextInput type="number" label="Bits" {...getInputProps('thresholds.bits')} />
                <TextInput type="number" label="Tip" {...getInputProps('thresholds.tip')} />
                <TextInput type="number" label="Sub Tier 1" {...getInputProps('thresholds.sub.1000')} />
                <TextInput type="number" label="Sub Tier 2" {...getInputProps('thresholds.sub.2000')} />
                <TextInput type="number" label="Sub Tier 3" {...getInputProps('thresholds.sub.3000')} />
              </div>
            </StyledBox>

            <Scrollbars style={{ marginTop: 16, height: dimensions.height - 400 }}>
              <StyledBox>
                <Text fw="800">Entries</Text>
                {values?.entries?.map((value, idx) => (
                  <EntryStyledBox key={idx}>
                    <TextInput type="number" {...getInputProps(`entries.${idx}.0`)} />
                    <TextInput type="text" {...getInputProps(`entries.${idx}.1`)} />
                    <Button variant="light" color="red" onClick={() => handleRemove(idx)}>
                      <FaTrash />
                    </Button>
                  </EntryStyledBox>
                ))}

                <EntryStyledBox>
                  <Button variant="light" color="green" fullWidth onClick={handleAdd} leftSection={<FaPlus />}>
                    Add item
                  </Button>
                </EntryStyledBox>
              </StyledBox>
            </Scrollbars>
            <Button type="submit" variant="light" fullWidth mt="lg" leftSection={<FaSave />}>
              Save
            </Button>
          </form>
        </SettingsContainer>
      </Modal>
    </>
  )
}
