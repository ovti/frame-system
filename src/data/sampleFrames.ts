import type { Frame } from '../types/frame';

export const sampleFrames: Frame[] = [
  {
    id: 'anna',
    name: 'Anna',
    type: 'OBJECT',
    description: 'Osoba w przykładowym grafie rodzinnym.',
    parentIds: [],
    childIds: ['piotr'],
    slots: [
      {
        id: 'slot-anna-1',
        name: 'Płeć',
        aspects: [
          {
            id: 'aspect-anna-1',
            type: 'VALUE',
            value: 'kobieta',
          },
        ],
      },
      {
        id: 'slot-anna-2',
        name: 'Rola w przykładzie',
        aspects: [
          {
            id: 'aspect-anna-2',
            type: 'VALUE',
            value: 'matka',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'jan',
    name: 'Jan',
    type: 'OBJECT',
    description: 'Osoba w przykładowym grafie rodzinnym.',
    parentIds: [],
    childIds: ['piotr'],
    slots: [
      {
        id: 'slot-jan-1',
        name: 'Płeć',
        aspects: [
          {
            id: 'aspect-jan-1',
            type: 'VALUE',
            value: 'mężczyzna',
          },
        ],
      },
      {
        id: 'slot-jan-2',
        name: 'Rola w przykładzie',
        aspects: [
          {
            id: 'aspect-jan-2',
            type: 'VALUE',
            value: 'ojciec',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'piotr',
    name: 'Piotr',
    type: 'OBJECT',
    description: 'Syn Anny i Jana.',
    parentIds: ['anna', 'jan'],
    childIds: [],
    slots: [
      {
        id: 'slot-piotr-1',
        name: 'Płeć',
        aspects: [
          {
            id: 'aspect-piotr-1',
            type: 'VALUE',
            value: 'mężczyzna',
          },
        ],
      },
      {
        id: 'slot-piotr-2',
        name: 'Rola w przykładzie',
        aspects: [
          {
            id: 'aspect-piotr-2',
            type: 'VALUE',
            value: 'syn',
          },
        ],
      },
    ],
    relations: [],
  },
];
