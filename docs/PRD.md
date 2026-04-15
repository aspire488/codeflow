# CodeFlow Product Requirements Document

## 1. Product Overview

### Product Name
CodeFlow — Interactive Programming Learning Platform

### Product Description
CodeFlow is a lightweight browser-based learning platform designed to help students understand programming concepts through interactive visualization and gamified practice. Built with vanilla JavaScript, it runs entirely in the browser with no backend dependencies, making it fast, reliable, and easy to deploy.

### Target Users
- **Primary:** KTU S2 Computer Science students learning C programming
- **Secondary:** Beginner programmers building foundational concepts
- **Tertiary:** Self-learners seeking interactive programming education

### Problems Solved
Students often struggle with:
- Understanding pointer behavior and memory management
- Visualizing recursion execution flow
- Tracing code line-by-line during exams
- Building logical thinking for problem-solving
- Maintaining engagement with traditional learning materials

CodeFlow addresses these by providing:
- Real-time code execution visualization
- Step-by-step memory state tracking
- Gamified learning with XP and achievements
- Adaptive practice based on performance
- Instant doubt resolution via chatbot

---

## 2. Core Features

### 2.1 Lessons System
- Structured programming lessons covering C fundamentals
- Code examples with syntax highlighting
- Concept explanations with bullet points
- Exam tips and practice questions
- Topic-to-topic navigation

### 2.2 Topic Explorer
- Grid-based topic display with cards
- Progress indicators per topic
- Subject categorization (C, Web Dev)
- Quick access to lessons, quizzes, and visualization

### 2.3 Quiz System
- **MCQ Quizzes:** Multiple choice with instant feedback
- **Output Prediction:** Predict program output, whitespace-insensitive answer checking
- Topic-specific and mixed quizzes
- Score tracking and retry functionality

### 2.4 Visualization Engine
- **Step-by-Step Execution:** Execute code line by line
- **Variable State Display:** Show current values of all variables
- **Pointer Visualization:** Visual representation of pointers and memory addresses
- **Recursion Stack:** Display call stack for recursive functions
- **Loop Trace:** Track iterations with variable changes table

### 2.5 Logic Quest Game
- 12 levels of progressive difficulty
- XP system with level progression
- Boss challenges at key milestones
- Badge achievements
- Progress persistence

### 2.6 Adaptive Practice Engine
- Track student performance per topic
- Identify weak areas automatically
- Recommend practice exercises
- Mastery level tracking
- Smart practice suggestions

### 2.7 Logic Analyzer
- Multi-language support (C, JavaScript, HTML, CSS)
- Code syntax analysis
- Logic flow visualization
- Performance on demand (50K char limit)

### 2.8 Chatbot
- AI-powered doubt assistant
- Keyword-based responses from knowledge base
- Programming-specific responses (C, HTML, CSS, JS)
- XSS-safe message rendering
- Quick access via FAB button

### 2.9 PWA Support
- Installable as standalone app
- Offline mode with cached content
- Service worker for asset caching
- Mobile-responsive design

---

## 3. User Experience Requirements

### 3.1 Navigation
- Hash-based SPA routing
- Deep linking support for all screens
- Fallback to dashboard for invalid routes
- Single active screen at a time

### 3.2 Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 375px, 412px, 768px, 1024px, 1440px
- Touch-friendly targets (minimum 40px)
- No horizontal scrolling
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 3.3 State Persistence
- LocalStorage for user progress
- XP and level tracking
- Quiz scores and completion
- Topic progress
- Graceful handling of corrupted data

### 3.4 Performance
- Total bundle size under 120MB
- Lazy loading for heavy modules
- No infinite loops
- Logic analyzer runs only on demand

---

## 4. Technical Requirements

### 4.1 Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling:** Tailwind CSS (via CDN), custom CSS
- **Icons:** Material Symbols Outlined
- **Storage:** LocalStorage API
- **PWA:** Service Workers, Web App Manifest

### 4.2 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4.3 File Structure
```
codeflow/
├── index.html
├── styles.css
├── app.js
├── router.js
├── vercel.json
├── manifest.json
├── service-worker.js
├── visualizationEngine.js
├── outputPredictionEngine.js
├── logicAnalyzerEngine.js
├── logicQuestEngine.js
├── adaptivePracticeEngine.js
├── selfTestEngine.js
├── chatbot.js
├── topicRenderer.js
├── quizEngine.js
├── gameMode.js
├── data/
│   ├── topicsDB.js
│   ├── quizDB.js
│   ├── outputPredictionDB.js
│   ├── logicQuestDB.js
│   ├── gameLevels.js
│   └── knowledgeBase.js
└── utils/
    └── storage.js
```

---

## 5. Success Metrics

### 5.1 Engagement Metrics
- Average session duration
- Daily active users
- Lesson completion rate
- Quiz attempt rate

### 5.2 Learning Outcomes
- Quiz accuracy improvement over time
- Topic mastery progression
- XP accumulation rate
- Level advancement

### 5.3 Technical Metrics
- Page load time under 3 seconds
- Zero console errors in production
- PWA install rate
- Offline mode usage

---

## 6. Constraints

### 6.1 Technical Constraints
- Vanilla JavaScript only (no frameworks)
- No backend server required
- Low memory footprint
- Works on low-end laptops

### 6.2 Scope Constraints
- Focus on KTU S2 CSE curriculum
- C programming as primary focus
- Web basics as secondary focus

---

## 7. Future Considerations

- User accounts and cloud sync
- Leaderboards and social features
- More programming languages
- Video lessons integration
- Code execution sandbox

---

*Document Version: 1.0*
*Last Updated: April 2026*
*Author: CodeFlow Development Team*