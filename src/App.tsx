import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { SettingsPanel } from './components/SettingsPanel';
import { ScriptInput } from './components/ScriptInput';
import { TeleprompterView } from './components/TeleprompterView';
import { Controls } from './components/Controls';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const TeleprompterApp: React.FC = () => {
  const { isDark } = useTheme();
  const [script, setScript] = useState(() => {
    const saved = localStorage.getItem('teleprompter-script');
    return saved || 'Welcome to the Teleprompter App!\n\nThis is your script editor where you can type or paste your content.\n\nPress the play button or spacebar to start auto-scrolling.\n\nUse the settings panel to customize your experience.\n\nThe voice recognition feature will help keep you on track by following your speech.';
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(true);

  // Speech recognition
  const handleSpeechResult = useCallback((result: { transcript: string }) => {
    if (!isVoiceEnabled) return;
    
    const lines = script.split('\n').filter(line => line.trim() !== '');
    const transcript = result.transcript.toLowerCase();
    
    // Simple matching algorithm - find the line that best matches the transcript
    let bestMatch = -1;
    let bestScore = 0;
    
    lines.forEach((line, index) => {
      const lineWords = line.toLowerCase().split(/\s+/);
      const transcriptWords = transcript.split(/\s+/);
      
      let matches = 0;
      transcriptWords.forEach(word => {
        if (lineWords.some(lineWord => lineWord.includes(word) || word.includes(lineWord))) {
          matches++;
        }
      });
      
      const score = matches / Math.max(lineWords.length, transcriptWords.length);
      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestMatch = index;
      }
    });
    
    if (bestMatch !== -1) {
      setActiveLineIndex(bestMatch);
    }
  }, [isVoiceEnabled, script]);

  const {
    isListening,
    startListening,
    stopListening,
    isSupported: isVoiceSupported
  } = useSpeechRecognition(handleSpeechResult);

  // Save script to localStorage
  useEffect(() => {
    localStorage.setItem('teleprompter-script', script);
  }, [script]);

  // Handle voice recognition state
  useEffect(() => {
    if (isVoiceEnabled && isPlaying) {
      startListening();
    } else {
      stopListening();
    }
  }, [isVoiceEnabled, isPlaying, startListening, stopListening]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSpeedUp = useCallback(() => {
    setScrollSpeed(prev => Math.min(prev + 0.5, 5));
  }, []);

  const handleSpeedDown = useCallback(() => {
    setScrollSpeed(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setShowEditor(false);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setShowEditor(true);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowEditor(!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onSpeedUp: handleSpeedUp,
    onSpeedDown: handleSpeedDown,
    onToggleFullscreen: handleToggleFullscreen,
    isEnabled: !showEditor || isFullscreen,
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <AnimatePresence>
          {showEditor && (
            <motion.header
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Teleprompter Pro
                </h1>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <SettingsPanel
                    isMirrored={isMirrored}
                    onToggleMirror={() => setIsMirrored(prev => !prev)}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleVoice={() => setIsVoiceEnabled(prev => !prev)}
                  />
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
          {/* Script Editor */}
          <AnimatePresence>
            {showEditor && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="lg:w-96 flex-shrink-0"
              >
                <ScriptInput script={script} onScriptChange={setScript} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Teleprompter View */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <TeleprompterView
              script={script}
              isPlaying={isPlaying}
              scrollSpeed={scrollSpeed}
              isMirrored={isMirrored}
              activeLineIndex={isVoiceEnabled ? activeLineIndex : undefined}
            />
            
            {/* Controls */}
            <Controls
              isPlaying={isPlaying}
              onTogglePlay={handlePlayPause}
              scrollSpeed={scrollSpeed}
              onSpeedChange={setScrollSpeed}
              onToggleFullscreen={handleToggleFullscreen}
              isVoiceEnabled={isVoiceEnabled}
              onToggleVoice={() => setIsVoiceEnabled(prev => !prev)}
              isVoiceListening={isListening}
              isVoiceSupported={isVoiceSupported}
            />
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <AnimatePresence>
          {showEditor && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="p-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="max-w-7xl mx-auto">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <span className="font-semibold">Shortcuts:</span> Space (Play/Pause) • ↑/↓ (Speed) • F (Fullscreen)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TeleprompterApp />
    </ThemeProvider>
  );
};

export default App;