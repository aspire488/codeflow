// utils/storage.js - Storage utilities for CodeFlow

// Storage keys
const STORAGE_KEYS = {
  PROGRESS: 'codeflow_progress',
  GAME_PROGRESS: 'codeflow_game_progress',
  APP_STATE: 'codeflow_app_state'
};

// Load progress from localStorage
function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {
      currentSubject: "c",
      currentTopic: null,
      mode: "study",
      completedTopics: [],
      quizScores: {}
    };
  } catch (error) {
    console.error('Error loading progress:', error);
    return {
      currentSubject: "c",
      currentTopic: null,
      mode: "study",
      completedTopics: [],
      quizScores: {}
    };
  }
}

// Save progress to localStorage
function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

// Load game progress from localStorage
function loadGameProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
    return data ? JSON.parse(data) : {
      currentLevel: 1,
      unlockedLevels: [1],
      scores: {},
      xp: 0,
      completedLevels: []
    };
  } catch (error) {
    console.error('Error loading game progress:', error);
    return {
      currentLevel: 1,
      unlockedLevels: [1],
      scores: {},
      xp: 0,
      completedLevels: []
    };
  }
}

// Save game progress to localStorage
function saveGameProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
}

// Clear all storage (for debugging)
function clearAllStorage() {
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.GAME_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.APP_STATE);
}