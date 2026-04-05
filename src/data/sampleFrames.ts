import type { Frame } from '../types/frame';

export const sampleFrames: Frame[] = [
  {
    id: '1',
    name: 'Student',
    type: 'Object',
    description: 'Reprezentuje studenta uczestniczącego w zajęciach.',
    attributes: [
      { key: 'Imię', value: 'Jan' },
      { key: 'Numer indeksu', value: '123456' },
    ],
    relations: [
      {
        id: 'r1',
        sourceId: '1',
        targetId: '2',
        label: 'uczestniczy w',
      },
    ],
  },
  {
    id: '2',
    name: 'Przedmiot',
    type: 'Object',
    description: 'Reprezentuje przedmiot na studiach.',
    attributes: [
      { key: 'Nazwa', value: 'Algorytmy i Struktury Danych' },
      { key: 'Semestr', value: '4' },
    ],
    relations: [
      {
        id: 'r2',
        sourceId: '2',
        targetId: '3',
        label: 'prowadzony przez',
      },
    ],
  },
  {
    id: '3',
    name: 'Prowadzący',
    type: 'Person',
    description: 'Reprezentuje prowadzącego zajęcia.',
    attributes: [
      { key: 'Imię', value: 'Anna' },
      { key: 'Tytuł', value: 'dr inż.' },
    ],
    relations: [],
  },
];
