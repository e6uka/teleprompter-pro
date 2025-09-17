export interface Theme {
  mode: 'light' | 'dark' | 'system';
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

export interface TeleprompterSettings {
  theme: Theme;
  scrollSpeed: number;
  isPlaying: boolean;
  isMirrored: boolean;
  isVoiceEnabled: boolean;
}

export interface ScriptLine {
  id: string;
  text: string;
  isActive?: boolean;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}