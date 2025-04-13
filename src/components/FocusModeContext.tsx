'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

type FocusModeContextType = {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
};

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export function FocusModeProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  // Apply focus mode to document
  useEffect(() => {
    if (isFocusMode) {
      document.documentElement.setAttribute('data-focus-mode', 'true');
    } else {
      document.documentElement.removeAttribute('data-focus-mode');
    }
  }, [isFocusMode]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if the target is the body or document to avoid conflicts with inputs
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      if (e.key === '.' && !isInput) {
        toggleFocusMode();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <FocusModeContext.Provider value={{ isFocusMode, toggleFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error('useFocusMode must be used within a FocusModeProvider');
  }
  return context;
} 