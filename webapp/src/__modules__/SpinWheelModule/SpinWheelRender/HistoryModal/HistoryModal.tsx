import React from 'react'
import { FaClockRotateLeft } from 'react-icons/fa6'

import { List, Modal } from '@mantine/core'

import { HistoryButton } from './styled'

interface Props {
  results: string[]
}

export const HistoryModal: React.FC<Props> = ({ results }) => {
  const [historyModal, setHistoryModal] = React.useState(false)

  return (
    <>
      <HistoryButton disabled={results.length === 0} onClick={() => setHistoryModal(true)}>
        <FaClockRotateLeft />
      </HistoryButton>

      <Modal opened={historyModal} onClose={() => setHistoryModal(false)} size="sm" title="Spin History" centered>
        <List>
          {results.map((result, idx) => (
            <List.Item key={idx}>
              {idx + 1}: {result}
            </List.Item>
          ))}
        </List>
      </Modal>
    </>
  )
}
