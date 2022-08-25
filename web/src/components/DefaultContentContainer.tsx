import { Box } from '@chakra-ui/react'

export function DefaultContentContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      paddingX={{
        base: '32px',
        md: '64px',
        lg: '128px',
      }}
      height="100%"
    >
      {children}
    </Box>
  )
}
