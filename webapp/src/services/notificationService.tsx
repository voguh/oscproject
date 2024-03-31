import React from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa'

import { notifications } from '@mantine/notifications'

export const notificationService = {
  success: (_message: string, _title: string) => {
    notifications.show({
      color: 'green',
      icon: <FaCheckCircle />,
      title: _title,
      message: _message
    })
  },
  warn: (_message: string, _title: string) => {
    notifications.show({
      color: 'yellow',
      icon: <FaExclamationCircle />,
      title: _title,
      message: _message
    })
  },
  error: (_message: string, _title: string) => {
    notifications.show({
      color: 'red',
      icon: <FaTimesCircle />,
      title: _title,
      message: _message
    })
  },
  info: (_message: string, _title: string) => {
    notifications.show({
      color: 'cyan',
      icon: <FaExclamationCircle />,
      title: _title,
      message: _message
    })
  }
}
