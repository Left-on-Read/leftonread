export type Color = {
  main: string
  hover: string
  faded: string
  graphFaded: string
}

const petalPurple: Color = {
  main: '#9086D6',
  hover: '#A187D7',
  faded: 'rgba(144, 134, 214, 0.2)',
  graphFaded: 'rgba(144, 134, 214, 0.6)',
}

const sherwoodGreen: Color = {
  main: '#06D6A0',
  hover: '#06D6A0',
  faded: 'rgba(6, 214, 160, 0.2)',
  graphFaded: 'rgba(6, 214, 160, 0.6)',
}

const skyBlue: Color = {
  main: '#54C6EB',
  hover: '#54C6EB',
  faded: 'rgba(84, 198, 235, 0.2)',
  graphFaded: 'rgba(84, 198, 235, 0.6)',
}

const palePink: Color = {
  main: '#E5C1BD',
  hover: '#E5C1BD',
  faded: 'rgba(229, 193, 189, 0.2)',
  graphFaded: 'rgba(229, 193, 189, 0.6)',
}

const canaryYellow: Color = {
  main: '#F5CB5C',
  hover: '#F5CB5C',
  faded: 'rgba(245, 203, 92, 0.2)',
  graphFaded: 'rgba(245, 203, 92, 0.6)',
}

const frogGreen: Color = {
  main: '#7BCDBA',
  hover: '#43b59b',
  faded: 'rgba(123, 205, 186, 0.2)',
  graphFaded: 'rgba(123, 205, 186, 0.8)',
}

type Palette = {
  petalPurple: Color
  sherwoodGreen: Color
  skyBlue: Color
  palePink: Color
  canaryYellow: Color
  frogGreen: Color
}

export const palette: Palette = {
  petalPurple,
  sherwoodGreen,
  skyBlue,
  palePink,
  canaryYellow,
  frogGreen,
}
