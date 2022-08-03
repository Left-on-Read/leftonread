import { extendTheme, theme as baseTheme } from '@chakra-ui/react';

// SEE THEME COLOURS HERE: https://chakra-ui.com/docs/styled-system/theme
export const theme = extendTheme({
  colors: {
    primary: baseTheme.colors.purple,
  },
  fonts: {
    body: `'Montserrat', sans-serif`,
    heading: `'Montserrat', sans-serif`,
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
});
