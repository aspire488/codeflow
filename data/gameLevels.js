// data/gameLevels.js - Game levels and progression system for CodeFlow

const GAME_LEVELS = {
  // Level configuration
  levels: [
    {
      id: 1,
      name: "Code Novice",
      xpRequired: 0,
      description: "Welcome to CodeFlow! Start your coding journey.",
      rewards: ["Basic Badge", "Welcome Tutorial"],
      unlockedFeatures: ["Topic Browser", "Basic Quiz"],
      difficulty: "beginner"
    },
    {
      id: 2,
      name: "Variable Explorer",
      xpRequired: 100,
      description: "Master the art of variables and data types.",
      rewards: ["Variable Master Badge"],
      unlockedFeatures: ["Variable Quiz"],
      difficulty: "beginner"
    },
    {
      id: 3,
      name: "Operator Ace",
      xpRequired: 250,
      description: "Conquer operators and expressions.",
      rewards: ["Operator Badge"],
      unlockedFeatures: ["Operator Challenges"],
      difficulty: "beginner"
    },
    {
      id: 4,
      name: "Logic Builder",
      xpRequired: 450,
      description: "Learn conditional statements and logic flow.",
      rewards: ["Logic Badge"],
      unlockedFeatures: ["Conditional Quiz"],
      difficulty: "beginner"
    },
    {
      id: 5,
      name: "Loop Master",
      xpRequired: 700,
      description: "Master loops and iteration.",
      rewards: ["Loop Badge"],
      unlockedFeatures: ["Loop Challenges"],
      difficulty: "intermediate"
    },
    {
      id: 6,
      name: "Function Creator",
      xpRequired: 1000,
      description: "Create and use functions effectively.",
      rewards: ["Function Badge"],
      unlockedFeatures: ["Function Quiz"],
      difficulty: "intermediate"
    },
    {
      id: 7,
      name: "Array Architect",
      xpRequired: 1350,
      description: "Build and manipulate arrays.",
      rewards: ["Array Badge"],
      unlockedFeatures: ["Array Challenges"],
      difficulty: "intermediate"
    },
    {
      id: 8,
      name: "String Sorcerer",
      xpRequired: 1750,
      description: "Master string operations and manipulation.",
      rewards: ["String Badge"],
      unlockedFeatures: ["String Quiz"],
      difficulty: "intermediate"
    },
    {
      id: 9,
      name: "Pointer Pioneer",
      xpRequired: 2200,
      description: "Explore the world of pointers and memory.",
      rewards: ["Pointer Badge"],
      unlockedFeatures: ["Pointer Challenges"],
      difficulty: "advanced"
    },
    {
      id: 10,
      name: "Structure Builder",
      xpRequired: 2700,
      description: "Create and use data structures.",
      rewards: ["Structure Badge"],
      unlockedFeatures: ["Structure Quiz"],
      difficulty: "advanced"
    },
    {
      id: 11,
      name: "File Handler",
      xpRequired: 3250,
      description: "Master file input/output operations.",
      rewards: ["File Badge"],
      unlockedFeatures: ["File Challenges"],
      difficulty: "advanced"
    },
    {
      id: 12,
      name: "Memory Manager",
      xpRequired: 3850,
      description: "Control dynamic memory allocation.",
      rewards: ["Memory Badge"],
      unlockedFeatures: ["Memory Quiz"],
      difficulty: "advanced"
    },
    {
      id: 13,
      name: "Bit Manipulator",
      xpRequired: 4500,
      description: "Master bitwise operations and flags.",
      rewards: ["Bitwise Badge"],
      unlockedFeatures: ["Bitwise Challenges"],
      difficulty: "expert"
    },
    {
      id: 14,
      name: "Web Weaver",
      xpRequired: 5200,
      description: "Enter the world of web development.",
      rewards: ["Web Badge"],
      unlockedFeatures: ["HTML Basics", "CSS Fundamentals"],
      difficulty: "intermediate"
    },
    {
      id: 15,
      name: "JavaScript Journeyman",
      xpRequired: 5950,
      description: "Master JavaScript programming.",
      rewards: ["JS Badge"],
      unlockedFeatures: ["JavaScript Quiz", "DOM Manipulation"],
      difficulty: "advanced"
    },
    {
      id: 16,
      name: "CodeFlow Champion",
      xpRequired: 6750,
      description: "You've mastered the fundamentals!",
      rewards: ["Champion Badge", "All Topics Unlocked"],
      unlockedFeatures: ["Advanced Challenges", "Code Visualization"],
      difficulty: "expert"
    },
    {
      id: 17,
      name: "Algorithm Apprentice",
      xpRequired: 7600,
      description: "Begin exploring algorithms and problem-solving.",
      rewards: ["Algorithm Badge"],
      unlockedFeatures: ["Algorithm Challenges"],
      difficulty: "expert"
    },
    {
      id: 18,
      name: "Debugging Detective",
      xpRequired: 8500,
      description: "Master debugging and error handling.",
      rewards: ["Debug Badge"],
      unlockedFeatures: ["Debug Challenges"],
      difficulty: "expert"
    },
    {
      id: 19,
      name: "Performance Optimizer",
      xpRequired: 9450,
      description: "Optimize code for speed and efficiency.",
      rewards: ["Performance Badge"],
      unlockedFeatures: ["Optimization Challenges"],
      difficulty: "master"
    },
    {
      id: 20,
      name: "CodeFlow Master",
      xpRequired: 10500,
      description: "You are now a true CodeFlow Master!",
      rewards: ["Master Badge", "All Features Unlocked", "Custom Challenges"],
      unlockedFeatures: ["Master Mode", "Mentor Access"],
      difficulty: "master"
    }
  ],

  // XP rewards for different activities
  xpRewards: {
    // Quiz completion
    quiz: {
      easy: 10,
      medium: 15,
      hard: 25,
      perfect: 50  // Bonus for 100% score
    },

    // Topic completion
    topic: {
      read: 5,
      practice: 10,
      master: 20
    },

    // Code execution
    code: {
      run: 2,
      success: 5,
      error: 1
    },

    // Daily activities
    daily: {
      login: 5,
      streak: 10,  // Per day in streak
      firstQuiz: 15
    },

    // Special achievements
    achievements: {
      speedDemon: 100,    // Complete quiz in under 2 minutes
      perfectionist: 75,  // 5 perfect scores in a row
      explorer: 50,       // Visit all topics
      helper: 30,         // Help 5 other users
      consistent: 200     // 30-day learning streak
    }
  },

  // Level calculation utilities
  getLevelFromXP: function(xp) {
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (xp >= this.levels[i].xpRequired) {
        return this.levels[i];
      }
    }
    return this.levels[0]; // Default to level 1
  },

  getNextLevel: function(currentXP) {
    const currentLevel = this.getLevelFromXP(currentXP);
    const nextLevelIndex = currentLevel.id;
    return nextLevelIndex < this.levels.length ? this.levels[nextLevelIndex] : null;
  },

  getXPProgress: function(currentXP) {
    const currentLevel = this.getLevelFromXP(currentXP);
    const nextLevel = this.getNextLevel(currentXP);

    if (!nextLevel) {
      return { current: currentXP, required: currentXP, percentage: 100 };
    }

    const levelXP = currentXP - currentLevel.xpRequired;
    const requiredXP = nextLevel.xpRequired - currentLevel.xpRequired;

    return {
      current: levelXP,
      required: requiredXP,
      percentage: Math.min(100, Math.round((levelXP / requiredXP) * 100))
    };
  },

  // Achievement system
  achievements: [
    {
      id: "first_quiz",
      name: "First Steps",
      description: "Complete your first quiz",
      icon: "🎯",
      xpReward: 25,
      condition: (stats) => stats.quizzesCompleted >= 1
    },
    {
      id: "quiz_master",
      name: "Quiz Master",
      description: "Complete 10 quizzes",
      icon: "🏆",
      xpReward: 100,
      condition: (stats) => stats.quizzesCompleted >= 10
    },
    {
      id: "perfect_score",
      name: "Perfectionist",
      description: "Get a perfect score on any quiz",
      icon: "💎",
      xpReward: 75,
      condition: (stats) => stats.perfectScores >= 1
    },
    {
      id: "topic_explorer",
      name: "Explorer",
      description: "Read 5 different topics",
      icon: "🗺️",
      xpReward: 50,
      condition: (stats) => stats.topicsRead >= 5
    },
    {
      id: "code_runner",
      name: "Code Runner",
      description: "Execute 20 code snippets",
      icon: "⚡",
      xpReward: 60,
      condition: (stats) => stats.codeRuns >= 20
    },
    {
      id: "streak_master",
      name: "Consistent Learner",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      xpReward: 150,
      condition: (stats) => stats.currentStreak >= 7
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete a quiz in under 2 minutes",
      icon: "💨",
      xpReward: 100,
      condition: (stats) => stats.fastestQuiz < 120
    },
    {
      id: "all_topics",
      name: "Knowledge Seeker",
      description: "Read all available topics",
      icon: "📚",
      xpReward: 200,
      condition: (stats) => stats.topicsRead >= 50 // Approximate total topics
    },
    {
      id: "level_10",
      name: "Rising Star",
      description: "Reach level 10",
      icon: "⭐",
      xpReward: 300,
      condition: (stats) => stats.level >= 10
    },
    {
      id: "level_20",
      name: "CodeFlow Master",
      description: "Reach the maximum level",
      icon: "👑",
      xpReward: 500,
      condition: (stats) => stats.level >= 20
    }
  ],

  // Daily challenges
  dailyChallenges: [
    {
      id: "daily_quiz",
      name: "Daily Quiz",
      description: "Complete one quiz today",
      xpReward: 25,
      type: "quiz"
    },
    {
      id: "daily_topic",
      name: "Learn Something New",
      description: "Read one new topic",
      xpReward: 15,
      type: "topic"
    },
    {
      id: "daily_code",
      name: "Practice Coding",
      description: "Run 5 code snippets",
      xpReward: 20,
      type: "code"
    },
    {
      id: "daily_streak",
      name: "Keep the Streak",
      description: "Maintain your learning streak",
      xpReward: 10,
      type: "streak"
    }
  ],

  // Leaderboard tiers
  leaderboardTiers: {
    bronze: { minXP: 0, maxXP: 999, name: "Bronze Coder", color: "#CD7F32" },
    silver: { minXP: 1000, maxXP: 2499, name: "Silver Coder", color: "#C0C0C0" },
    gold: { minXP: 2500, maxXP: 4999, name: "Gold Coder", color: "#FFD700" },
    platinum: { minXP: 5000, maxXP: 9999, name: "Platinum Coder", color: "#E5E4E2" },
    diamond: { minXP: 10000, maxXP: 19999, name: "Diamond Coder", color: "#B9F2FF" },
    master: { minXP: 20000, maxXP: Infinity, name: "CodeFlow Master", color: "#FF6B6B" }
  },

  getLeaderboardTier: function(xp) {
    for (const [tier, config] of Object.entries(this.leaderboardTiers)) {
      if (xp >= config.minXP && xp <= config.maxXP) {
        return { ...config, tier };
      }
    }
    return this.leaderboardTiers.bronze;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_LEVELS;
}