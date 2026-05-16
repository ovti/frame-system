import type { Relation } from '../types/relation';

export const sampleRelations: Relation[] = [
  {
    id: 'relation-jan-anna',
    sourceId: 'jan',
    targetId: 'anna',
    label: 'spouse',
    type: 'ASSOCIATION',
    category: 'FAMILY',
  },
  {
    id: 'relation-jan-piotr',
    sourceId: 'jan',
    targetId: 'piotr',
    label: 'child',
    type: 'ASSOCIATION',
    category: 'FAMILY',
  },
  {
    id: 'relation-anna-piotr',
    sourceId: 'anna',
    targetId: 'piotr',
    label: 'child',
    type: 'ASSOCIATION',
    category: 'FAMILY',
  },
];
