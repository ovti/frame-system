import { useState } from 'react';
import Modal from '../components/common/Modal';
import FrameCard from '../components/frame/FrameCard';
import FrameDetailsModal from '../components/frame/FrameDetailsModal';
import FrameForm from '../components/frame/FrameForm';
import { useFrameStore } from '../store/frameStore';
import type { Frame } from '../types/frame';

function FramesPage() {
  const { frames, addFrame, deleteFrame } = useFrameStore();

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const primaryButtonClass =
    'cursor-pointer rounded-xl bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-700 hover:shadow focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:bg-slate-950';

  const handleOpenDetails = (frame: Frame) => {
    setSelectedFrame(frame);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedFrame(null);
    setIsDetailsModalOpen(false);
  };

  const handleCreateFrame = (frame: Frame) => {
    addFrame(frame);
    setIsCreateModalOpen(false);
  };

  const handleDeleteFrame = (frameId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this frame?',
    );

    if (!confirmed) return;

    if (selectedFrame?.id === frameId) {
      handleCloseDetails();
    }

    deleteFrame(frameId);
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>Frames</h2>
          <p className='mt-1 text-slate-500'>
            List of all frames in the system
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsCreateModalOpen(true)}
          className={primaryButtonClass}
        >
          Add frame
        </button>
      </div>

      {frames.length === 0 ? (
        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <p className='text-slate-500'>No frames available.</p>
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              onClick={() => handleOpenDetails(frame)}
              onDelete={() => handleDeleteFrame(frame.id)}
            />
          ))}
        </div>
      )}

      <FrameDetailsModal
        frame={selectedFrame}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-slate-900'>Add a new frame</h2>

          <p className='mt-1 text-slate-500'>Create a new class or object</p>
        </div>

        <FrameForm
          onSubmit={handleCreateFrame}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default FramesPage;
