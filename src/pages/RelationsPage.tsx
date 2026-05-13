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

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>Relations</h2>
          <p className='mt-1 text-slate-500'>Connections between frames</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className='rounded-xl bg-slate-900 px-4 py-2 text-white'
        >
          Add relation
        </button>
      </div>

      <div className='space-y-3'>
        {relations.length === 0 ? (
          <div className='rounded-2xl bg-white p-6 shadow-sm'>
            <p className='text-slate-500'>No relations available.</p>
          </div>
        ) : (
          relations.map((relation) => (
            <div
              key={relation.id}
              className='flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm'
            >
              <div>
                <div className='mb-1 flex items-center gap-2'>
                  <p className='font-semibold text-slate-900'>
                    {relation.label}
                  </p>

                  {relation.category && (
                    <span className='rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                      {relation.category}
                    </span>
                  )}
                </div>

                <p className='text-sm text-slate-500'>
                  {getFrameName(relation.sourceId)} →{' '}
                  {getFrameName(relation.targetId)}
                </p>

                <p className='text-xs text-slate-400'>
                  Technical type: {relation.type}
                </p>
              </div>

              <button
                onClick={() => deleteRelation(relation.id)}
                className='rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50'
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
