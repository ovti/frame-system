import type { Frame } from '../../types/frame';

interface FrameCardProps {
  frame: Frame;
  onClick: () => void;
}

function FrameCard({ frame, onClick }: FrameCardProps) {
  return (
    <button
      onClick={onClick}
      className='w-full rounded-2xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md'
    >
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>{frame.name}</h3>

          <p className='mt-1 text-sm text-slate-500'>Typ: {frame.type}</p>
        </div>

        <span className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'>
          {frame.slots.length} klatek
        </span>
      </div>

      <p className='mb-4 text-sm text-slate-600'>{frame.description}</p>

      <div className='flex flex-wrap gap-2'>
        {frame.slots.slice(0, 3).map((slot) => (
          <span
            key={slot.id}
            className='rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700'
          >
            {slot.name}
          </span>
        ))}
      </div>
    </button>
  );
}

export default FrameCard;
