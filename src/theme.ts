const palette = {
  sherwoodGreen: '#06D6A0',
  skyBlue: '#54C6EB',
  palePink: '#E5C1BD',
  canaryYellow: '#F5CB5C',
}

const Theme = {
  primary: '#9086D6',
  palette,
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
