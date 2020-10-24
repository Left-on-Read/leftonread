/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core'

const GRADIENT_KEYFRAMES = keyframes`
    0% {background-position: 10% 0%}
    50% {background-position: 91% 100%}
    100% {background-position: 10% 100%}
`

export function Gradient() {
  return (
    <div
      css={{
        top: 0,
        right: 0,
        position: 'absolute',
        height: '100vh',
        width: '100%',
        zIndex: -1,
      }}
    >
      <div
        css={{
          height: '100%',
          width: '100%',
          background:
            'linear-gradient(260deg, #06D6A0 0%, #54C6EB 33%, #F5CB5C 66%, #E5C1BD 100%)',
          backgroundSize: '600% 100%',
          animation: `${GRADIENT_KEYFRAMES} 24s linear infinite`,
        }}
      />
      <div
        css={{
          position: 'absolute',
          bottom: 0,
          height: '42%',
          width: 0,
          borderRight: '100vw solid #FFFFFF',
          borderTop: '38vh solid transparent',
        }}
      />
    </div>
  )
}
