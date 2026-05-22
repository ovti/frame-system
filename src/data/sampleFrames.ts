// import type { Frame } from '../types/frame';

// export const sampleFrames: Frame[] = [
//   {
//     id: 'anna',
//     name: 'Anna',
//     type: 'OBJECT',
//     description: 'A person in the sample family graph.',
//     parentIds: [],
//     childIds: ['piotr'],
//     slots: [
//       {
//         id: 'slot-anna-1',
//         name: 'Gender',
//         aspects: [
//           {
//             id: 'aspect-anna-1',
//             type: 'VALUE',
//             value: 'female',
//           },
//         ],
//       },
//       {
//         id: 'slot-anna-2',
//         name: 'Role in example',
//         aspects: [
//           {
//             id: 'aspect-anna-2',
//             type: 'VALUE',
//             value: 'mother',
//           },
//         ],
//       },
//     ],
//     relations: [],
//   },
//   {
//     id: 'jan',
//     name: 'Jan',
//     type: 'OBJECT',
//     description: 'A person in the sample family graph.',
//     parentIds: [],
//     childIds: ['piotr'],
//     slots: [
//       {
//         id: 'slot-jan-1',
//         name: 'Gender',
//         aspects: [
//           {
//             id: 'aspect-jan-1',
//             type: 'VALUE',
//             value: 'male',
//           },
//         ],
//       },
//       {
//         id: 'slot-jan-2',
//         name: 'Role in example',
//         aspects: [
//           {
//             id: 'aspect-jan-2',
//             type: 'VALUE',
//             value: 'father',
//           },
//         ],
//       },
//     ],
//     relations: [],
//   },
//   {
//     id: 'piotr',
//     name: 'Piotr',
//     type: 'OBJECT',
//     description: 'The son of Anna and Jan.',
//     parentIds: ['anna', 'jan'],
//     childIds: [],
//     slots: [
//       {
//         id: 'slot-piotr-1',
//         name: 'Gender',
//         aspects: [
//           {
//             id: 'aspect-piotr-1',
//             type: 'VALUE',
//             value: 'male',
//           },
//         ],
//       },
//       {
//         id: 'slot-piotr-2',
//         name: 'Role in example',
//         aspects: [
//           {
//             id: 'aspect-piotr-2',
//             type: 'VALUE',
//             value: 'son',
//           },
//         ],
//       },
//     ],
//     relations: [],
//   },
// ];

import type { Frame } from '../types/frame';

export const sampleFrames: Frame[] = [
  {
    id: 'rectangular-cuboid-1',
    name: 'Rectangular-Cuboid-1',
    type: 'OBJECT',
    description:
      'A basic constructive solid represented by a rectangular cuboid.',
    parentIds: [],
    childIds: [
      'blind-slot-2',
      'blind-slot-3',
      'hole-4',
      'hole-5',
      'hole-6',
      'hole-7',
    ],
    slots: [
      {
        id: 'slot-rc-1-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-rc-1-type-value',
            type: 'VALUE',
            value: 'Rectangular cuboid',
          },
        ],
      },
      {
        id: 'slot-rc-1-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-rc-1-label-value',
            type: 'VALUE',
            value: 'RC',
          },
        ],
      },
      {
        id: 'slot-rc-1-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-rc-1-index-value',
            type: 'VALUE',
            value: '1',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'blind-slot-2',
    name: 'Blind-Slot-2',
    type: 'OBJECT',
    description: 'A blind slot embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-bs-2-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-bs-2-type-value',
            type: 'VALUE',
            value: 'Blind slot',
          },
        ],
      },
      {
        id: 'slot-bs-2-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-bs-2-label-value',
            type: 'VALUE',
            value: 'BS',
          },
        ],
      },
      {
        id: 'slot-bs-2-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-bs-2-index-value',
            type: 'VALUE',
            value: '2',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'blind-slot-3',
    name: 'Blind-Slot-3',
    type: 'OBJECT',
    description: 'A blind slot embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-bs-3-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-bs-3-type-value',
            type: 'VALUE',
            value: 'Blind slot',
          },
        ],
      },
      {
        id: 'slot-bs-3-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-bs-3-label-value',
            type: 'VALUE',
            value: 'BS',
          },
        ],
      },
      {
        id: 'slot-bs-3-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-bs-3-index-value',
            type: 'VALUE',
            value: '3',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'hole-4',
    name: 'Hole-4',
    type: 'OBJECT',
    description: 'A feature embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-hole-4-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-hole-4-type-value',
            type: 'VALUE',
            value: 'Perpendicular hole',
          },
        ],
      },
      {
        id: 'slot-hole-4-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-hole-4-label-value',
            type: 'VALUE',
            value: 'H',
          },
        ],
      },
      {
        id: 'slot-hole-4-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-hole-4-index-value',
            type: 'VALUE',
            value: '4',
          },
        ],
      },
      {
        id: 'slot-hole-4-parameters',
        name: 'Parameters',
        aspects: [
          {
            id: 'aspect-hole-4-diameter',
            type: 'VALUE',
            value: 'DIAMETER: 1.0',
          },
          {
            id: 'aspect-hole-4-depth',
            type: 'VALUE',
            value: 'DEPTH: 0.5',
          },
          {
            id: 'aspect-hole-4-parameters-unit',
            type: 'VALUE',
            value: 'UNIT: cm',
          },
        ],
      },
      {
        id: 'slot-hole-4-placement-cord',
        name: 'Placement_cord',
        aspects: [
          {
            id: 'aspect-hole-4-x-coord',
            type: 'VALUE',
            value: 'X_COORD: 4.5',
          },
          {
            id: 'aspect-hole-4-y-coord',
            type: 'VALUE',
            value: 'Y_COORD: 1.5',
          },
          {
            id: 'aspect-hole-4-z-coord',
            type: 'VALUE',
            value: 'Z_COORD: 2.5',
          },
          {
            id: 'aspect-hole-4-placement-unit',
            type: 'VALUE',
            value: 'UNIT: cm',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'hole-5',
    name: 'Hole-5',
    type: 'OBJECT',
    description: 'A hole embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-hole-5-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-hole-5-type-value',
            type: 'VALUE',
            value: 'Perpendicular hole',
          },
        ],
      },
      {
        id: 'slot-hole-5-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-hole-5-label-value',
            type: 'VALUE',
            value: 'H',
          },
        ],
      },
      {
        id: 'slot-hole-5-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-hole-5-index-value',
            type: 'VALUE',
            value: '5',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'hole-6',
    name: 'Hole-6',
    type: 'OBJECT',
    description: 'A hole embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-hole-6-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-hole-6-type-value',
            type: 'VALUE',
            value: 'Perpendicular hole',
          },
        ],
      },
      {
        id: 'slot-hole-6-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-hole-6-label-value',
            type: 'VALUE',
            value: 'H',
          },
        ],
      },
      {
        id: 'slot-hole-6-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-hole-6-index-value',
            type: 'VALUE',
            value: '6',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: 'hole-7',
    name: 'Hole-7',
    type: 'OBJECT',
    description: 'A hole embedded in Rectangular-Cuboid-1.',
    parentIds: [],
    childIds: [],
    slots: [
      {
        id: 'slot-hole-7-type',
        name: 'Type',
        aspects: [
          {
            id: 'aspect-hole-7-type-value',
            type: 'VALUE',
            value: 'Perpendicular hole',
          },
        ],
      },
      {
        id: 'slot-hole-7-label',
        name: 'Label',
        aspects: [
          {
            id: 'aspect-hole-7-label-value',
            type: 'VALUE',
            value: 'H',
          },
        ],
      },
      {
        id: 'slot-hole-7-index',
        name: 'Index',
        aspects: [
          {
            id: 'aspect-hole-7-index-value',
            type: 'VALUE',
            value: '7',
          },
        ],
      },
    ],
    relations: [],
  },
];
