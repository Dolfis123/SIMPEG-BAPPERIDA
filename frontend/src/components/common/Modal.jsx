// src/components/common/Modal.jsx
import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg m-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children} {/* Form will be displayed here */}
        </div>
      </div>
    </div>
  );
};

export default Modal;