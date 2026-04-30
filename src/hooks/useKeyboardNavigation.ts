
import { useEffect, useCallback } from 'react';

interface NavigationConfig {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onEnter,
  onBack,
  enabled = true
}: NavigationConfig) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onUp?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onDown?.();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        onLeft?.();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onRight?.();
        break;
      case 'Enter':
        event.preventDefault();
        onEnter?.();
        break;
      case 'Backspace':
        event.preventDefault();
        onBack?.();
        break;
      case 'Escape':
        event.preventDefault();
        onBack?.();
        break;
    }
  }, [enabled, onUp, onDown, onLeft, onRight, onEnter, onBack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardNavigation;
