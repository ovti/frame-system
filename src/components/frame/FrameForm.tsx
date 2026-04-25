import { useState } from 'react';
import type { Frame, FrameSlot, FrameType } from '../../types/frame';
import SlotForm from './SlotForm';

interface FrameFormProps {
  onSubmit: (frame: Frame) => void;
  onCancel: () => void;
}

function FrameForm({ onSubmit, onCancel }: FrameFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FrameType>('CLASS');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState<FrameSlot[]>([]);

  const handleAddSlot = () => {
    setSlots((previousSlots) => [
      ...previousSlots,
      {
        id: crypto.randomUUID(),
        name: '',
        aspects: [],
        demons: [],
      },
    ]);
  };

  const handleUpdateSlot = (slotId: string, updatedSlot: FrameSlot) => {
    setSlots((previousSlots) =>
      previousSlots.map((slot) => (slot.id === slotId ? updatedSlot : slot)),
    );
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots((previousSlots) =>
      previousSlots.filter((slot) => slot.id !== slotId),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newFrame: Frame = {
      id: crypto.randomUUID(),
      name,
      type,
      description,
      parentIds: [],
      childIds: [],
      slots,
      relations: [],
    };

    onSubmit(newFrame);

    setName('');
    setType('CLASS');
    setDescription('');
    setSlots([]);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Nazwa ramki
        </label>

        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
          placeholder='Np. Komputer'
          required
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Typ ramki
        </label>

        <select
          value={type}
          onChange={(event) => setType(event.target.value as FrameType)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
        >
          <option value='CLASS'>CLASS</option>
          <option value='OBJECT'>OBJECT</option>
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Opis
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className='min-h-[120px] w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
          placeholder='Krótki opis ramki'
        />
      </div>

      <div className='space-y-4 border-t border-slate-200 pt-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>Klatki</h3>
            <p className='text-sm text-slate-500'>
              Dodaj cechy ramki oraz ich aspekty.
            </p>
          </div>

          <button
            type='button'
            onClick={handleAddSlot}
            className='rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100'
          >
            Dodaj klatkę
          </button>
        </div>

        {slots.length === 0 ? (
          <p className='rounded-xl bg-slate-50 p-4 text-sm text-slate-500'>
            Brak klatek. Możesz utworzyć ramkę bez klatek albo dodać je teraz.
          </p>
        ) : (
          <div className='space-y-4'>
            {slots.map((slot) => (
              <SlotForm
                key={slot.id}
                slot={slot}
                onChange={(updatedSlot) =>
                  handleUpdateSlot(slot.id, updatedSlot)
                }
                onRemove={() => handleRemoveSlot(slot.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100'
        >
          Anuluj
        </button>

        <button
          type='submit'
          className='rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700'
        >
          Zapisz ramkę
        </button>
      </div>
    </form>
  );
}

export default FrameForm;
