import type { Relation } from '../types/relation';

export const sampleRelations: Relation[] = [
  {
    id: 'relation-1',
    sourceId: '2',
    targetId: '1',
    label: 'dziedziczy po',
    type: 'INHERITS_FROM',
  },
  {
    id: 'relation-2',
    sourceId: '3',
    targetId: '2',
    label: 'jest instancją klasy',
    type: 'INSTANCE_OF',
  },
];
