import type { Frame } from '../types/frame';

export const sampleFrames: Frame[] = [
  {
    id: 'anna',
    name: 'Anna',
    type: 'OBJECT',
    description: 'A person in the sample family graph.',
    parentIds: [],
    childIds: ['piotr'],
    slots: [
      {
        id: 'slot-anna-1',
        name: 'Gender',
        aspects: [
          {
            id: 'aspect-anna-1',
            type: 'VALUE',
            value: 'female',
          },
        ],
      },
      {
        id: 'slot-anna-2',
        name: 'Role in example',
        aspects: [
          {
            id: 'aspect-anna-2',
            type: 'VALUE',
            value: 'mother',
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
    description: 'A person in the sample family graph.',
    parentIds: [],
    childIds: ['piotr'],
    slots: [
      {
        id: 'slot-jan-1',
        name: 'Gender',
        aspects: [
          {
            id: 'aspect-jan-1',
            type: 'VALUE',
            value: 'male',
          },
        ],
      },
      {
        id: 'slot-jan-2',
        name: 'Role in example',
        aspects: [
          {
            id: 'aspect-jan-2',
            type: 'VALUE',
            value: 'father',
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
    description: 'The son of Anna and Jan.',
    parentIds: ['anna', 'jan'],
    childIds: [],
    slots: [
      {
        id: 'slot-piotr-1',
        name: 'Gender',
        aspects: [
          {
            id: 'aspect-piotr-1',
            type: 'VALUE',
            value: 'male',
          },
        ],
      },
      {
        id: 'slot-piotr-2',
        name: 'Role in example',
        aspects: [
          {
            id: 'aspect-piotr-2',
            type: 'VALUE',
            value: 'son',
          },
        ],
      },
    ],
    relations: [],
  },
];
