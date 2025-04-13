'use client';

import { useFocusMode } from "./FocusModeContext";
import FocusExpandIcon from "./FocusExpandIcon";
import FocusCollapseIcon from "./FocusCollapseIcon";

export function FocusModeToggle() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <button 
      onClick={toggleFocusMode}
      title={isFocusMode ? "Exit focus mode (press . key)" : "Enter focus mode (press . key)"}
      className="rounded-full p-3 bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
    >
      {isFocusMode ? <FocusExpandIcon /> : <FocusCollapseIcon />}
      <span className="sr-only">
        {isFocusMode ? "Exit focus mode" : "Enter focus mode"}
      </span>
    </button>
  );
} 