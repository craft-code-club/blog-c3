'use client';

import { useState, useEffect } from 'react';
import FocusExpandIcon from './FocusExpandIcon';
import FocusCollapseIcon from './FocusCollapseIcon';

export default function FocusModeToggle() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    // Apply focus mode styles immediately on mount if needed
    if (document.documentElement.hasAttribute('data-focus-mode')) {
      setIsFocusMode(true);
      hideNonEssentialElements();
    }
  }, []);

  const hideNonEssentialElements = () => {
    // Hide all nav elements
    document.querySelectorAll('nav').forEach(nav => {
      nav.classList.add('hidden');
    });
    
    // Hide all footer elements
    document.querySelectorAll('footer').forEach(footer => {
      footer.classList.add('hidden');
    });
    
    // Make main content take full height
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('flex-grow', 'flex', 'items-center', 'justify-center');
    }
  };

  const showNonEssentialElements = () => {
    // Show all nav elements
    document.querySelectorAll('nav').forEach(nav => {
      nav.classList.remove('hidden');
    });
    
    // Show all footer elements
    document.querySelectorAll('footer').forEach(footer => {
      footer.classList.remove('hidden');
    });
    
    // Reset main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.remove('flex-grow', 'flex', 'items-center', 'justify-center');
    }
  };

  const toggleFocusMode = () => {
    const newMode = !isFocusMode;
    setIsFocusMode(newMode);
    
    if (newMode) {
      document.documentElement.setAttribute('data-focus-mode', 'true');
      hideNonEssentialElements();
    } else {
      document.documentElement.removeAttribute('data-focus-mode');
      showNonEssentialElements();
    }
  };

  // Set up keyboard shortcut for focus mode toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if pressed key is "." and no input elements are focused
      if (
        event.key === '.' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        !(document.activeElement?.getAttribute('contenteditable') === 'true')
      ) {
        toggleFocusMode();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode]); // Include isFocusMode in dependencies to get current state

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-focus-mode');
      showNonEssentialElements();
    };
  }, []);

  return (
    <button
      onClick={toggleFocusMode}
      className={`
        fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-colors duration-300
        ${isFocusMode 
          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      `}
      aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
      title={isFocusMode ? "Exit focus mode (Press '.' to toggle)" : "Enter focus mode (Press '.' to toggle)"}
    >
      {isFocusMode ? <FocusExpandIcon /> : <FocusCollapseIcon />}
    </button>
  );
} 