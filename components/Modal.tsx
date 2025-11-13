
import React from 'react';
import { CloseIcon } from './icons/IconComponents';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative transform transition-all duration-300 scale-95 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Modal;
