import type {
  RelationCategory,
  RelationLayoutRole,
  RelationType,
} from '../types/relation';

export interface RelationPreset {
  id: string;
  label: string;
  type: RelationType;
  category: RelationCategory;
  description: string;
  layoutRole: RelationLayoutRole;
  isCustomLabelAllowed?: boolean;
  defaultLabel?: string;
}

export interface RelationPresetGroup {
  id: RelationCategory;
  name: string;
  description: string;
  relations: RelationPreset[];
}

export const relationPresetGroups: RelationPresetGroup[] = [
  {
    id: 'FAMILY',
    name: 'Family relations',
    description:
      'Relations describing people and family dependencies. These relations do not create frame inheritance.',
    relations: [
      {
        id: 'spouse',
        label: 'spouse',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description:
          'A symmetric family relation between two people. It is not an inheritance relation.',
        layoutRole: 'LATERAL',
      },
      {
        id: 'child',
        label: 'child',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description:
          'A family relation from a parent to a child, e.g. Anna → Piotr. It is not frame inheritance.',
        layoutRole: 'TREE',
      },
      {
        id: 'parent',
        label: 'parent',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description:
          'A family relation from a child to a parent, e.g. Piotr → Anna. It is not frame inheritance.',
        layoutRole: 'TREE',
      },
    ],
  },
  {
    id: 'FRAME_SYSTEM',
    name: 'Frame system',
    description: 'General relations useful for modeling classes and objects.',
    relations: [
      {
        id: 'inherits-from',
        label: 'inherits from',
        type: 'INHERITS_FROM',
        category: 'FRAME_SYSTEM',
        description: 'An inheritance relation between classes.',
        layoutRole: 'TREE',
      },
      {
        id: 'instance-of',
        label: 'instance of',
        type: 'INSTANCE_OF',
        category: 'FRAME_SYSTEM',
        description: 'A relation between an object and a class.',
        layoutRole: 'TREE',
      },
      {
        id: 'association',
        label: 'associated with',
        type: 'ASSOCIATION',
        category: 'FRAME_SYSTEM',
        description: 'A general association relation.',
        layoutRole: 'CROSS',
      },
    ],
  },
  {
    id: 'MECHANICAL_PART',
    name: 'Mechanical part features',
    description:
      'Relations used for modeling feature primitives embedded in a constructive solid.',
    relations: [
      {
        id: 'embedded-in',
        label: 'embedded_in',
        type: 'ASSOCIATION',
        category: 'MECHANICAL_PART',
        description:
          'Connects the basic constructive solid with a feature primitive. The edge label describes the face-based placement, e.g. 5 or 4.5.',
        layoutRole: 'TREE',
        isCustomLabelAllowed: true,
        defaultLabel: '5',
      },
      {
        id: 'placed-in',
        label: 'placed_in',
        type: 'ASSOCIATION',
        category: 'MECHANICAL_PART',
        description:
          'Connects a feature primitive with the feature in which it is additionally placed, e.g. a hole placed in a blind slot.',
        layoutRole: 'CROSS',
        isCustomLabelAllowed: true,
        defaultLabel: 'a.5.6',
      },
      {
        id: 'spatial-relation',
        label: 'spatial_relation',
        type: 'ASSOCIATION',
        category: 'MECHANICAL_PART',
        description:
          'Connects features whose mutual position is relevant, e.g. a pair of holes.',
        layoutRole: 'CROSS',
        isCustomLabelAllowed: true,
        defaultLabel: 'y',
      },
    ],
  },
];
