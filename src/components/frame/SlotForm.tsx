import type { AspectType, DemonType, FrameSlot } from '../../types/frame';

interface SlotFormProps {
  slot: FrameSlot;
  onChange: (slot: FrameSlot) => void;
  onRemove: () => void;
}

function SlotForm({ slot, onChange, onRemove }: SlotFormProps) {
  const handleAddAspect = () => {
    onChange({
      ...slot,
      aspects: [
        ...slot.aspects,
        {
          id: crypto.randomUUID(),
          type: 'VALUE',
          value: '',
        },
      ],
    });
  };

  const handleAspectChange = (
    aspectId: string,
    field: 'type' | 'value',
    value: string,
  ) => {
    onChange({
      ...slot,
      aspects: slot.aspects.map((aspect) =>
        aspect.id === aspectId
          ? {
              ...aspect,
              [field]: field === 'type' ? (value as AspectType) : value,
            }
          : aspect,
      ),
    });
  };

  const handleRemoveAspect = (aspectId: string) => {
    onChange({
      ...slot,
      aspects: slot.aspects.filter((aspect) => aspect.id !== aspectId),
    });
  };

  const handleAddDemon = () => {
    onChange({
      ...slot,
      demons: [
        ...(slot.demons ?? []),
        {
          id: crypto.randomUUID(),
          type: 'IF_NEEDED',
          description: '',
        },
      ],
    });
  };

  const handleDemonChange = (
    demonId: string,
    field: 'type' | 'description',
    value: string,
  ) => {
    onChange({
      ...slot,
      demons: (slot.demons ?? []).map((demon) =>
        demon.id === demonId
          ? {
              ...demon,
              [field]: field === 'type' ? (value as DemonType) : value,
            }
          : demon,
      ),
    });
  };

  const handleRemoveDemon = (demonId: string) => {
    onChange({
      ...slot,
      demons: (slot.demons ?? []).filter((demon) => demon.id !== demonId),
    });
  };

  return (
    <div className='space-y-5 rounded-2xl border border-slate-200 p-4'>
      <div className='flex items-center justify-between gap-4'>
        <h4 className='font-semibold text-slate-900'>Klatka</h4>

        <button
          type='button'
          onClick={onRemove}
          className='rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50'
        >
          Usuń klatkę
        </button>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Nazwa klatki
        </label>

        <input
          type='text'
          value={slot.name}
          onChange={(event) =>
            onChange({
              ...slot,
              name: event.target.value,
            })
          }
          className='w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900'
          placeholder='Np. Napięcie elektryczne'
          required
        />
      </div>

      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h5 className='font-medium text-slate-900'>Aspekty</h5>

          <button
            type='button'
            onClick={handleAddAspect}
            className='rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'
          >
            Dodaj aspekt
          </button>
        </div>

        {slot.aspects.length === 0 ? (
          <p className='text-sm text-slate-500'>Brak aspektów.</p>
        ) : (
          <div className='space-y-3'>
            {slot.aspects.map((aspect) => (
              <div
                key={aspect.id}
                className='grid gap-2 rounded-xl bg-slate-50 p-3 md:grid-cols-[160px_1fr_auto]'
              >
                <select
                  value={aspect.type}
                  onChange={(event) =>
                    handleAspectChange(aspect.id, 'type', event.target.value)
                  }
                  className='rounded-lg border border-slate-300 px-3 py-2'
                >
                  <option value='VALUE'>VALUE</option>
                  <option value='RANGE'>RANGE</option>
                  <option value='DEFAULT'>DEFAULT</option>
                </select>

                <input
                  type='text'
                  value={aspect.value}
                  onChange={(event) =>
                    handleAspectChange(aspect.id, 'value', event.target.value)
                  }
                  className='rounded-lg border border-slate-300 px-3 py-2'
                  placeholder='Np. 230 V'
                  required
                />

                <button
                  type='button'
                  onClick={() => handleRemoveAspect(aspect.id)}
                  className='rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50'
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-3 border-t border-slate-200 pt-4'>
        <div className='flex items-center justify-between'>
          <h5 className='font-medium text-slate-900'>Demony</h5>

          <button
            type='button'
            onClick={handleAddDemon}
            className='rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100'
          >
            Dodaj demona
          </button>
        </div>

        {(slot.demons ?? []).length === 0 ? (
          <p className='text-sm text-slate-500'>Brak demonów.</p>
        ) : (
          <div className='space-y-3'>
            {(slot.demons ?? []).map((demon) => (
              <div
                key={demon.id}
                className='grid gap-2 rounded-xl bg-amber-50 p-3 md:grid-cols-[180px_1fr_auto]'
              >
                <select
                  value={demon.type}
                  onChange={(event) =>
                    handleDemonChange(demon.id, 'type', event.target.value)
                  }
                  className='rounded-lg border border-amber-200 px-3 py-2'
                >
                  <option value='IF_NEEDED'>IF_NEEDED</option>
                  <option value='IF_ADDED'>IF_ADDED</option>
                  <option value='IF_UPDATED'>IF_UPDATED</option>
                  <option value='IF_REMOVED'>IF_REMOVED</option>
                  <option value='IF_READ'>IF_READ</option>
                  <option value='IF_NEW'>IF_NEW</option>
                </select>

                <input
                  type='text'
                  value={demon.description}
                  onChange={(event) =>
                    handleDemonChange(
                      demon.id,
                      'description',
                      event.target.value,
                    )
                  }
                  className='rounded-lg border border-amber-200 px-3 py-2'
                  placeholder='Opis działania demona'
                  required
                />

                <button
                  type='button'
                  onClick={() => handleRemoveDemon(demon.id)}
                  className='rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50'
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotForm;
