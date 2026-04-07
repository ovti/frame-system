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
              'Sprawdź, czy napięcie mieści się w dopuszczalnym zakresie.',
          },
        ],
      },
      {
        id: 'slot-2',
        name: 'Temperatura pracy',
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
          {
            id: 'aspect-6',
            type: 'DEFAULT',
            value: '25 °C',
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
            id: 'aspect-7',
            type: 'VALUE',
            value: '16 GB',
          },
          {
            id: 'aspect-8',
            type: 'RANGE',
            value: '8-64 GB',
          },
          {
            id: 'aspect-9',
            type: 'DEFAULT',
            value: '8 GB',
          },
        ],
      },
      {
        id: 'slot-4',
        name: 'Procesor',
        aspects: [
          {
            id: 'aspect-10',
            type: 'VALUE',
            value: 'Apple M1 Pro',
          },
          {
            id: 'aspect-11',
            type: 'DEFAULT',
            value: 'Apple M1 Pro',
          },
        ],
      },
    ],
    relations: [],
  },
  {
    id: '3',
    name: 'Laptop Macbook Pro',
    type: 'OBJECT',
    description: 'Konkretny egzemplarz laptopa.',
    parentIds: ['2'],
    childIds: [],
    slots: [
      {
        id: 'slot-5',
        name: 'Numer seryjny',
        aspects: [
          {
            id: 'aspect-12',
            type: 'VALUE',
            value: 'C02ZQ0K6MD6L',
          },
        ],
      },
      {
        id: 'slot-6',
        name: 'Bateria',
        aspects: [
          {
            id: 'aspect-13',
            type: 'VALUE',
            value: '82%',
          },
          {
            id: 'aspect-14',
            type: 'RANGE',
            value: '0-100%',
          },
          {
            id: 'aspect-15',
            type: 'DEFAULT',
            value: '100%',
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
    relations: [],
  },
];
