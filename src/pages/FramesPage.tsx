import { useState } from 'react';
import Modal from '../components/common/Modal';
import FrameCard from '../components/frame/FrameCard';
import FrameDetailsModal from '../components/frame/FrameDetailsModal';
import FrameForm from '../components/frame/FrameForm';
import { useFrameStore } from '../store/frameStore';
import { primaryButtonClass } from '../styles/uiClasses';
import type { Frame } from '../types/frame';

function FramesPage() {
  const { frames, addFrame, updateFrame, deleteFrame } = useFrameStore();

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [editedFrame, setEditedFrame] = useState<Frame | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleOpenEdit = (frame: Frame) => {
    setEditedFrame(frame);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditedFrame(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateFrame = (frame: Frame) => {
    updateFrame(frame);

    if (selectedFrame?.id === frame.id) {
      setSelectedFrame(frame);
    }

    handleCloseEdit();
  };

  const handleDeleteFrame = (frameId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this frame?',
    );

    if (!confirmed) return;

    if (selectedFrame?.id === frameId) {
      handleCloseDetails();
    }

    if (editedFrame?.id === frameId) {
      handleCloseEdit();
    }

    deleteFrame(frameId);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">Frames</h2>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            List of all frames in the system
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className={primaryButtonClass}
        >
          Add frame
        </button>
      </div>

      {frames.length === 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <p className="text-sm text-slate-500 sm:text-base">
            No frames available.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              onClick={() => handleOpenDetails(frame)}
              onEdit={() => handleOpenEdit(frame)}
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Add a new frame
          </h2>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Create a new class or object
          </p>
        </div>

        <FrameForm
          onSubmit={handleCreateFrame}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleCloseEdit}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Edit frame
          </h2>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Update frame data, slots, facets, and demons
          </p>
        </div>

        <FrameForm
          key={editedFrame?.id ?? 'edit-frame'}
          initialFrame={editedFrame}
          onSubmit={handleUpdateFrame}
          onCancel={handleCloseEdit}
        />
      </Modal>
    </div>
  );
}

export default FramesPage;
