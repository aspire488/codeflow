// adaptivePracticeEngine.js - Adaptive Practice Engine for CodeFlow

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
        if (parsed && typeof parsed === 'object') {
          this.learningState = parsed;
        }
      }
    } catch (e) {
      console.error('Error loading adaptive state:', e);
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

function renderSmartPracticeUI(containerId = 'smartPracticeContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const weakTopics = AdaptiveEngine.getWeakTopics();
  const displayTopics = weakTopics.slice(0, 8);
  
  if (displayTopics.length === 0) {
    container.innerHTML = `
      <div class="bg-tertiary-container/20 border border-tertiary/40 rounded-lg p-4 text-center">
        <span class="material-symbols-outlined text-tertiary text-3xl mb-2">emoji_events</span>
        <h3 class="text-lg font-bold text-tertiary">All Topics Mastered!</h3>
        <p class="text-sm text-on-surface-variant">Great job! You've completed all practice.</p>
        <button onclick="AdaptiveEngine.resetProgress()" class="mt-3 px-4 py-2 bg-surface-container text-on-surface-variant rounded hover:bg-surface-container-high text-sm">
          Reset Progress
        </button>
      </div>
    `;
    return;
  }
  
  let html = `
    <div class="space-y-3">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-on-surface">Smart Practice</h3>
        <button onclick="startSmartPractice()" class="px-4 py-2 bg-tertiary text-on-tertiary rounded-lg hover:brightness-110 text-sm font-bold flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">play_arrow</span>
          Start Practice
        </button>
      </div>
      <p class="text-xs text-on-surface-variant mb-4">Focus on your weakest topics to improve faster.</p>
  `;
  
  displayTopics.forEach(topic => {
    const progress = AdaptiveEngine.getMasteryProgress(topic.topicKey);
    const topicTitle = TOPICS_DB[topic.topicKey]?.title || topic.topicKey;
    const barWidth = progress.percentage;
    const barColor = progress.status === 'Mastered' ? 'bg-tertiary' : progress.percentage >= 70 ? 'bg-primary' : 'bg-error';
    
    html += `
      <div class="bg-surface-container rounded-lg p-3 border border-outline-variant/20">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-on-surface">${topicTitle}</span>
          <span class="text-xs ${progress.status === 'Mastered' ? 'text-tertiary' : 'text-outline'}">${progress.status}</span>
        </div>
        <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div class="${barColor} h-full transition-all" style="width: ${barWidth}%"></div>
        </div>
        <div class="flex justify-between mt-1 text-xs text-outline">
          <span>${progress.correct} correct</span>
          <span>${progress.wrong} wrong</span>
          <span>${progress.percentage}%</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdaptiveEngine,
    startSmartPractice,
    getAdaptiveState,
    renderSmartPracticeUI
  };
}