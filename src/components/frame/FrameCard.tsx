import type { MouseEvent } from 'react';
import { dangerButtonClass } from '../../styles/uiClasses';
import type { Frame } from '../../types/frame';
import { formatCount } from '../../utils/pluralize';

interface FrameCardProps {
  frame: Frame;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FrameCard({ frame, onClick, onEdit, onDelete }: FrameCardProps) {
  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  const secondaryButtonClass =
    'w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-200 sm:w-auto';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white p-5 text-left shadow-sm transition focus-within:ring-2 focus-within:ring-slate-300 hover:bg-slate-50 hover:shadow-md sm:p-6 sm:hover:-translate-y-1"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold wrap-break-word text-slate-900 sm:text-xl">
            {frame.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">Type: {frame.type}</p>
        </div>

        <span className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {formatCount(frame.slots.length, 'slot')}
        </span>
      </div>

      <p className="mb-4 text-sm leading-6 wrap-break-word text-slate-600">
        {frame.description || 'No description'}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {frame.slots.slice(0, 3).map((slot) => (
          <span
            key={slot.id}
            className="max-w-full rounded-full bg-slate-200 px-3 py-1 text-xs font-medium wrap-break-word text-slate-700"
          >
            {slot.name}
          </span>
        ))}

        {frame.slots.length > 3 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            +{frame.slots.length - 3} more
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleEditClick}
          className={secondaryButtonClass}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDeleteClick}
          className={dangerButtonClass}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default FrameCard;
