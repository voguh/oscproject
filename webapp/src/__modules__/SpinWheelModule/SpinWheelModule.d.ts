declare interface SpinWheelConfig {
  spinDuration: number
  spinSpeed: number
  allowMock: boolean
  thresholds: {
    bits: number
    tip: number
    sub: {
      prime: number
      '1000': number
      '2000': number
      '3000': number
    }
  }
  entries: [number, string][]
}
