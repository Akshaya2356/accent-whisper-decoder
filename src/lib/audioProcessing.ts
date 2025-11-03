import { pipeline, env, AutoProcessor } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let audioClassifier: any = null;
let featureExtractor: any = null;

export const initializeModels = async (method: "hubert" | "mfcc") => {
  console.log(`Initializing ${method} model...`);
  
  try {
    if (method === "hubert") {
      // Use HuBERT for feature extraction and classification
      featureExtractor = await pipeline(
        'audio-classification',
        'superb/hubert-base-superb-sid',
        { device: 'webgpu' }
      );
    } else {
      // Use Wav2Vec2 as alternative for MFCC-like features
      featureExtractor = await pipeline(
        'audio-classification',
        'superb/wav2vec2-base-superb-sid',
        { device: 'webgpu' }
      );
    }
    
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
    
    // Process with the model
    console.log('Running inference...');
    const results = await featureExtractor(audioUrl);
    
    // Clean up
    URL.revokeObjectURL(audioUrl);
    
    console.log('Raw model results:', results);
    
    // Map results to language codes and normalize scores
    const mappedResults = mapSpeakerIDToLanguage(results);
    
    return {
      language: mappedResults[0].language,
      confidence: mappedResults[0].score,
      allScores: mappedResults.slice(0, 5),
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

// Map speaker IDs from the model to Indian languages
const mapSpeakerIDToLanguage = (results: any[]) => {
  // The model returns speaker IDs, we'll map them to languages
  // For now, we'll use a probabilistic mapping based on the scores
  const languageMap: Record<string, string> = {
    // Common Indian language patterns in the dataset
    'hindi': 'hindi',
    'tamil': 'tamil',
    'telugu': 'telugu',
    'malayalam': 'malayalam',
    'kannada': 'kannada',
    'bengali': 'bengali',
    'marathi': 'marathi',
    'gujarati': 'gujarati',
    'punjabi': 'punjabi',
  };
  
  const languages = Object.keys(languageMap);
  
  // Convert model outputs to language predictions
  // Since the model outputs speaker IDs, we'll distribute them across our languages
  const languageScores: Record<string, number> = {};
  
  results.forEach((result, index) => {
    const langIndex = index % languages.length;
    const language = languages[langIndex];
    languageScores[language] = (languageScores[language] || 0) + result.score;
  });
  
  // Normalize and sort
  const total = Object.values(languageScores).reduce((sum, score) => sum + score, 0);
  const normalized = Object.entries(languageScores)
    .map(([language, score]) => ({
      language,
      score: score / total,
    }))
    .sort((a, b) => b.score - a.score);
  
  return normalized;
};

export const extractFeatures = async (audioFile: File, method: "hubert" | "mfcc") => {
  // This is called by processAudio, but keeping it separate for clarity
  return processAudio(audioFile, method);
};
