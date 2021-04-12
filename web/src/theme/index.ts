import { palette } from './colors'
import { error, shadow, success } from './semantics'

const Theme = {
  primary: palette.petalPurple,
  secondary: palette.frogGreen,
  palette,
  semantics: {
    shadow,
    success,
    error,
  },
  footer: {
    images: {
      md: {
        width: '60px',
        height: '56.4px',
      },
      sm: {
        width: '33px',
        height: '30px',
      },
    },
  },
}

export default Theme

const Breakpoints = {
  sm: 600, // Mobile devices
  md: 850, // Tablets
  lg: 1200, // Desktop
}

export const belowBreakpoint = {
  sm: `@media (max-width: ${Breakpoints.sm}px)`,
  md: `@media (max-width: ${Breakpoints.md}px)`,
  lg: `@media (max-width: ${Breakpoints.lg}px)`,
}

export const MIN_HEIGHT = '720px'
