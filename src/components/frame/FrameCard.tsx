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

  return (
    <div
      onClick={onClick}
      className='cursor-pointer rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md'
    >
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>{frame.name}</h3>

          <p className='mt-1 text-sm text-slate-500'>Type: {frame.type}</p>
        </div>

        <span className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'>
          {frame.slots.length} slots
        </span>
      </div>

      <p className='mb-4 text-sm text-slate-600'>{frame.description}</p>

      <div className='mb-4 flex flex-wrap gap-2'>
        {frame.slots.slice(0, 3).map((slot) => (
          <span
            key={slot.id}
            className='rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700'
          >
            {slot.name}
          </span>
        ))}
      </div>

      <div className='flex justify-end'>
        <button
          type='button'
          onClick={handleDeleteClick}
          className='rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50'
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default FrameCard;
