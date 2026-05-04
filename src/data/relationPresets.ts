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
    name: 'Więzi rodzinne',
    description: 'Relacje opisujące osoby i zależności rodzinne.',
    relations: [
      {
        id: 'spouse',
        label: 'małżonek',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'Relacja symetryczna między dwiema osobami.',
      },
      {
        id: 'child',
        label: 'dziecko',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'Relacja od rodzica do dziecka, np. Anna → Piotr.',
      },
      {
        id: 'parent',
        label: 'rodzic',
        type: 'ASSOCIATION',
        category: 'FAMILY',
        description: 'Relacja od dziecka do rodzica, np. Piotr → Anna.',
      },
    ],
  },
  {
    id: 'FRAME_SYSTEM',
    name: 'System ramowy',
    description: 'Relacje ogólne przydatne przy modelowaniu klas i obiektów.',
    relations: [
      {
        id: 'inherits-from',
        label: 'dziedziczy po',
        type: 'INHERITS_FROM',
        category: 'FRAME_SYSTEM',
        description: 'Relacja dziedziczenia między klasami.',
      },
      {
        id: 'instance-of',
        label: 'instancja klasy',
        type: 'INSTANCE_OF',
        category: 'FRAME_SYSTEM',
        description: 'Relacja między obiektem a klasą.',
      },
      {
        id: 'association',
        label: 'powiązany z',
        type: 'ASSOCIATION',
        category: 'FRAME_SYSTEM',
        description: 'Ogólna relacja asocjacyjna.',
      },
    ],
  },
];
