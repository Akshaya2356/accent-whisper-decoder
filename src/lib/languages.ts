export interface Language {
  code: string;
  name: string;
  region: string;
}

export interface Cuisine {
  name: string;
  description: string;
  emoji: string;
}

export const languages: Language[] = [
  { code: "hindi", name: "Hindi", region: "North India" },
  { code: "tamil", name: "Tamil", region: "Tamil Nadu" },
  { code: "telugu", name: "Telugu", region: "Andhra Pradesh & Telangana" },
  { code: "malayalam", name: "Malayalam", region: "Kerala" },
  { code: "kannada", name: "Kannada", region: "Karnataka" },
  { code: "bengali", name: "Bengali", region: "West Bengal" },
  { code: "marathi", name: "Marathi", region: "Maharashtra" },
  { code: "gujarati", name: "Gujarati", region: "Gujarat" },
  { code: "punjabi", name: "Punjabi", region: "Punjab" },
];

const cuisineDatabase: Record<string, Cuisine[]> = {
  hindi: [
    { name: "Butter Chicken", description: "Creamy tomato-based curry", emoji: "🍗" },
    { name: "Chole Bhature", description: "Spicy chickpeas with fried bread", emoji: "🫓" },
    { name: "Paneer Tikka", description: "Grilled cottage cheese", emoji: "🧀" },
  ],
  tamil: [
    { name: "Dosa", description: "Crispy rice and lentil crepe", emoji: "🥞" },
    { name: "Idli Sambar", description: "Steamed rice cakes with lentil stew", emoji: "🍚" },
    { name: "Chettinad Chicken", description: "Spicy South Indian curry", emoji: "🍛" },
  ],
  telugu: [
    { name: "Hyderabadi Biryani", description: "Aromatic rice with meat", emoji: "🍚" },
    { name: "Gongura Pickle", description: "Tangy sorrel leaves condiment", emoji: "🥗" },
    { name: "Pesarattu", description: "Green gram dosa", emoji: "🥞" },
  ],
  malayalam: [
    { name: "Appam", description: "Rice pancake with coconut milk", emoji: "🥞" },
    { name: "Puttu", description: "Steamed rice cake with coconut", emoji: "🍚" },
    { name: "Kerala Fish Curry", description: "Coconut-based fish stew", emoji: "🐟" },
  ],
  kannada: [
    { name: "Bisi Bele Bath", description: "Rice, lentils and vegetables", emoji: "🍲" },
    { name: "Mysore Pak", description: "Sweet gram flour fudge", emoji: "🍬" },
    { name: "Ragi Mudde", description: "Finger millet balls", emoji: "⚪" },
  ],
  bengali: [
    { name: "Machher Jhol", description: "Bengali fish curry", emoji: "🐟" },
    { name: "Mishti Doi", description: "Sweet yogurt dessert", emoji: "🍮" },
    { name: "Rasgulla", description: "Spongy cheese balls in syrup", emoji: "⚪" },
  ],
  marathi: [
    { name: "Vada Pav", description: "Spicy potato fritter in bun", emoji: "🍔" },
    { name: "Puran Poli", description: "Sweet flatbread with lentils", emoji: "🫓" },
    { name: "Misal Pav", description: "Spicy sprouts curry with bread", emoji: "🍲" },
  ],
  gujarati: [
    { name: "Dhokla", description: "Steamed savory cake", emoji: "🍰" },
    { name: "Khandvi", description: "Rolled gram flour snack", emoji: "🥨" },
    { name: "Undhiyu", description: "Mixed vegetable curry", emoji: "🥘" },
  ],
  punjabi: [
    { name: "Sarson ka Saag", description: "Mustard greens curry", emoji: "🥬" },
    { name: "Amritsari Kulcha", description: "Stuffed bread", emoji: "🫓" },
    { name: "Makki di Roti", description: "Corn flour flatbread", emoji: "🌽" },
  ],
};

export const getCuisineRecommendations = (languageCode: string): Cuisine[] => {
  return cuisineDatabase[languageCode] || cuisineDatabase["hindi"];
};

// Simulate ML prediction
export const simulatePrediction = (featureMethod: "hubert" | "mfcc") => {
  const allLanguages = languages.map((lang) => ({
    language: lang.code,
    score: Math.random(),
  }));

  allLanguages.sort((a, b) => b.score - a.score);

  const total = allLanguages.reduce((sum, item) => sum + item.score, 0);
  const normalized = allLanguages.map((item) => ({
    language: item.language,
    score: item.score / total,
  }));

  return {
    language: normalized[0].language,
    confidence: normalized[0].score,
    allScores: normalized.slice(0, 5),
  };
};
