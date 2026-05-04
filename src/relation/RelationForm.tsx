import { useMemo, useState } from 'react';
import { relationPresetGroups } from '../data/relationPresets';
import type { Frame } from '../types/frame';
import type { Relation, RelationCategory } from '../types/relation';

interface RelationFormProps {
  frames: Frame[];
  onSubmit: (relation: Relation) => void;
  onCancel: () => void;
}

function RelationForm({ frames, onSubmit, onCancel }: RelationFormProps) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [category, setCategory] = useState<RelationCategory>('FAMILY');
  const [presetId, setPresetId] = useState('spouse');
  const [error, setError] = useState('');

  const selectedGroup = useMemo(() => {
    return (
      relationPresetGroups.find((group) => group.id === category) ??
      relationPresetGroups[0]
    );
  }, [category]);

  const selectedPreset = useMemo(() => {
    return (
      selectedGroup.relations.find((relation) => relation.id === presetId) ??
      selectedGroup.relations[0]
    );
  }, [selectedGroup, presetId]);

  const handleCategoryChange = (value: RelationCategory) => {
    const nextGroup =
      relationPresetGroups.find((group) => group.id === value) ??
      relationPresetGroups[0];

    setCategory(value);
    setPresetId(nextGroup.relations[0].id);
  };

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

    if (!selectedPreset) {
      setError('Wybierz typ relacji.');
      return;
    }

    const sourceFrame = frames.find((frame) => frame.id === sourceId);
    const targetFrame = frames.find((frame) => frame.id === targetId);

    if (!sourceFrame || !targetFrame) {
      setError('Nie znaleziono wybranych ramek.');
      return;
    }

    if (
      selectedPreset.type === 'INHERITS_FROM' &&
      (sourceFrame.type !== 'CLASS' || targetFrame.type !== 'CLASS')
    ) {
      setError('Relacja dziedziczenia jest dozwolona tylko między klasami.');
      return;
    }

    if (
      selectedPreset.type === 'INSTANCE_OF' &&
      (sourceFrame.type !== 'OBJECT' || targetFrame.type !== 'CLASS')
    ) {
      setError('Relacja instancji wymaga układu OBJECT → CLASS.');
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      sourceId,
      targetId,
      label: selectedPreset.label,
      type: selectedPreset.type,
      category: selectedPreset.category,
    });

    setSourceId('');
    setTargetId('');
    setCategory('FAMILY');
    setPresetId('spouse');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Zestaw relacji
        </label>

        <select
          value={category}
          onChange={(event) =>
            handleCategoryChange(event.target.value as RelationCategory)
          }
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
        >
          {relationPresetGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <p className='mt-1 text-sm text-slate-500'>
          {selectedGroup.description}
        </p>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Relacja
        </label>

        <select
          value={presetId}
          onChange={(event) => setPresetId(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
        >
          {selectedGroup.relations.map((relation) => (
            <option key={relation.id} value={relation.id}>
              {relation.label}
            </option>
          ))}
        </select>

        <p className='mt-1 text-sm text-slate-500'>
          {selectedPreset.description}
        </p>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Rama źródłowa
        </label>

        <select
          value={sourceId}
          onChange={(event) => setSourceId(event.target.value)}
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
          required
        >
          <option value=''>Wybierz ramkę źródłową</option>
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
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
          required
        >
          <option value=''>Wybierz ramkę docelową</option>
          {frames.map((frame) => (
            <option key={frame.id} value={frame.id}>
              {frame.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPreset && (
        <div className='rounded-xl bg-slate-50 p-4 text-sm text-slate-600'>
          <p className='font-medium text-slate-900'>Podgląd relacji</p>
          <p className='mt-1'>
            {sourceId
              ? frames.find((frame) => frame.id === sourceId)?.name
              : 'Źródło'}{' '}
            → {selectedPreset.label} →{' '}
            {targetId
              ? frames.find((frame) => frame.id === targetId)?.name
              : 'Cel'}
          </p>
        </div>
      )}

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
          {error}
        </div>
      )}

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
          Zapisz relację
        </button>
      </div>
    </form>
  );
}

export default RelationForm;
