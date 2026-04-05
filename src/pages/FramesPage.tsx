import { useState } from 'react';
import FrameCard from '../components/frame/FrameCard';
import FrameDetailsModal from '../components/frame/FrameDetailsModal';
import { sampleFrames } from '../data/sampleFrames';
import type { Frame } from '../types/frame';

function FramesPage() {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (frame: Frame) => {
    setSelectedFrame(frame);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFrame(null);
    setIsModalOpen(false);
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

        <button className='rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700'>
          Dodaj ramkę
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {sampleFrames.map((frame) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            onClick={() => handleOpenModal(frame)}
          />
        ))}
      </div>

      <FrameDetailsModal
        frame={selectedFrame}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default FramesPage;
