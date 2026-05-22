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

  const secondaryButtonClass =
    'w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 sm:w-auto';

  const primaryButtonClass =
    'w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950 sm:w-auto';

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-300';

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
          Frame name
        </label>

        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          placeholder='E.g. Computer'
          required
        />
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Frame type
        </label>

        <select
          value={type}
          onChange={(event) => setType(event.target.value as FrameType)}
          className={inputClass}
        >
          <option value='CLASS'>CLASS</option>
          <option value='OBJECT'>OBJECT</option>
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={`${inputClass} min-h-[110px] resize-y sm:min-h-[120px]`}
          placeholder='Short frame description'
        />
      </div>

      <div className='space-y-4 border-t border-slate-200 pt-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h3 className='text-base font-semibold text-slate-900 sm:text-lg'>
              Slots
            </h3>

            <p className='text-sm text-slate-500'>
              Add frame features and their aspects.
            </p>
          </div>

          <button
            type='button'
            onClick={handleAddSlot}
            className={secondaryButtonClass}
          >
            Add slot
          </button>
        </div>

        {slots.length === 0 ? (
          <p className='rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500'>
            No slots. You can create a frame without slots or add them now.
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

      <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
        <button
          type='button'
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          Cancel
        </button>

        <button type='submit' className={primaryButtonClass}>
          Save frame
        </button>
      </div>
    </form>
  );
}

export default FrameForm;
