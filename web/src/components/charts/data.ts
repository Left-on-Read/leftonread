import { theme as defaultTheme } from '@chakra-ui/react'

import type { IText } from '../types'

const DEFAULT_LENGTH = 3500
const SEQUENTIAL_LENGTH = 2000

export const LIST_OF_TEXTS: Array<IText> = [
  {
    key: 1,
    name: 'Alexander',
    text: 'did you see that crazy article in the times?',
    length: SEQUENTIAL_LENGTH,
    words: ['bro', 'crazy', 'article', 'times', 'frat'],
    avatar: {
      source: '/alexander.png',
      color: defaultTheme.colors.yellow['200'],
    },
  },
  {
    key: 2,
    name: 'Alexander',
    text: 'also should i double text lupita? she hasnt responded yet bro',
    length: DEFAULT_LENGTH,
    words: ['double', 'text', 'lupita', 'hasnt', 'responded', 'bro'],
    avatar: {
      source: '/alexander.png',
      color: defaultTheme.colors.yellow['200'],
    },
  },
  {
    key: 3,
    name: 'Annie',
    text: 'hey wanna get crazy drunk tonight? i j finished my homework🤘😫🤘',
    length: SEQUENTIAL_LENGTH,
    words: [
      'hey',
      'wanna',
      'crazy',
      'drunk',
      'tonight',
      'finished',
      'homework',
    ],
    avatar: {
      source: '/annie.png',
      color: defaultTheme.colors.green['200'],
    },
  },
  {
    key: 4,
    name: 'Cathy',
    text: 'i think annie is trying to get drunk tonight lol',
    length: SEQUENTIAL_LENGTH,
    words: ['think', 'annie', 'drunk', 'tonight', 'lol'],
    avatar: {
      source: '/cathy.png',
      color: defaultTheme.colors.pink['200'],
    },
  },
  {
    key: 5,
    name: 'Annie',
    text: 'cathy is being kinda silly, she wont get drunk with me',
    length: DEFAULT_LENGTH,
    words: ['cathy', 'silly', 'drunk'],
    avatar: {
      source: '/annie.png',
      color: defaultTheme.colors.green['200'],
    },
  },
  {
    key: 6,
    name: 'George',
    text:
      'BRO ever been to sports basement? amazing deals, we gotta go sometime bro',
    length: SEQUENTIAL_LENGTH,
    words: [
      'bro',
      'sports',
      'basement',
      'love',
      'place',
      'good',
      'deals',
      'sometime',
      'bro',
    ],
    avatar: {
      source: '/george.png',
      color: defaultTheme.colors.purple['200'],
    },
  },
  {
    key: 7,
    name: 'George',
    text:
      'im not kidding when i say i saved 80%, more money for white claws LOL',
    length: DEFAULT_LENGTH,
    words: ['kidding', 'saved', 'weekend', 'bro', 'money', 'white', 'claws'],
    avatar: {
      source: '/george.png',
      color: defaultTheme.colors.purple['200'],
    },
  },
  {
    key: 8,
    name: 'Allison',
    text: 'i think george might have an addiction to sports basement',
    length: SEQUENTIAL_LENGTH,
    words: ['george', 'addiction', 'sports', 'basement'],
    avatar: {
      source: '/allison.png',
      color: defaultTheme.colors.green['200'],
    },
  },
  {
    key: 9,
    name: 'Allison',
    text: 'he literally went 3 times alone this past weekend',
    length: DEFAULT_LENGTH,
    words: ['literally', 'times', 'alone', 'past', 'weekend'],
    avatar: {
      source: '/allison.png',
      color: defaultTheme.colors.green['200'],
    },
  },
  {
    key: 10,
    name: 'Nate',
    text: 'say no more, super down to go biking this weekend 🚴',
    length: DEFAULT_LENGTH,
    words: ['super', 'down', 'bike', 'weekend'],
    avatar: {
      source: '/nate.png',
      color: defaultTheme.colors.blue['200'],
    },
  },
  {
    key: 11,
    name: 'Jackie',
    text:
      'i messed up dude, accidentally scheduled 4 dates for this weekend 🥴',
    length: DEFAULT_LENGTH,
    words: [
      'messed',
      'up',
      'dude',
      'accidentally',
      'scheduled',
      'dates',
      'weekend',
      'same',
      'time',
    ],
    avatar: {
      source: '/jackie.png',
      color: defaultTheme.colors.green['200'],
    },
  },
  {
    key: 12,
    name: 'Lupita',
    text:
      'did nate invite you to the bike ride? i need to go to sports basement...',
    length: DEFAULT_LENGTH,
    words: ['nate', 'invite', 'bike', 'ride', 'sports', 'basement'],
    avatar: {
      source: '/isabel.png',
      color: defaultTheme.colors.purple['200'],
    },
  },
  {
    key: 13,
    name: 'Alexander',
    text: 'man, i have a huge crush on lupita. should i tell her?',
    length: DEFAULT_LENGTH,
    words: ['man', 'huge', 'crush', 'lupita', 'should', 'tell', 'her'],
    avatar: {
      source: '/alexander.png',
      color: defaultTheme.colors.yellow['200'],
    },
  },
  {
    key: 14,
    name: 'Lupita',
    text: 'alex keeps texting me for some reason, i think he likes me 🤗',
    length: DEFAULT_LENGTH,
    words: ['alex', 'texting', 'some', 'reason', 'likes', 'me'],
    avatar: {
      source: '/isabel.png',
      color: defaultTheme.colors.purple['200'],
    },
  },
  {
    key: 15,
    name: 'Adam',
    text: 'why does george keep asking me to go to sports basement with him?',
    length: DEFAULT_LENGTH,
    words: ['why', 'george', 'keep', 'asking', 'sports', 'basement', 'him'],
    avatar: {
      source: '/adam.png',
      color: defaultTheme.colors.pink['200'],
    },
  },
  {
    key: 16,
    name: 'Nate',
    text:
      'actually scratching the bike ride, probs wont feel too good after tonight',
    length: DEFAULT_LENGTH,
    words: [
      'actually',
      'scratching',
      'bike',
      'ride',
      'good',
      'after',
      'tonight',
    ],
    avatar: {
      source: '/nate.png',
      color: defaultTheme.colors.blue['200'],
    },
  },
  {
    key: 17,
    name: 'Jackie',
    text:
      'i gotta figure out how im going to pay my landlord peter rent this month',
    length: DEFAULT_LENGTH,
    words: ['figure', 'out', 'pay', 'landlord', 'peter', 'rent', 'month'],
    avatar: {
      source: '/jackie.png',
      color: defaultTheme.colors.green['200'],
    },
  },
]
