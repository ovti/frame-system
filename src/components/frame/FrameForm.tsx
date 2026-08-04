import { useState } from 'react';
import type { Frame, FrameSlot, FrameType } from '../../types/frame';
import SlotForm from './SlotForm';

interface FrameFormProps {
  initialFrame?: Frame | null;
  onSubmit: (frame: Frame) => void;
  onCancel: () => void;
}

const FRAME_NAME_MAX_LENGTH = 60;
const FRAME_DESCRIPTION_MAX_LENGTH = 300;
const MAX_SLOTS_PER_FRAME = 12;

function FrameForm({
  initialFrame = null,
  onSubmit,
  onCancel,
}: FrameFormProps) {
  const [name, setName] = useState(initialFrame?.name ?? '');
  const [type, setType] = useState<FrameType>(initialFrame?.type ?? 'CLASS');
  const [description, setDescription] = useState(
    initialFrame?.description ?? '',
  );
  const [slots, setSlots] = useState<FrameSlot[]>(initialFrame?.slots ?? []);
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialFrame);

  const formId = initialFrame?.id ?? 'new-frame';
  const frameNameInputId = `frame-name-${formId}`;
  const frameTypeInputId = `frame-type-${formId}`;
  const frameDescriptionInputId = `frame-description-${formId}`;

  const secondaryButtonClass =
    'w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto';

  const primaryButtonClass =
    'w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950 sm:w-auto';

  const inputClass =
    'w-full rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-300';

  const helperTextClass = 'mt-1 text-xs text-slate-400';

  const getSlotCountLabel = (count: number) => {
    return count === 1 ? 'slot' : 'slots';
  };

  const handleAddSlot = () => {
    setError('');

    if (slots.length >= MAX_SLOTS_PER_FRAME) {
      setError(`A frame can contain up to ${MAX_SLOTS_PER_FRAME} slots.`);
      return;
    }

    setSlots((previousSlots) => [
      ...previousSlots,
      {
        id: crypto.randomUUID(),
        name: '',
        facets: [],
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
    setError('');

    setSlots((previousSlots) =>
      previousSlots.filter((slot) => slot.id !== slotId),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError('Frame name is required.');
      return;
    }

    if (trimmedName.length > FRAME_NAME_MAX_LENGTH) {
      setError(
        `Frame name can contain up to ${FRAME_NAME_MAX_LENGTH} characters.`,
      );
      return;
    }

    if (trimmedDescription.length > FRAME_DESCRIPTION_MAX_LENGTH) {
      setError(
        `Description can contain up to ${FRAME_DESCRIPTION_MAX_LENGTH} characters.`,
      );
      return;
    }

    const hasInvalidSlot = slots.some((slot) => !slot.name.trim());

    if (hasInvalidSlot) {
      setError('Each slot must have a name.');
      return;
    }

    const frame: Frame = {
      id: initialFrame?.id ?? crypto.randomUUID(),
      name: trimmedName,
      type,
      description: trimmedDescription,
      parentIds: initialFrame?.parentIds ?? [],
      childIds: initialFrame?.childIds ?? [],
      slots: slots.map((slot) => ({
        ...slot,
        name: slot.name.trim(),
        facets: slot.facets.map((facet) => ({
          ...facet,
          value: facet.value.trim(),
        })),
        demons: (slot.demons ?? []).map((demon) => ({
          ...demon,
          description: demon.description.trim(),
        })),
      })),
    };

    onSubmit(frame);

    if (!isEditMode) {
      setName('');
      setType('CLASS');
      setDescription('');
      setSlots([]);
    }

    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor={frameNameInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Frame name
        </label>

        <input
          id={frameNameInputId}
          name="frameName"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          className={inputClass}
          placeholder="E.g. Computer"
          maxLength={FRAME_NAME_MAX_LENGTH}
          required
        />

        <p className={helperTextClass}>
          {name.length}/{FRAME_NAME_MAX_LENGTH} characters
        </p>
      </div>

      <div>
        <label
          htmlFor={frameTypeInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Frame type
        </label>

        <select
          id={frameTypeInputId}
          name="frameType"
          value={type}
          onChange={(event) => setType(event.target.value as FrameType)}
          className={inputClass}
        >
          <option value="CLASS">CLASS</option>
          <option value="OBJECT">OBJECT</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={frameDescriptionInputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id={frameDescriptionInputId}
          name="frameDescription"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            setError('');
          }}
          className={`${inputClass} min-h-30 resize-y`}
          placeholder="Short frame description"
          maxLength={FRAME_DESCRIPTION_MAX_LENGTH}
        />

        <p className={helperTextClass}>
          {description.length}/{FRAME_DESCRIPTION_MAX_LENGTH} characters
        </p>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Slots
            </h3>

            <p className="text-sm text-slate-500">
              Add frame features and their facets.
            </p>

            <p className={helperTextClass}>
              {slots.length}/{MAX_SLOTS_PER_FRAME}{' '}
              {getSlotCountLabel(slots.length)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSlot}
            className={secondaryButtonClass}
            disabled={slots.length >= MAX_SLOTS_PER_FRAME}
          >
            Add slot
          </button>
        </div>

        {slots.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
            No slots. You can create a frame without slots or add them now.
          </p>
        ) : (
          <div className="space-y-4">
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className={secondaryButtonClass}
        >
          Cancel
        </button>

        <button type="submit" className={primaryButtonClass}>
          {isEditMode ? 'Save changes' : 'Save frame'}
        </button>
      </div>
    </form>
  );
}

export default FrameForm;
