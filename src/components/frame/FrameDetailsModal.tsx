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

  const getAspectCountLabel = (count: number) => {
    return count === 1 ? '1 aspect' : `${count} aspects`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='space-y-6 sm:space-y-8'>
        <div>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
            <h3 className='break-words text-xl font-bold text-slate-900 sm:text-2xl'>
              {frame.name}
            </h3>

            <span className='w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white sm:text-sm'>
              {frame.type}
            </span>
          </div>

          <p className='mt-2 break-words text-sm leading-6 text-slate-600 sm:text-base'>
            {frame.description || 'No description'}
          </p>
        </div>

        <div className='grid gap-3 sm:gap-4 md:grid-cols-2'>
          <div className='rounded-xl border border-slate-200 p-3 sm:p-4'>
            <h4 className='mb-2 text-sm font-semibold text-slate-900 sm:text-base'>
              Inherits from
            </h4>

            {frame.parentIds.length === 0 ? (
              <p className='text-sm text-slate-500'>N/A</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {frame.parentIds.map((parentId) => (
                  <span
                    key={parentId}
                    className='max-w-full break-words rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'
                  >
                    {getFrameName(parentId)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='rounded-xl border border-slate-200 p-3 sm:p-4'>
            <h4 className='mb-2 text-sm font-semibold text-slate-900 sm:text-base'>
              Child frames
            </h4>

            {frame.childIds.length === 0 ? (
              <p className='text-sm text-slate-500'>N/A</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {frame.childIds.map((childId) => (
                  <span
                    key={childId}
                    className='max-w-full break-words rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700'
                  >
                    {getFrameName(childId)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className='mb-3 text-base font-semibold text-slate-900 sm:mb-4 sm:text-lg'>
            Slots
          </h4>

          <div className='space-y-3 sm:space-y-4'>
            {frame.slots.length === 0 ? (
              <p className='text-sm text-slate-500 sm:text-base'>No slots</p>
            ) : (
              frame.slots.map((slot) => (
                <div
                  key={slot.id}
                  className='rounded-2xl border border-slate-200 p-3 sm:p-4'
                >
                  <div className='mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between'>
                    <h5 className='break-words text-base font-semibold text-slate-900 sm:text-lg'>
                      {slot.name}
                    </h5>

                    <span className='w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 sm:text-sm'>
                      {getAspectCountLabel(slot.aspects.length)}
                    </span>
                  </div>

                  <div className='space-y-2'>
                    {slot.aspects.map((aspect) => (
                      <div
                        key={aspect.id}
                        className='flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4'
                      >
                        <span className='font-medium text-slate-700'>
                          {aspect.type}
                        </span>

                        <span className='break-words text-slate-600 sm:text-right'>
                          {aspect.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {slot.demons && slot.demons.length > 0 && (
                    <div className='mt-4 border-t border-slate-200 pt-4'>
                      <h6 className='mb-2 text-sm font-semibold text-slate-900 sm:text-base'>
                        Demons
                      </h6>

                      <div className='space-y-2'>
                        {slot.demons.map((demon) => (
                          <div
                            key={demon.id}
                            className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:px-4 sm:py-3'
                          >
                            <p className='break-words text-sm font-medium text-amber-900 sm:text-base'>
                              {demon.type}
                            </p>

                            <p className='mt-1 break-words text-xs leading-5 text-amber-800 sm:text-sm'>
                              {demon.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className='mb-3 text-base font-semibold text-slate-900 sm:mb-4 sm:text-lg'>
            Relations
          </h4>

          {relatedRelations.length === 0 ? (
            <p className='text-sm text-slate-500 sm:text-base'>No relations</p>
          ) : (
            <div className='space-y-2'>
              {relatedRelations.map((relation) => (
                <div
                  key={relation.id}
                  className='rounded-lg border border-slate-200 px-3 py-3 sm:px-4'
                >
                  <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='break-words font-medium text-slate-900'>
                      {relation.relationName ?? relation.label}
                    </p>

                    {relation.category && (
                      <span className='w-fit rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                        {relation.category}
                      </span>
                    )}
                  </div>

                  <p className='mt-1 break-words text-sm text-slate-500'>
                    {getFrameName(relation.sourceId)} →{' '}
                    {getFrameName(relation.targetId)}
                  </p>

                  <div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400'>
                    <p>Type: {relation.label}</p>

                    <p>Technical type: {relation.type}</p>
                  </div>
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
