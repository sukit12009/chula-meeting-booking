'use client';

import { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Dialog({ isOpen, onClose, title, children, actions }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // ป้องกันการเลื่อนหน้าเว็บเมื่อ dialog เปิดอยู่
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = ''; // คืนค่าเดิม
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 scale-100"
      >
        <div className="px-6 py-4 border-b border-gray-light bg-primary-light">
          <h3 className="text-lg font-medium text-gray-dark">{title}</h3>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
        
        {actions && (
          <div className="px-6 py-3 bg-gray-light flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 