// src/components/common/ConfirmModal.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-2">{message}</p>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-center space-x-3 rounded-b-lg">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;