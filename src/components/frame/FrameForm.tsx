import { useState } from 'react';
import type { Frame, FrameType } from '../../types/frame';

interface FrameFormProps {
  onSubmit: (frame: Frame) => void;
  onCancel: () => void;
}

function FrameForm({ onSubmit, onCancel }: FrameFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FrameType>('CLASS');
  const [description, setDescription] = useState('');
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newFrame: Frame = {
      id: crypto.randomUUID(),
      name,
      type,
      description,
      parentIds: [],
      childIds: [],
      slots: [],
      relations: [],
    };

    onSubmit(newFrame);

    setName('');
    setType('CLASS');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
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
