import { useState } from 'react';
import type { Frame } from '../types/frame';
import type { Relation, RelationType } from '../types/relation';

interface RelationFormProps {
  frames: Frame[];
  onSubmit: (relation: Relation) => void;
  onCancel: () => void;
}

function RelationForm({ frames, onSubmit, onCancel }: RelationFormProps) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState<RelationType>('ASSOCIATION');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!sourceId || !targetId) {
      setError('Wybierz ramkę źródłową i docelową.');
      return;
    }

    if (sourceId === targetId) {
      setError('Nie można utworzyć relacji ramki do samej siebie.');
      return;
    }

    const sourceFrame = frames.find((frame) => frame.id === sourceId);
    const targetFrame = frames.find((frame) => frame.id === targetId);

    if (!sourceFrame || !targetFrame) {
      setError('Nie znaleziono wybranych ramek.');
      return;
    }

    if (
      type === 'INHERITS_FROM' &&
      (sourceFrame.type !== 'CLASS' || targetFrame.type !== 'CLASS')
    ) {
      setError('Relacja INHERITS_FROM jest dozwolona tylko między klasami.');
      return;
    }

    if (
      type === 'INSTANCE_OF' &&
      (sourceFrame.type !== 'OBJECT' || targetFrame.type !== 'CLASS')
    ) {
      setError('Relacja INSTANCE_OF wymaga układu OBJECT -> CLASS.');
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      sourceId,
      targetId,
      label,
      type,
    });

    setSourceId('');
    setTargetId('');
    setLabel('');
    setType('ASSOCIATION');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Rama źródłowa
        </label>
        <select
          value={sourceId}
          onChange={(event) => setSourceId(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2'
          required
        >
          <option value=''>Wybierz</option>
          {frames.map((frame) => (
            <option key={frame.id} value={frame.id}>
              {frame.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Rama docelowa
        </label>
        <select
          value={targetId}
          onChange={(event) => setTargetId(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2'
          required
        >
          <option value=''>Wybierz</option>
          {frames.map((frame) => (
            <option key={frame.id} value={frame.id}>
              {frame.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Typ relacji
        </label>
        <select
          value={type}
          onChange={(event) => setType(event.target.value as RelationType)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2'
        >
          <option value='ASSOCIATION'>ASSOCIATION</option>
          <option value='INSTANCE_OF'>INSTANCE_OF</option>
          <option value='INHERITS_FROM'>INHERITS_FROM</option>
        </select>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Etykieta
        </label>
        <input
          type='text'
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2'
          placeholder='Np. dziedziczy po'
          required
        />
      </div>

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      <div className='flex justify-end gap-3'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-xl border border-slate-300 px-4 py-2'
        >
          Anuluj
        </button>

        <button
          type='submit'
          className='rounded-xl bg-slate-900 px-4 py-2 text-white'
        >
          Zapisz relację
        </button>
      </div>
    </form>
  );
}

export default RelationForm;
