import type { IText } from './types'

const DEFAULT_LENGTH = 5000

export const LIST_OF_TEXTS: Array<IText> = [
  {
    key: 1,
    name: 'Alexander',
    text:
      'Dude! Did you see that crazy article on the New York Times? Insane!!',
    length: DEFAULT_LENGTH,
    words: ['dude', 'crazy', 'article', 'new', 'york', 'times', 'insane'],
  },
  {
    key: 2,
    name: 'Mariah',
    text:
      'Hey babe! Ready to head out soon? Our reservation is in 30 minutes...',
    length: 1000,
    words: ['crazy', 'insane', 'reservation', 'babe'],
  },
  {
    key: 3,
    name: 'Mariah',
    text: 'love you! but dont be late',
    length: DEFAULT_LENGTH,
    words: ['love', 'babe', 'late'],
  },
  {
    key: 4,
    name: 'Amelia',
    text:
      'were u able to finish ur section of the project? i have some ideas on how we can maybe get it up to B quality',
    length: DEFAULT_LENGTH,
    words: ['finish', 'project', 'quality', 'love'],
  },
  {
    key: 5,
    name: 'Phillip',
    text:
      'Wanna get smashhed tn with the boys? Looking to cause some trouble 😈',
    length: DEFAULT_LENGTH,
    words: ['smashed', 'boys', 'trouble'],
  },
  {
    key: 6,
    name: 'Jonah',
    text: 'Man we gotta go to the movies later, im tryna get LIT',
    length: DEFAULT_LENGTH,
    words: ['movie', 'lit', 'man'],
  },
]
