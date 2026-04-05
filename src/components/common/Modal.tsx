import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold'>Szczegóły ramki</h2>

          <button
            onClick={onClose}
            className='rounded-md px-3 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
