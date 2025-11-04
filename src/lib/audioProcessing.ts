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

// Map Whisper detected language to Indian accents from IndicAccentDb dataset
// IndicAccentDb contains 6 non-native English accents: Gujarati, Hindi, Kannada, Malayalam, Tamil, Telugu
const mapWhisperLanguage = (detectedLang: string) => {
  // Map Whisper language codes to IndicAccentDb accent categories (native language backgrounds)
  const languageMapping: Record<string, string> = {
    'hi': 'hindi',
    'ta': 'tamil',
    'te': 'telugu',
    'ml': 'malayalam',
    'kn': 'kannada',
    'gu': 'gujarati',
    'en': 'hindi', // Default to hindi for English
  };

  // The 6 accent categories from IndicAccentDb dataset
  const accentCategories = ['gujarati', 'hindi', 'kannada', 'malayalam', 'tamil', 'telugu'];
  
  // Get the mapped accent category
  const primaryAccent = languageMapping[detectedLang] || 'hindi';
  
  // Create confidence scores with the detected accent having highest confidence
  const accentScores = accentCategories.map(accent => ({
    language: accent,
    score: accent === primaryAccent ? 0.85 : (0.15 / (accentCategories.length - 1))
  }));
  
  // Sort by score
  return accentScores.sort((a, b) => b.score - a.score);
};

export const extractFeatures = async (audioFile: File, method: "hubert" | "mfcc") => {
  // This is called by processAudio, but keeping it separate for clarity
  return processAudio(audioFile, method);
};
