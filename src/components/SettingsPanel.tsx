import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  isMirrored: boolean;
  onToggleMirror: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isMirrored,
  onToggleMirror,
  isVoiceEnabled,
  onToggleVoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, updateTheme } = useTheme();

  const colorPresets = [
    { bg: '#ffffff', text: '#1f2937', name: 'Classic Light' },
    { bg: '#1f2937', text: '#ffffff', name: 'Classic Dark' },
    { bg: '#000000', text: '#00ff00', name: 'Terminal Green' },
    { bg: '#1e293b', text: '#38bdf8', name: 'Blue Night' },
    { bg: '#fef3c7', text: '#92400e', name: 'Warm Amber' },
  ];

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Theme Presets */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Themes
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {colorPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => updateTheme({ backgroundColor: preset.bg, textColor: preset.text })}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: preset.bg, color: preset.text }}
                        >
                          Aa
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Colors</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={theme.textColor}
                        onChange={(e) => updateTheme({ textColor: e.target.value })}
                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {theme.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="72"
                    value={theme.fontSize}
                    onChange={(e) => updateTheme({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Features</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mirror Mode
                      </span>
                      <input
                        type="checkbox"
                        checked={isMirrored}
                        onChange={onToggleMirror}
                        className="toggle-checkbox"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Voice Recognition
                      </span>
                      <input
                        type="checkbox"
                        checked={isVoiceEnabled}
                        onChange={onToggleVoice}
                        className="toggle-checkbox"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};