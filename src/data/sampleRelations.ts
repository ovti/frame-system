import type { Relation } from '../types/relation';

export const sampleRelations: Relation[] = [
  {
    id: 'relation-anna-jan',
    sourceId: 'anna',
    targetId: 'jan',
    label: 'małżonek',
    type: 'ASSOCIATION',
  },
  {
    id: 'relation-anna-piotr',
    sourceId: 'anna',
    targetId: 'piotr',
    label: 'dziecko',
    type: 'ASSOCIATION',
  },
  {
    id: 'relation-jan-piotr',
    sourceId: 'jan',
    targetId: 'piotr',
    label: 'dziecko',
    type: 'ASSOCIATION',
  },
];
