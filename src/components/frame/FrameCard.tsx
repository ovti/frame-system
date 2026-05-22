import type { MouseEvent } from 'react';
import type { Frame } from '../../types/frame';

interface FrameCardProps {
  frame: Frame;
  onClick: () => void;
  onDelete: () => void;
}

function FrameCard({ frame, onClick, onDelete }: FrameCardProps) {
  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete();
  };

  const dangerButtonClass =
    'w-full cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:bg-red-100 sm:w-auto';

  return (
    <div
      onClick={onClick}
      className='cursor-pointer rounded-2xl bg-white p-5 text-left shadow-sm transition hover:bg-slate-50 hover:shadow-md focus-within:ring-2 focus-within:ring-slate-300 sm:p-6 sm:hover:-translate-y-1'
    >
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
        <div className='min-w-0'>
          <h3 className='break-words text-lg font-bold text-slate-900 sm:text-xl'>
            {frame.name}
          </h3>

          <p className='mt-1 text-sm text-slate-500'>Type: {frame.type}</p>
        </div>

        <span className='w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'>
          {frame.slots.length} slots
        </span>
      </div>

      <p className='mb-4 break-words text-sm leading-6 text-slate-600'>
        {frame.description || 'No description'}
      </p>

      <div className='mb-4 flex flex-wrap gap-2'>
        {frame.slots.slice(0, 3).map((slot) => (
          <span
            key={slot.id}
            className='max-w-full break-words rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700'
          >
            {slot.name}
          </span>
        ))}

        {frame.slots.length > 3 && (
          <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500'>
            +{frame.slots.length - 3} more
          </span>
        )}
      </div>

      <div className='flex justify-end'>
        <button
          type='button'
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
