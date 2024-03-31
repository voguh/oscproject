import React from 'react'

import { Badge, Box, Button, Modal, Text } from '@mantine/core'

import { WHEEL_RADIUS, WHEEL_SIZE } from '../../constants'
import { SpinWheelContext } from '../SpinWheelRender'
import { SpinResultContainer, SpinWheelContainer } from './styled'

interface Props {
  setResults: React.Dispatch<React.SetStateAction<string[]>>
}

export const SpinWheel: React.FC<Props> = ({ setResults }) => {
  const [tempResult, setTempResult] = React.useState<string>()

  const canvasRef = React.useRef<HTMLCanvasElement>()
  const { config, tries, setTries } = React.useContext(SpinWheelContext)

  function calculateSliceSize(weight: number, fullWeight: number): number {
    return (weight / fullWeight) * (Math.PI * 2)
  }

  function slicePassesThroughZero(startAngle: number, endAngle: number): boolean {
    const angle0InCircle = 0 + Math.PI * 2

    return (startAngle <= angle0InCircle && endAngle >= angle0InCircle) || (startAngle <= 0 && endAngle >= 0)
  }

  function drawWheel(offsetAngle = 0): string {
    const canvas = canvasRef.current
    const slices = config.entries

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const fullWeight = slices.reduce((acc, [weight]) => acc + weight, 0)
    let passesThroughZero: string = null

    let startAngle = 0
    for (let idx = 0; idx < slices.length; idx++) {
      const [weight, labelText] = slices[idx]
      const sliceSize = calculateSliceSize(weight, fullWeight)
      const _startAngle = startAngle + offsetAngle
      const _endAngle = startAngle + sliceSize + offsetAngle

      ctx.beginPath()
      ctx.arc(centerX, centerY, WHEEL_RADIUS, _startAngle, _endAngle, false)
      ctx.lineTo(centerX, centerY)
      ctx.fillStyle = idx % 2 === 0 ? '#9dcca3' : '#cde6b3'
      ctx.fill()
      ctx.closePath()

      /* ======================================================================================== */

      ctx.save()

      const sliceMiddleAngle = startAngle + sliceSize / 2 + offsetAngle
      const textX = centerX + Math.cos(sliceMiddleAngle) * (WHEEL_RADIUS / 1.05)
      const textY = centerY + Math.sin(sliceMiddleAngle) * (WHEEL_RADIUS / 1.05)

      ctx.translate(textX, textY)
      ctx.rotate(sliceMiddleAngle)
      ctx.translate(-textX, -textY)

      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'black'
      ctx.fillText(labelText, textX, textY)

      ctx.restore()

      if (slicePassesThroughZero(_startAngle, _endAngle)) {
        passesThroughZero = labelText
      }

      startAngle += sliceSize
    }

    return passesThroughZero
  }

  function spinWheel(): void {
    const { spinDuration } = config
    const spinSpeed = (2 * Math.PI) / (0.5 * 60)

    const spinDurationMS = spinDuration * 1000
    const endMS = Date.now() + spinDurationMS

    let angle = 0
    const progress = (Date.now() - (endMS - spinDurationMS)) / spinDurationMS
    const randomForce = (Math.random() - 0.5) * 0.1 * (1 - progress)
    function spinLoop(): void {
      const passesThroughZero = drawWheel(angle)

      angle += spinSpeed + randomForce
      angle = angle > 2 * Math.PI ? angle - 2 * Math.PI : angle

      if (Date.now() < endMS) {
        requestAnimationFrame(spinLoop)
      } else {
        setTempResult(passesThroughZero)
      }
    }

    requestAnimationFrame(spinLoop)
  }

  /* ================================================================================================================ */

  function onAcceptResult(): void {
    setTries(-1)
    setResults((old) => [...old, tempResult])
    setTempResult(null)
  }

  function onDenyResult(): void {
    setTempResult(null)
    spinWheel()
  }

  React.useEffect(() => {
    if (canvasRef.current != null && config != null) {
      drawWheel()
    }
  }, [config]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SpinWheelContainer className="spin-wheel">
        <div className="wheel-wrapper">
          <canvas ref={canvasRef} width={WHEEL_SIZE} height={WHEEL_SIZE} />
        </div>
        <div className="actions">
          <Button onClick={spinWheel} disabled={tries <= 0}>
            Spin
            <Badge color="green" style={{ marginLeft: '8px' }}>
              {tries ?? '--'}
            </Badge>
          </Button>
        </div>
        <div className="arrow">
          <div />
        </div>
      </SpinWheelContainer>

      <Modal
        opened={!!tempResult}
        onClose={() => setTempResult(null)}
        size="sm"
        title={false}
        centered
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <SpinResultContainer>
          <Box bg="green" className="result-header">
            <Text size="xl" c="gray.9" ta="center" fw={700}>
              SPIN RESULT
            </Text>
          </Box>

          <Box className="result-body">
            <Text size="LG" ta="center" fw={700}>
              {tempResult}
            </Text>
          </Box>

          <Box className="result-footer">
            <Button onClick={onAcceptResult}>Accept result</Button>
            <Button variant="outline" onClick={onDenyResult}>
              Deny result (run again)
            </Button>
          </Box>
        </SpinResultContainer>
      </Modal>
    </>
  )
}
