import { useFrameStore } from '../../store/frameStore';
import type { Frame } from '../../types/frame';
import Modal from '../common/Modal';

interface FrameDetailsModalProps {
  frame: Frame | null;
  isOpen: boolean;
  onClose: () => void;
}

function FrameDetailsModal({ frame, isOpen, onClose }: FrameDetailsModalProps) {
  const { frames, relations } = useFrameStore();

  if (!frame) return null;

  const relatedRelations = relations.filter(
    (relation) =>
      relation.sourceId === frame.id || relation.targetId === frame.id,
  );

  const getFrameName = (frameId: string) => {
    return frames.find((item) => item.id === frameId)?.name ?? frameId;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-8'>
        <div>
          <div className='flex items-center gap-3'>
            <h3 className='text-2xl font-bold text-slate-900'>{frame.name}</h3>

            <span className='rounded-full bg-slate-900 px-3 py-1 text-sm text-white'>
              {frame.type}
            </span>
          </div>

          <p className='mt-2 text-slate-600'>
            {frame.description || 'Brak opisu'}
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-xl border border-slate-200 p-4'>
            <h4 className='mb-2 font-semibold text-slate-900'>Dziedziczy po</h4>

            {frame.parentIds.length === 0 ? (
              <p className='text-slate-500'>Brak nadrzędnych ramek</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {frame.parentIds.map((parentId) => (
                  <span
                    key={parentId}
                    className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'
                  >
                    {getFrameName(parentId)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='rounded-xl border border-slate-200 p-4'>
            <h4 className='mb-2 font-semibold text-slate-900'>
              Ramki podrzędne
            </h4>

            {frame.childIds.length === 0 ? (
              <p className='text-slate-500'>Brak podrzędnych ramek</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {frame.childIds.map((childId) => (
                  <span
                    key={childId}
                    className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'
                  >
                    {getFrameName(childId)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className='mb-4 text-lg font-semibold text-slate-900'>Klatki</h4>

          <div className='space-y-4'>
            {frame.slots.map((slot) => (
              <div
                key={slot.id}
                className='rounded-2xl border border-slate-200 p-4'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <h5 className='text-lg font-semibold text-slate-900'>
                    {slot.name}
                  </h5>

                  <span className='rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600'>
                    {slot.aspects.length} aspektów
                  </span>
                </div>

                <div className='space-y-2'>
                  {slot.aspects.map((aspect) => (
                    <div
                      key={aspect.id}
                      className='flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2'
                    >
                      <span className='font-medium text-slate-700'>
                        {aspect.type}
                      </span>

                      <span className='text-slate-600'>{aspect.value}</span>
                    </div>
                  ))}
                </div>

                {slot.demons && slot.demons.length > 0 && (
                  <div className='mt-4 border-t border-slate-200 pt-4'>
                    <h6 className='mb-2 font-semibold text-slate-900'>
                      Demony
                    </h6>

                    <div className='space-y-2'>
                      {slot.demons.map((demon) => (
                        <div
                          key={demon.id}
                          className='rounded-lg border border-amber-200 bg-amber-50 px-4 py-3'
                        >
                          <p className='font-medium text-amber-900'>
                            {demon.type}
                          </p>

                          <p className='mt-1 text-sm text-amber-800'>
                            {demon.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className='mb-4 text-lg font-semibold text-slate-900'>Relacje</h4>

          {relatedRelations.length === 0 ? (
            <p className='text-slate-500'>Brak relacji</p>
          ) : (
            <div className='space-y-2'>
              {relatedRelations.map((relation) => (
                <div
                  key={relation.id}
                  className='rounded-lg border border-slate-200 px-4 py-3'
                >
                  <p className='font-medium text-slate-900'>{relation.label}</p>

                  <p className='mt-1 text-sm text-slate-500'>
                    {getFrameName(relation.sourceId)} →{' '}
                    {getFrameName(relation.targetId)}
                  </p>

                  <p className='mt-1 text-xs text-slate-400'>
                    Typ: {relation.type}
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
