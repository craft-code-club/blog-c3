'use client';

import { ReactNode } from 'react';
import { FocusModeToggle } from './FocusModeToggle';
import { useFocusMode } from './FocusModeContext';

interface FocusModeWrapperProps {
  children: ReactNode;
}

export default function FocusModeWrapper({ children }: FocusModeWrapperProps) {
  const { isFocusMode } = useFocusMode();

  return (
    <>
      <article
        className={`
          transition-all duration-500 ease-in-out
          ${isFocusMode 
            ? 'max-w-screen-xl w-full px-8 md:px-16 py-8 mx-auto' 
            : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
          }
          ${isFocusMode ? 'prose-xl md:prose-2xl' : 'prose-lg'}
        `}
      >
        {children}
      </article>
      <div className="fixed bottom-4 right-4 z-50">
        <FocusModeToggle />
      </div>
    </>
  );
} 