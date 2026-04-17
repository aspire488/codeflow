<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a1b27,100:70a5fd&height=220&section=header&text=CodeFlow&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Prototype%20•%20Execution-Based%20Learning%20System&descAlignY=56&descSize=16"/>
</p><p align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=20&pause=1000&color=70A5FD&center=true&vCenter=true&width=650&lines=Visualize+Code+Execution;Understand+State+Changes;Prototype+Learning+System"/>
</p><p align="center">
<a href="https://codeflow-app-sigma.vercel.app">
<img src="https://img.shields.io/badge/Live%20Preview-Open-green?style=for-the-badge"/>
</a>
</p><p align="center">
<img src="https://img.shields.io/badge/Status-Prototype-orange"/>
<img src="https://img.shields.io/badge/Core-Visualization-purple"/>
<img src="https://img.shields.io/badge/Architecture-Modular-blue"/>
<img src="https://img.shields.io/badge/CI-GitHub%20Actions-success"/>
<img src="https://img.shields.io/badge/Tests-Vitest-blue"/>
</p>---

⚡ CodeFlow — Prototype System Overview

🔗 Live Preview: https://codeflow-app-sigma.vercel.app

CodeFlow is a modular, browser-based prototype built to explore how programming concepts can be taught through execution-level visualization.

The system focuses on:

Execution → State Changes → Conceptual Understanding

---

⚠️ Prototype Scope

This project is not a production application.

It is designed as:

- a system design experiment
- a learning platform prototype
- a foundation for future iteration

What this means

✔ Core concepts implemented
✔ Architecture structured
✔ Features functional

⚠️ Execution engine simplified
⚠️ UI still evolving
⚠️ Some modules experimental

---

🎯 Problem

Most beginners struggle with programming because they cannot:

- track variable changes
- follow execution flow
- simulate code mentally

Traditional approaches rely on:

- static examples
- memorization
- output guessing

---

💡 Approach

CodeFlow introduces a step-based execution model.

Instead of asking:

«“What is the output?”»

It demonstrates:

«“How does the program evolve step-by-step?”»

---

🔍 Core System — Visualization Engine

Example Input

for(int i = 0; i < 3; i++)
    printf("%d", i);

---

Execution Timeline

Step| Phase| Variables| Output
1| Init| i = 0| —
2| Execute| i = 0| 0
3| Increment| i = 1| 0
4| Execute| i = 1| 01
5| Increment| i = 2| 01
6| Execute| i = 2| 012
7| Exit| —| —

---

Processing Pipeline

Code Input
   ↓
Pattern-based Parser
   ↓
Execution Simulator
   ↓
State Tracker
   ↓
Step Generator
   ↓
UI Renderer

---

Capabilities

- variable tracking
- loop simulation
- output accumulation
- step generation

---

Limitations

- rule-based execution
- limited nested logic support
- not a full interpreter

---

🧠 Execution Workflow

User selects topic
      ↓
Code loaded
      ↓
Visualization triggered
      ↓
Execution simulated
      ↓
State transitions generated
      ↓
UI renders steps

---

🧩 Modules

📘 Lessons

Structured learning content

🧪 Quiz Engine

MCQ + output prediction

🎮 Logic Quest

Gamified challenges

🤖 Chatbot

Experimental AI assistance

---

🏗️ Architecture

[ UI ]
  ↓
Router (core)
  ↓
Modules
  ↓
Engines
  ↓
LocalStorage

---

📂 System Structure & Module Breakdown

"src/core/" — Application Core

- routing logic
- app initialization

"src/engines/" — Logic Layer

- visualization engine
- quiz engine
- self-test logic

"src/modules/" — Feature Modules

- lessons
- chatbot
- game
- visualization integration

"src/ui/" — UI Layer

- rendering components
- visualization display
- layout control

"src/utils/" — Utilities

- helpers
- storage abstraction

Other

- "docs/" → internal documentation
- "tests/" → unit tests
- ".github/" → CI pipeline

---

Architecture Flow

UI → Modules → Engines → State → UI

---

Data Flow

User Action
   ↓
UI Event
   ↓
Module Handler
   ↓
Engine Processing
   ↓
State Update
   ↓
UI Re-render

---

⚙️ Tech Stack

<p align="center">
<img src="https://skillicons.dev/icons?i=js,html,css,vite,git,github&theme=dark"/>
</p>---

🧪 Testing

npm test

- quiz engine tests
- visualization tests

---

🔄 CI

GitHub Actions:

- install
- test
- build

---

🧠 Audit Improvements

Before

- messy structure
- no tests
- no CI

After

- modular system
- test coverage
- CI pipeline

---

📊 Maturity

Area| Level
Architecture| Strong
Engine| Early
UI| Early
Testing| Basic

---

🚧 Limitations

- simplified execution engine
- limited parsing
- UI not fully polished
- no backend

---

🔮 Future

- AST-based parsing
- improved visualization UI
- multi-language support

---

👨‍💻 Author

Joel Jigo
B.Tech CSE

---

⭐ Note

Prototype system focused on learning + system design

---

<p align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:70a5fd,100:0d1117&height=120&section=footer"/>
</p>
