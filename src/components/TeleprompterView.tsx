import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface TeleprompterViewProps {
  script: string;
  isPlaying: boolean;
  scrollSpeed: number;
  isMirrored: boolean;
  activeLineIndex?: number;
}

export const TeleprompterView: React.FC<TeleprompterViewProps> = ({
  script,
  isPlaying,
  scrollSpeed,
  isMirrored,
  activeLineIndex,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const scriptLines = script.split('\n').filter(line => line.trim() !== '');
    setLines(scriptLines);
  }, [script]);

  useEffect(() => {
    if (!containerRef.current || !isPlaying) return;

    let animationFrame: number;
    const scrollInterval = setInterval(() => {
      if (containerRef.current) {
        animationFrame = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop += scrollSpeed;
          }
        });
      }
    }, 16); // ~60fps for smooth scrolling

    return () => {
      clearInterval(scrollInterval);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, scrollSpeed]);

  // Auto-scroll to active line when voice recognition is active
  useEffect(() => {
    if (activeLineIndex !== undefined && containerRef.current) {
      const lineHeight = theme.fontSize * 1.5;
      const targetScroll = activeLineIndex * lineHeight - containerRef.current.clientHeight / 3;
      
      containerRef.current.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  }, [activeLineIndex, theme.fontSize]);

  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    transform: isMirrored ? 'scaleX(-1)' : 'none',
  };

  const textStyle = {
    fontSize: `${theme.fontSize}px`,
    lineHeight: 1.5,
  };

  return (
    <motion.div
      ref={containerRef}
      className="flex-1 p-8 overflow-y-auto scrollbar-hide"
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {lines.length > 0 ? (
          <div style={textStyle}>
            {lines.map((line, index) => (
              <motion.p
                key={index}
                className={`mb-4 ${
                  activeLineIndex === index
                    ? 'opacity-100 font-semibold'
                    : 'opacity-80'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: activeLineIndex === index ? 1 : 0.8, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl opacity-50">
              No script loaded. Please enter your script in the editor.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};