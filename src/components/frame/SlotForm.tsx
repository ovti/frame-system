import type { AspectType, DemonType, FrameSlot } from '../../types/frame';

interface SlotFormProps {
  slot: FrameSlot;
  onChange: (slot: FrameSlot) => void;
  onRemove: () => void;
}

const SLOT_NAME_MAX_LENGTH = 60;
const ASPECT_VALUE_MAX_LENGTH = 120;
const DEMON_DESCRIPTION_MAX_LENGTH = 180;
const MAX_ASPECTS_PER_SLOT = 10;
const MAX_DEMONS_PER_SLOT = 8;

function SlotForm({ slot, onChange, onRemove }: SlotFormProps) {
  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-300';

  const amberInputClass =
    'w-full rounded-lg border border-amber-200 px-3 py-2 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

  const secondaryButtonClass =
    'w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto';

  const dangerButtonClass =
    'w-full cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:bg-red-100 sm:w-auto';

  const helperTextClass = 'mt-1 text-xs text-slate-400';

  const handleAddAspect = () => {
    if (slot.aspects.length >= MAX_ASPECTS_PER_SLOT) return;

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
    const nextValue =
      field === 'value' ? value.slice(0, ASPECT_VALUE_MAX_LENGTH) : value;

    onChange({
      ...slot,
      aspects: slot.aspects.map((aspect) =>
        aspect.id === aspectId
          ? {
              ...aspect,
              [field]: field === 'type' ? (nextValue as AspectType) : nextValue,
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
    if ((slot.demons ?? []).length >= MAX_DEMONS_PER_SLOT) return;

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
    const nextValue =
      field === 'description'
        ? value.slice(0, DEMON_DESCRIPTION_MAX_LENGTH)
        : value;

    onChange({
      ...slot,
      demons: (slot.demons ?? []).map((demon) =>
        demon.id === demonId
          ? {
              ...demon,
              [field]: field === 'type' ? (nextValue as DemonType) : nextValue,
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

  const handleSlotNameChange = (value: string) => {
    onChange({
      ...slot,
      name: value.slice(0, SLOT_NAME_MAX_LENGTH),
    });
  };

  const demons = slot.demons ?? [];

  return (
    <div className='space-y-5 rounded-2xl border border-slate-200 p-3 sm:p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h4 className='font-semibold text-slate-900'>Slot</h4>

        <button type='button' onClick={onRemove} className={dangerButtonClass}>
          Remove slot
        </button>
      </div>

      <div>
        <label className='mb-1 block text-sm font-medium text-slate-700'>
          Slot name
        </label>

        <input
          type='text'
          value={slot.name}
          onChange={(event) => handleSlotNameChange(event.target.value)}
          className={inputClass}
          placeholder='E.g. Voltage'
          maxLength={SLOT_NAME_MAX_LENGTH}
          required
        />

        <p className={helperTextClass}>
          {slot.name.length}/{SLOT_NAME_MAX_LENGTH} characters
        </p>
      </div>

      <div className='space-y-3'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h5 className='font-medium text-slate-900'>Aspects</h5>
            <p className='text-sm text-slate-500'>
              Add values, ranges, defaults, or other aspect data.
            </p>

            <p className={helperTextClass}>
              {slot.aspects.length}/{MAX_ASPECTS_PER_SLOT} aspects
            </p>
          </div>

          <button
            type='button'
            onClick={handleAddAspect}
            className={secondaryButtonClass}
            disabled={slot.aspects.length >= MAX_ASPECTS_PER_SLOT}
          >
            Add aspect
          </button>
        </div>

        {slot.aspects.length === 0 ? (
          <p className='rounded-xl bg-slate-50 p-3 text-sm text-slate-500'>
            No aspects.
          </p>
        ) : (
          <div className='space-y-3'>
            {slot.aspects.map((aspect) => (
              <div
                key={aspect.id}
                className='grid gap-2 rounded-xl bg-slate-50 p-3 lg:grid-cols-[160px_1fr_auto]'
              >
                <select
                  value={aspect.type}
                  onChange={(event) =>
                    handleAspectChange(aspect.id, 'type', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value='VALUE'>VALUE</option>
                  <option value='RANGE'>RANGE</option>
                  <option value='DEFAULT'>DEFAULT</option>
                </select>

                <div>
                  <input
                    type='text'
                    value={aspect.value}
                    onChange={(event) =>
                      handleAspectChange(aspect.id, 'value', event.target.value)
                    }
                    className={inputClass}
                    placeholder='E.g. 230 V'
                    maxLength={ASPECT_VALUE_MAX_LENGTH}
                    required
                  />

                  <p className={helperTextClass}>
                    {aspect.value.length}/{ASPECT_VALUE_MAX_LENGTH} characters
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => handleRemoveAspect(aspect.id)}
                  className={dangerButtonClass}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='space-y-3 border-t border-slate-200 pt-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h5 className='font-medium text-slate-900'>Demons</h5>
            <p className='text-sm text-slate-500'>
              Add procedural attachments connected with the slot.
            </p>

            <p className={helperTextClass}>
              {demons.length}/{MAX_DEMONS_PER_SLOT} demons
            </p>
          </div>

          <button
            type='button'
            onClick={handleAddDemon}
            className={secondaryButtonClass}
            disabled={demons.length >= MAX_DEMONS_PER_SLOT}
          >
            Add demon
          </button>
        </div>

        {demons.length === 0 ? (
          <p className='rounded-xl bg-slate-50 p-3 text-sm text-slate-500'>
            No demons.
          </p>
        ) : (
          <div className='space-y-3'>
            {demons.map((demon) => (
              <div
                key={demon.id}
                className='grid gap-2 rounded-xl bg-amber-50 p-3 lg:grid-cols-[180px_1fr_auto]'
              >
                <select
                  value={demon.type}
                  onChange={(event) =>
                    handleDemonChange(demon.id, 'type', event.target.value)
                  }
                  className={amberInputClass}
                >
                  <option value='IF_NEEDED'>IF_NEEDED</option>
                  <option value='IF_ADDED'>IF_ADDED</option>
                  <option value='IF_UPDATED'>IF_UPDATED</option>
                  <option value='IF_REMOVED'>IF_REMOVED</option>
                  <option value='IF_READ'>IF_READ</option>
                  <option value='IF_NEW'>IF_NEW</option>
                </select>

                <div>
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
                    className={amberInputClass}
                    placeholder='Describe the demon behavior'
                    maxLength={DEMON_DESCRIPTION_MAX_LENGTH}
                    required
                  />

                  <p className='mt-1 text-xs text-amber-600'>
                    {demon.description.length}/{DEMON_DESCRIPTION_MAX_LENGTH}{' '}
                    characters
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => handleRemoveDemon(demon.id)}
                  className={dangerButtonClass}
                >
                  Remove
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
