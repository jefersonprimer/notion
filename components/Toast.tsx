'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-[#2f2f2f] text-white px-4 py-2 rounded-lg shadow-2xl border border-[#3f3f3f] text-sm font-medium">
        {message}
      </div>
    </div>,
    document.body
  );
}
