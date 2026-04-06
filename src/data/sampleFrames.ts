import type { Frame } from '../types/frame';

export const sampleFrames: Frame[] = [
  {
    id: '1',
    name: 'Urządzenie',
    type: 'CLASS',
    description: 'Ogólna klasa urządzeń.',
    parentIds: [],
    childIds: ['2'],
    slots: [
      {
        id: 'slot-1',
        name: 'Napięcie elektryczne',
        aspects: [
          {
            id: 'aspect-1',
            type: 'VALUE',
            value: '230 V',
          },
          {
            id: 'aspect-2',
            type: 'RANGE',
            value: '220-240 V',
          },
          {
            id: 'aspect-3',
            type: 'DEFAULT',
            value: '230 V',
          },
        ],
        demons: [
          {
            id: 'demon-1',
            type: 'IF_UPDATED',
            description:
              'Sprawdź czy napięcie mieści się w dopuszczalnym zakresie.',
          },
        ],
      },
      {
        id: 'slot-2',
        name: 'Temperatura',
        aspects: [
          {
            id: 'aspect-4',
            type: 'VALUE',
            value: '35 °C',
          },
          {
            id: 'aspect-5',
            type: 'RANGE',
            value: '0-70 °C',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: '2',
    name: 'Komputer',
    type: 'CLASS',
    description: 'Klasa urządzeń komputerowych.',
    parentIds: ['1'],
    childIds: ['3'],
    slots: [
      {
        id: 'slot-3',
        name: 'Pamięć RAM',
        aspects: [
          {
            id: 'aspect-6',
            type: 'VALUE',
            value: '16 GB',
          },
          {
            id: 'aspect-7',
            type: 'DEFAULT',
            value: '8 GB',
          },
        ],
      },
    ],
    relations: [
      {
        id: 'relation-1',
        sourceId: '2',
        targetId: '1',
        label: 'dziedziczy po',
      },
    ],
  },
  {
    id: '3',
    name: 'Laptop Dell XPS',
    type: 'OBJECT',
    description: 'Konkretny egzemplarz laptopa.',
    parentIds: ['2'],
    childIds: [],
    slots: [
      {
        id: 'slot-4',
        name: 'Numer seryjny',
        aspects: [
          {
            id: 'aspect-8',
            type: 'VALUE',
            value: 'DXPS-2026-001',
          },
        ],
      },
      {
        id: 'slot-5',
        name: 'Bateria',
        aspects: [
          {
            id: 'aspect-9',
            type: 'VALUE',
            value: '82%',
          },
          {
            id: 'aspect-10',
            type: 'RANGE',
            value: '0-100%',
          },
        ],
        demons: [
          {
            id: 'demon-2',
            type: 'IF_READ',
            description: 'Pobierz aktualny poziom baterii z systemu.',
          },
        ],
      },
    ],
    relations: [
      {
        id: 'relation-2',
        sourceId: '3',
        targetId: '2',
        label: 'instancja klasy',
      },
    ],
  },
];
