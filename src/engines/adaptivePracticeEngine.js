// adaptivePracticeEngine.js - Adaptive Practice Engine for CodeFlow

// Keep only well-formed numeric counters so corrupted storage cannot yield NaN or absurd stats.
function sanitizeAdaptiveState(raw) {
  const count = (value) => (Number.isFinite(value) && value >= 0 ? Math.min(Math.floor(value), 100000) : 0);
  const clean = {};
  Object.entries(raw).forEach(([key, entry]) => {
    if ((typeof hasTopic === 'function' && !hasTopic(key)) || !entry || typeof entry !== 'object') return;
    clean[key] = { correct: count(entry.correct), wrong: count(entry.wrong), streak: count(entry.streak), mastered: entry.mastered === true };
  });
  return clean;
}

const AdaptiveEngine = {
  learningState: {},
  
  init: function() {
    this.loadState();
  },
  
  loadState: function() {
    try {
      const data = localStorage.getItem('codeflow_adaptive_state');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          this.learningState = sanitizeAdaptiveState(parsed);
        }
      }
    } catch (e) {
      console.warn('[practice] Stored practice history was unreadable and has been reset.', e);
      try { localStorage.removeItem('codeflow_adaptive_state'); } catch (_) { /* storage unavailable */ }
      this.learningState = {};
    }
  },
  
  saveState: function() {
    try {
      localStorage.setItem('codeflow_adaptive_state', JSON.stringify(this.learningState));
    } catch (e) {
      console.error('Error saving adaptive state:', e);
    }
  },
  
  recordAnswer: function(topicKey, isCorrect) {
    if (!this.learningState[topicKey]) {
      this.learningState[topicKey] = {
        correct: 0,
        wrong: 0,
        streak: 0,
        mastered: false
      };
    }
    
    const topic = this.learningState[topicKey];
    
    if (isCorrect) {
      topic.correct++;
      topic.streak++;
      if (topic.streak >= 5 && topic.correct >= 5 && topic.wrong <= 1) {
        topic.mastered = true;
      }
    } else {
      topic.wrong++;
      topic.streak = 0;
    }
    
    this.saveState();
  },
  
  getWeakTopics: function() {
    const topics = Object.entries(this.learningState).map(([key, data]) => {
      const weaknessScore = data.wrong - data.correct;
      const totalAttempts = data.correct + data.wrong;
      const accuracy = totalAttempts > 0 ? (data.correct / totalAttempts) * 100 : 0;
      
      return {
        topicKey: key,
        correct: data.correct,
        wrong: data.wrong,
        weaknessScore,
        accuracy,
        totalAttempts,
        mastered: data.mastered || false
      };
    });
    
    // Filter out mastered topics and sort by weakness (highest first)
    const weakTopics = topics
      .filter(t => !t.mastered && t.totalAttempts > 0)
      .sort((a, b) => b.weaknessScore - a.weaknessScore);
    
    // Add topics with no attempts at the end
    const noAttempts = topics.filter(t => t.totalAttempts === 0);
    
    return [...weakTopics, ...noAttempts];
  },
  
  getWeakestTopic: function() {
    const weakTopics = this.getWeakTopics();
    if (weakTopics.length === 0) {
      // If no data, return first available topic
      return Object.keys(TOPICS_DB)[0] || 'c-basics';
    }
    return weakTopics[0].topicKey;
  },
  
  isTopicMastered: function(topicKey) {
    return this.learningState[topicKey]?.mastered || false;
  },
  
  getMasteryProgress: function(topicKey) {
    const topic = this.learningState[topicKey];
    if (!topic) {
      return { percentage: 0, correct: 0, wrong: 0, status: 'Not started' };
    }
    
    const total = topic.correct + topic.wrong;
    const percentage = total > 0 ? Math.round((topic.correct / total) * 100) : 0;
    
    let status = 'Learning';
    if (topic.mastered) status = 'Mastered';
    else if (topic.correct >= 3 && topic.wrong === 0) status = 'Almost there';
    else if (topic.correct >= 1) status = 'In progress';
    
    return {
      percentage,
      correct: topic.correct,
      wrong: topic.wrong,
      streak: topic.streak,
      status
    };
  },
  
  resetProgress: function() {
    this.learningState = {};
    this.saveState();
  }
};

function startSmartPractice() {
  const topicKey = AdaptiveEngine.getWeakestTopic();
  if (topicKey) {
    navigateTo(`quiz/${topicKey}`);
  }
}

function getAdaptiveState() {
  return AdaptiveEngine.learningState;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdaptiveEngine,
    startSmartPractice,
    getAdaptiveState
  };
}