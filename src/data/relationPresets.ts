import type { RelationCategory, RelationType } from '../types/relation';

export interface RelationPreset {
  id: string;
  label: string;
  type: RelationType;
  category: RelationCategory;
  description: string;
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
    description: 'Relations describing people and family dependencies.',
    relations: [
      {
        id: 'spouse',
        label: 'spouse',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'A symmetric relation between two people.',
      },
      {
        id: 'child',
        label: 'child',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'A relation from a parent to a child, e.g. Anna → Piotr.',
      },
      {
        id: 'parent',
        label: 'parent',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'A relation from a child to a parent, e.g. Piotr → Anna.',
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
      },
      {
        id: 'instance-of',
        label: 'instance of',
        type: 'INSTANCE_OF',
        category: 'FRAME_SYSTEM',
        description: 'A relation between an object and a class.',
      },
      {
        id: 'association',
        label: 'associated with',
        type: 'ASSOCIATION',
        category: 'FRAME_SYSTEM',
        description: 'A general association relation.',
      },
    ],
  },
];
