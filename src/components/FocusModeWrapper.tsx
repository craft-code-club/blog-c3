'use client';

import { ReactNode, useState, useEffect } from 'react';
import FocusModeToggle from './FocusModeToggle';

interface FocusModeWrapperProps {
  children: ReactNode;
}

export default function FocusModeWrapper({ children }: FocusModeWrapperProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Listen for the data-focus-mode attribute changes
  useEffect(() => {
    const handleFocusModeChange = () => {
      setIsFocusMode(document.documentElement.hasAttribute('data-focus-mode'));
    };

    // Set up a MutationObserver to watch for attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-focus-mode') {
          handleFocusModeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    // Initial check
    handleFocusModeChange();

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Apply dynamic classes based on focus mode */}
      <article className={`
        transition-all duration-500 ease-in-out
        ${isFocusMode ? 
          'max-w-screen-xl w-full px-8 md:px-16 py-8 mx-auto' : 
          'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
        }
        ${isFocusMode ? 'prose-xl md:prose-2xl' : 'prose-lg'}
      `}>
        {children}
      </article>
      <FocusModeToggle />
    </>
  );
} 