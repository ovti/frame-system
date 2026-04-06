import { useState } from 'react';
import Modal from '../components/common/Modal';
import FrameCard from '../components/frame/FrameCard';
import FrameDetailsModal from '../components/frame/FrameDetailsModal';
import FrameForm from '../components/frame/FrameForm';
import { useFrameStore } from '../store/frameStore';
import type { Frame } from '../types/frame';

function FramesPage() {
  const { frames, addFrame } = useFrameStore();

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold'>Ramki</h2>
          <p className='mt-1 text-slate-500'>
            Lista wszystkich ramek w systemie
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className='rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700'
        >
          Dodaj ramkę
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {frames.map((frame) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            onClick={() => handleOpenDetails(frame)}
          />
        ))}
      </div>
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
          <h2 className='text-2xl font-bold text-slate-900'>
            Dodaj nową ramkę
          </h2>

          <p className='mt-1 text-slate-500'>Utwórz nową klasę lub obiekt</p>
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
