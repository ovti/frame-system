import type { Frame } from '../../types/frame';
import Modal from '../common/Modal';

interface FrameDetailsModalProps {
  frame: Frame | null;
  isOpen: boolean;
  onClose: () => void;
}

function FrameDetailsModal({ frame, isOpen, onClose }: FrameDetailsModalProps) {
  if (!frame) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-6'>
        <div>
          <h3 className='text-2xl font-bold text-slate-900'>{frame.name}</h3>

          <p className='mt-1 text-slate-500'>Typ: {frame.type}</p>
        </div>

        <div>
          <h4 className='mb-2 text-lg font-semibold'>Opis</h4>
          <p className='text-slate-600'>{frame.description || 'Brak opisu'}</p>
        </div>

        <div>
          <h4 className='mb-2 text-lg font-semibold'>Atrybuty</h4>

          <div className='space-y-2'>
            {frame.attributes.map((attribute) => (
              <div
                key={attribute.key}
                className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2'
              >
                <span className='font-medium text-slate-700'>
                  {attribute.key}
                </span>

                <span className='text-slate-500'>{attribute.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-2 text-lg font-semibold'>Relacje</h4>

          {frame.relations.length === 0 ? (
            <p className='text-slate-500'>Brak relacji</p>
          ) : (
            <div className='space-y-2'>
              {frame.relations.map((relation) => (
                <div
                  key={relation.id}
                  className='rounded-lg border border-slate-200 px-4 py-2'
                >
                  <p className='font-medium text-slate-700'>{relation.label}</p>

                  <p className='text-sm text-slate-500'>
                    {relation.sourceId} → {relation.targetId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default FrameDetailsModal;
