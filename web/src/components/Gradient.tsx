import { keyframes } from '@emotion/react'

import Theme from '../theme'

const GRADIENT_KEYFRAMES = keyframes`
    0% {background-position: 10% 0%}
    50% {background-position: 91% 100%}
    100% {background-position: 10% 100%}
`

export function Gradient() {
  return (
    <div
      style={{
        top: 0,
        right: 0,
        position: 'absolute',
        height: '100vh',
        width: '100%',
        zIndex: -1,
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          background: `linear-gradient(260deg, ${Theme.palette.sherwoodGreen.main} 0%, ${Theme.palette.palePink.main} 33%, ${Theme.palette.canaryYellow.main} 66%, ${Theme.palette.skyBlue.main} 100%)`,
          backgroundSize: '600% 100%',
          animation: `${GRADIENT_KEYFRAMES} 24s linear infinite`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          height: '8%',
          width: 0,
          borderRight: '100vw solid #FFFFFF',
          borderTop: '38vh solid transparent',
        }}
      />
    </div>
  )
}
