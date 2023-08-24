import { extendTheme, theme as baseTheme } from '@chakra-ui/react'

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

// SEE THEME COLOURS HERE: https://chakra-ui.com/docs/styled-system/theme
export const chakraTheme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    primary: baseTheme.colors.purple,
  },
  fonts: {
    body: `Roboto`,
    heading: `Roboto`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 500,
        fontSize: 14,
      },
      variants: {
        primary: {
          backgroundColor: 'purple.100',
          _hover: { background: 'purple.200' },
        },
      },
    },
  },
})
