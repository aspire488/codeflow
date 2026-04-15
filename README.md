# CodeFlow — Interactive Programming Learning Platform

![GitHub stars](https://img.shields.io/github/stars/aspire488/codeflow)
![GitHub forks](https://img.shields.io/github/forks/aspire488/codeflow)
![License](https://img.shields.io/github/license/aspire488/codeflow)

CodeFlow is a lightweight browser-based learning platform designed to help students understand programming concepts through interactive visualization and gamified practice. Built with vanilla JavaScript, it runs entirely in the browser with no backend dependencies.

## Features

CodeFlow provides a comprehensive learning experience with the following features:

- **Lessons** — Structured programming lessons covering C programming fundamentals
- **Topic Explorer** — Browse and select topics with progress tracking
- **Quiz System** — MCQ quizzes with instant feedback and output prediction exercises
- **Visualization Engine** — Step-by-step code execution with memory state display
- **Pointer Visualization** — Interactive pointer and memory visualization
- **Recursion Stack** — Visual representation of recursive function calls
- **Loop Trace** — Track loop iterations with variable states
- **Logic Quest Game** — Gamified learning with 12 levels and XP system
- **Adaptive Practice Engine** — Intelligent practice recommendations based on performance
- **Logic Analyzer** — Multi-language code analysis (C, JavaScript, HTML, CSS)
- **Chatbot** — AI-powered doubt assistant for programming questions
- **PWA Support** — Installable as a progressive web app with offline capability

## Example: Code Visualization

CodeFlow transforms static code into interactive execution:

```c
for(int i = 0; i < 3; i++)
    printf("%d", i);
```

When you use the Visualization Engine, you'll see:

| Step | i Value | Output |
|------|---------|--------|
| 1    | 0       | 0      |
| 2    | 1       | 01     |
| 3    | 2       | 012    |
| 4    | (exit)  | —      |

This helps students understand exactly how loops execute and when they terminate.

## Screenshots

### Dashboard
The main dashboard displays topic cards with progress indicators and quick access to all learning modes.

### Visualization Engine
Step-through visualization shows code execution with variable states and memory changes in real-time.

### Quiz System
Multiple choice and output prediction quizzes provide instant feedback and explanations.

### Logic Quest
Gamified learning with levels, XP, badges, and boss challenges keeps students engaged.

## Installation

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/aspire488/codeflow.git
   cd codeflow
   ```

2. Start a local server:
   ```bash
   python -m http.server 8080
   ```

3. Open your browser:
   ```
   http://localhost:8080
   ```

### Deployment

#### Vercel (Recommended)

1. Import the repository in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

2. Your app will be live at:
   ```
   https://codeflow.vercel.app
   ```

#### Manual Deploy

```bash
npm i -g vercel
vercel deploy
```

## Tech Stack

- **HTML5** — Semantic markup with accessibility
- **CSS3** — Responsive design with Tailwind CSS
- **Vanilla JavaScript** — ES6+ with no frameworks
- **Service Workers** — PWA functionality and caching
- **LocalStorage** — State persistence across sessions
- **Material Symbols** — Icon library

## Target Users

CodeFlow is designed for:

- **KTU S2 Computer Science students** learning C programming
- **Beginner programmers** building foundational concepts
- **Self-learners** seeking interactive programming education

Topics covered:
- C Programming (variables, loops, functions, pointers, arrays, recursion)
- Web Development Basics (HTML, CSS, JavaScript)
- Logic Building (conditional statements, operators, algorithms)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

If you find this project useful, please consider giving it a ⭐ on GitHub!

## Acknowledgments

- KTU S2 CSE curriculum for topic requirements
- Material Design for UI inspiration
- Open source community for tools and resources