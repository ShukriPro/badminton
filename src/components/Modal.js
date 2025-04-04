import React from 'react';

function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}
      onClick={onClose}
    >
      <div 
        className="bg-white p-4 rounded shadow-lg w-80" 
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-lg font-bold mb-3">{title}</h3>}
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;