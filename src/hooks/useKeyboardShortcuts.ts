import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
  onPlayPause: () => void;
  onSpeedUp: () => void;
  onSpeedDown: () => void;
  onToggleFullscreen: () => void;
  isEnabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onPlayPause,
  onSpeedUp,
  onSpeedDown,
  onToggleFullscreen,
  isEnabled = true,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onPlayPause();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onSpeedUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onSpeedDown();
          break;
        case 'KeyF':
          event.preventDefault();
          onToggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onSpeedUp, onSpeedDown, onToggleFullscreen, isEnabled]);
};