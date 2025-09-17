import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Minus, Plus, Maximize, Mic, MicOff } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  scrollSpeed: number;
  onSpeedChange: (speed: number) => void;
  onToggleFullscreen: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  isVoiceListening: boolean;
  isVoiceSupported: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  scrollSpeed,
  onSpeedChange,
  onToggleFullscreen,
  isVoiceEnabled,
  onToggleVoice,
  isVoiceListening,
  isVoiceSupported,
}) => {
  const speedUp = () => onSpeedChange(Math.min(scrollSpeed + 0.5, 5));
  const speedDown = () => onSpeedChange(Math.max(scrollSpeed - 0.5, 0.5));

  return (
    <motion.div
      className="flex items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Speed Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={speedDown}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={scrollSpeed <= 0.5}
        >
          <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </motion.button>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-center">
          {scrollSpeed.toFixed(1)}x
        </span>
        
        <motion.button
          onClick={speedUp}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={scrollSpeed >= 5}
        >
          <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </div>

      {/* Play/Pause */}
      <motion.button
        onClick={onTogglePlay}
        className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </motion.button>

      {/* Voice Control */}
      {isVoiceSupported && (
        <motion.button
          onClick={onToggleVoice}
          className={`p-2 rounded-lg transition-colors ${
            isVoiceEnabled
              ? isVoiceListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isVoiceEnabled ? (isVoiceListening ? 'Voice active' : 'Voice enabled') : 'Enable voice recognition'}
        >
          {isVoiceEnabled && isVoiceListening ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </motion.button>
      )}

      {/* Fullscreen */}
      <motion.button
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Maximize className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.button>
    </motion.div>
  );
};