import async from 'async'

import { storageService } from '~/services/storageService'

export const SPIN_WHEEL_EXTENSION_ID = 'oscproject::spin-wheel-module'
export const WHEEL_RADIUS = 200
export const WHEEL_SIZE = WHEEL_RADIUS * 2
export const SPIN_WHEEL_CONTAINER_WIDTH = WHEEL_SIZE + 80

export const INITIAL_DATA: SpinWheelConfig = {
  spinDuration: 6,
  spinSpeed: 0.1,
  allowMock: false,
  thresholds: {
    bits: 100,
    tip: 5,
    sub: { prime: 1, '1000': 1, '2000': 2, '3000': 4 }
  },
  entries: [
    [100, 'RANDOM TIMEOUT'],
    [100, 'RANDOM SUBGIFT'],
    [100, 'NOTHING'],
    [100, 'MUTED']
  ]
}

export async function getSpinWheelConfig(): Promise<SpinWheelConfig> {
  return storageService.get<SpinWheelConfig>(`${SPIN_WHEEL_EXTENSION_ID}::config`, INITIAL_DATA)
}

export async function setSpinWheelConfig(data: SpinWheelConfig): Promise<SpinWheelConfig> {
  return storageService.set(`${SPIN_WHEEL_EXTENSION_ID}::config`, data)
}

export async function getSpinTries(): Promise<number> {
  return storageService.get<number>(`${SPIN_WHEEL_EXTENSION_ID}::spin_tries`, 0)
}

export async function setSpinTries(data: number): Promise<number> {
  return storageService.set(`${SPIN_WHEEL_EXTENSION_ID}::spin_tries`, data)
}

async function updateTriesHandler(valueToAdd: number, cb: (err?: any) => void): Promise<void> {
  try {
    const tries = await getSpinTries()
    await setSpinTries(Math.max((tries ?? 0) + valueToAdd, 0))
    cb()
  } catch (err) {
    cb(err)
  }
}

export const updateTries = async.queue(updateTriesHandler, 1)
