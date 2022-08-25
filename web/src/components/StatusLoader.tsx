import { Text } from '@chakra-ui/react'
import { motion, useAnimation } from 'framer-motion'
import * as React from 'react'

import { usePrevious } from '../hooks/usePrevious'
import Theme from '../theme'

// Set Values
const Dimension = 25
const StrokeWidth = 2
const XOffset = 18.5

// Derived Values
const Radius = Dimension - 2 * StrokeWidth
const Circumference = 2 * 3.14 * Radius
const CheckmarkPath = `M${0.27115 * Dimension * 2} ${0.52307 * Dimension * 2}l${
  0.13653 * Dimension * 2
} ${0.13846 * Dimension * 2} ${0.32115 * Dimension * 2}-${
  0.32307 * Dimension * 2
}`
const CheckmarkOffset = 0.92307 * Dimension * 2

export type StatusLoaderState = 'loading' | 'success' | 'error'

export function StatusLoader({
  state,
  message,
}: {
  state: StatusLoaderState
  message?: string
}) {
  const rotateControls = useAnimation()
  const circleControls = useAnimation()
  const checkmarkControls = useAnimation()
  const x1Controls = useAnimation()
  const x2Controls = useAnimation()
  const textControls = useAnimation()

  const prevState = usePrevious<StatusLoaderState>(state)

  React.useEffect(() => {
    if (state !== prevState) {
      if (state === 'loading') {
        circleControls.start({
          stroke: Theme.primary.main,
          strokeDashoffset: Circumference * 0.75,
        })
        rotateControls.stop()
        rotateControls.start({
          rotate: [0, 360],
        })

        if (prevState === 'success') {
          checkmarkControls.start({
            strokeDashoffset: CheckmarkOffset,
          })
          textControls.start({
            opacity: 0,
          })
        }

        if (prevState === 'error') {
          x1Controls.start({
            strokeDashoffset: 2 * XOffset,
          })
          x2Controls.start({
            strokeDashoffset: 2 * XOffset,
          })
          textControls.start({
            opacity: 0,
          })
        }
      }

      if (state === 'success') {
        // Stop rotate animation
        rotateControls.stop()
        // Transition in checkmark
        checkmarkControls.start({
          stroke: Theme.semantics.success,
          strokeDashoffset: 0,
        })
        // Transition in full circle
        circleControls.start({
          stroke: Theme.semantics.success,
          strokeDashoffset: 0,
        })
        textControls.start({
          opacity: 1,
          color: Theme.semantics.success,
        })
      }

      if (state === 'error') {
        // Stop rotate animation
        rotateControls.stop()
        // Transition in cross
        x1Controls.start({
          stroke: Theme.semantics.error,
          strokeDashoffset: 0,
        })
        x2Controls.start({
          stroke: Theme.semantics.error,
          strokeDashoffset: 0,
        })

        // Transition in full circle
        circleControls.start({
          stroke: Theme.semantics.error,
          strokeDashoffset: 0,
        })

        textControls.start({
          opacity: 1,
          color: Theme.semantics.error,
        })
      }
    }

    return () => {
      rotateControls.stop()
    }
  }, [state])

  return (
    <>
      <motion.svg height={2 * Dimension} width={2 * Dimension}>
        <motion.g
          animate={rotateControls}
          transition={{ repeat: Infinity, ease: 'linear' }}
        >
          <motion.circle
            animate={circleControls}
            r={Radius}
            cx={Dimension}
            cy={Dimension}
            fill="transparent"
            stroke={Theme.primary.main}
            strokeWidth={StrokeWidth}
            strokeDasharray={`${Circumference} ${Circumference}`}
            strokeDashoffset={0}
          />
        </motion.g>
        <motion.path
          animate={checkmarkControls}
          fill="none"
          d={CheckmarkPath}
          stroke={Theme.primary.main}
          strokeWidth={StrokeWidth}
          strokeDasharray={`${CheckmarkOffset} ${CheckmarkOffset}`}
          strokeDashoffset={CheckmarkOffset}
        />
        <g>
          <motion.line
            animate={x1Controls}
            stroke={Theme.primary.main}
            strokeWidth={StrokeWidth}
            strokeDasharray={`${2 * XOffset} ${2 * XOffset}`}
            strokeDashoffset={2 * XOffset}
            x1={XOffset}
            y1={2 * Dimension - XOffset}
            x2={2 * Dimension - XOffset}
            y2={XOffset}
          />
          <motion.line
            animate={x2Controls}
            stroke={Theme.primary.main}
            strokeWidth={StrokeWidth}
            strokeDasharray={`${2 * XOffset} ${2 * XOffset}`}
            strokeDashoffset={2 * XOffset}
            x1={XOffset}
            y1={XOffset}
            x2={2 * Dimension - XOffset}
            y2={2 * Dimension - XOffset}
          />
        </g>
      </motion.svg>
      <motion.span animate={textControls} data-testid="status-message">
        <Text>{message}</Text>
      </motion.span>
    </>
  )
}
