import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Upload } from 'lucide-react';
import { downloadTextFile, triggerFileInput, readTextFile } from '../utils/fileUtils';

interface ScriptInputProps {
  script: string;
  onScriptChange: (script: string) => void;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ script, onScriptChange }) => {
  const handleImport = async () => {
    try {
      const file = await triggerFileInput();
      if (file) {
        const content = await readTextFile(file);
        onScriptChange(content);
      }
    } catch (error) {
      console.error('Failed to import file:', error);
      alert('Failed to import file. Please try again.');
    }
  };

  const handleExport = () => {
    if (script.trim()) {
      downloadTextFile(script, 'teleprompter-script.txt');
    } else {
      alert('No script to export. Please enter some text first.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Script Editor
        </h2>
        <div className="flex gap-2">
          <motion.button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4" />
            Import
          </motion.button>
          <motion.button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>
      
      <textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        placeholder="Paste or type your script here..."
        className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};