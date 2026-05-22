import { useState } from 'react';
import Modal from '../components/common/Modal';
import RelationForm from '../relation/RelationForm';
import { useFrameStore } from '../store/frameStore';
import type { Relation } from '../types/relation';

function RelationsPage() {
  const { frames, relations, addRelation, deleteRelation } = useFrameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFrameName = (frameId: string) =>
    frames.find((frame) => frame.id === frameId)?.name ?? frameId;

  const handleCreateRelation = (relation: Relation) => {
    addRelation(relation);
    setIsModalOpen(false);
  };

  const primaryButtonClass =
    'w-full cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950 sm:w-auto';

  const dangerButtonClass =
    'w-full cursor-pointer rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 active:bg-red-100 sm:w-auto';

  return (
    <div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold sm:text-3xl'>Relations</h2>
          <p className='mt-1 text-sm text-slate-500 sm:text-base'>
            Connections between frames
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsModalOpen(true)}
          className={primaryButtonClass}
        >
          Add relation
        </button>
      </div>

      <div className='space-y-3'>
        {relations.length === 0 ? (
          <div className='rounded-2xl bg-white p-5 shadow-sm sm:p-6'>
            <p className='text-sm text-slate-500 sm:text-base'>
              No relations available.
            </p>
          </div>
        ) : (
          relations.map((relation) => (
            <div
              key={relation.id}
              className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'
            >
              <div className='min-w-0'>
                <div className='mb-1 flex flex-wrap items-center gap-2'>
                  <p className='break-words font-semibold text-slate-900'>
                    {relation.relationName ?? relation.label}
                  </p>

                  {relation.category && (
                    <span className='rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                      {relation.category}
                    </span>
                  )}
                </div>

                <p className='break-words text-sm text-slate-500'>
                  {getFrameName(relation.sourceId)} →{' '}
                  {getFrameName(relation.targetId)}
                </p>

                <div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400'>
                  <p>Technical type: {relation.type}</p>

                  {relation.relationName && <p>Edge label: {relation.label}</p>}
                </div>
              </div>

              <button
                type='button'
                onClick={() => deleteRelation(relation.id)}
                className={dangerButtonClass}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Add relation</h2>
        </div>

        <RelationForm
          frames={frames}
          onSubmit={handleCreateRelation}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default RelationsPage;
