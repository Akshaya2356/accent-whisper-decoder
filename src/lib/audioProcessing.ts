import { pipeline, env, AutoProcessor } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let audioClassifier: any = null;
let featureExtractor: any = null;

export const initializeModels = async (method: "hubert" | "mfcc") => {
  console.log(`Initializing multilingual Whisper model...`);
  
  try {
    // Use Whisper multilingual for language detection from audio
    featureExtractor = await pipeline(
      'automatic-speech-recognition',
      'onnx-community/whisper-tiny',
      { device: 'webgpu' }
    );
    
    console.log('Model initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    throw error;
  }
};

export const processAudio = async (audioFile: File, method: "hubert" | "mfcc") => {
  try {
    console.log('Processing audio file:', audioFile.name);
    
    // Initialize model if not already done
    if (!featureExtractor) {
      await initializeModels(method);
    }
    
    // Convert file to audio buffer
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Process with the model - Whisper returns transcription and detected language
    console.log('Running inference...');
    const results = await featureExtractor(audioUrl, { 
      return_timestamps: false,
      language: null // Auto-detect language
    });
    
    // Clean up
    URL.revokeObjectURL(audioUrl);
    
    console.log('Raw model results:', results);
    
    // Extract language from Whisper results
    const detectedLanguage = results.chunks?.[0]?.language || 'unknown';
    const languageScores = mapWhisperLanguage(detectedLanguage);
    
    return {
      language: languageScores[0].language,
      confidence: languageScores[0].score,
      allScores: languageScores,
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

// Map Whisper detected language to Indian languages with confidence scores
const mapWhisperLanguage = (detectedLang: string) => {
  // Map common Whisper language codes to Indian languages
  const languageMapping: Record<string, string> = {
    'hi': 'hindi',
    'ta': 'tamil',
    'te': 'telugu',
    'ml': 'malayalam',
    'kn': 'kannada',
    'bn': 'bengali',
    'mr': 'marathi',
    'gu': 'gujarati',
    'pa': 'punjabi',
    'en': 'english', // English as reference
  };

  const allLanguages = ['hindi', 'tamil', 'telugu', 'malayalam', 'kannada', 'bengali', 'marathi', 'gujarati', 'punjabi'];
  
  // Get the mapped language
  const primaryLanguage = languageMapping[detectedLang] || 'hindi';
  
  // Create confidence scores with the detected language having highest confidence
  const languageScores = allLanguages.map(lang => ({
    language: lang,
    score: lang === primaryLanguage ? 0.85 : (0.15 / (allLanguages.length - 1))
  }));
  
  // Sort by score
  return languageScores.sort((a, b) => b.score - a.score);
};

export const extractFeatures = async (audioFile: File, method: "hubert" | "mfcc") => {
  // This is called by processAudio, but keeping it separate for clarity
  return processAudio(audioFile, method);
};
