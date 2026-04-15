// data/knowledgeBase.js - Knowledge base for CodeFlow chatbot

const KNOWLEDGE_BASE = {
  // General responses
  greetings: [
    "Hello! I'm your CodeFlow assistant. How can I help you learn programming today?",
    "Hi there! Ready to dive into some code? What would you like to know?",
    "Welcome to CodeFlow! I'm here to help you with C programming, HTML, CSS, and JavaScript. What can I assist you with?",
    "Hey! I'm your coding companion. Let's explore programming concepts together!"
  ],

  farewells: [
    "Happy coding! Come back anytime you need help.",
    "Keep practicing! You're doing great with CodeFlow.",
    "See you next time! Don't forget to run some code.",
    "Goodbye! Remember, practice makes perfect in programming."
  ],

  // Subject-specific knowledge
  subjects: {
    c: {
      keywords: ["c programming", "c language", "c code", "pointer", "memory", "struct", "array", "function", "loop", "variable"],
      responses: {
        basics: [
          "C is a powerful systems programming language created by Dennis Ritchie in 1972. It's known for its efficiency and low-level control.",
          "C programming focuses on structured programming with functions, loops, and conditional statements. It's the foundation for many modern languages.",
          "In C, you work directly with memory using pointers, which gives you great control but requires careful management."
        ],
        pointers: [
          "Pointers in C store memory addresses. Use & to get an address and * to dereference. They're powerful but can be tricky!",
          "A pointer variable holds the address of another variable. int *ptr = &x; means ptr points to integer x.",
          "Common pointer mistake: forgetting to allocate memory with malloc() before using pointers."
        ],
        memory: [
          "Dynamic memory in C uses malloc(), calloc(), realloc(), and free(). Always free() what you malloc()!",
          "Memory leaks occur when you allocate memory but never free it. Use valgrind or similar tools to detect them.",
          "Stack memory is automatic, heap memory (malloc) needs manual management."
        ],
        functions: [
          "Functions in C should have a clear purpose and return type. Use void for functions that don't return values.",
          "Pass by value copies data, pass by reference (using pointers) modifies original data.",
          "Function prototypes help the compiler know about functions before they're defined."
        ]
      }
    },

    html: {
      keywords: ["html", "web page", "markup", "tag", "element", "attribute", "semantic", "form", "table", "link"],
      responses: {
        basics: [
          "HTML (HyperText Markup Language) structures web content using tags like <h1>, <p>, <div>.",
          "HTML5 introduced semantic elements like <header>, <nav>, <article> for better accessibility.",
          "Every HTML page needs <!DOCTYPE html>, <html>, <head>, and <body> tags."
        ],
        forms: [
          "HTML forms use <form> with <input>, <textarea>, <select> elements. Don't forget the name attribute!",
          "Input types include text, email, password, number, date, and more for better user experience.",
          "Form validation can be done with HTML5 attributes like required, pattern, min, max."
        ],
        semantic: [
          "Semantic HTML uses meaningful tags like <article>, <section>, <aside> instead of generic <div>s.",
          "Screen readers and search engines love semantic HTML for better understanding of content.",
          "Use <header> for page headers, <nav> for navigation, <main> for main content, <footer> for footers."
        ]
      }
    },

    css: {
      keywords: ["css", "style", "layout", "flexbox", "grid", "selector", "property", "responsive", "media query"],
      responses: {
        basics: [
          "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.",
          "CSS uses selectors (like .class, #id, element) to target HTML elements for styling.",
          "The cascade means more specific selectors override general ones, and !important overrides everything."
        ],
        layout: [
          "CSS layout methods: block (full width), inline (only content width), inline-block (both).",
          "Flexbox is great for 1D layouts, CSS Grid for 2D layouts. Use flex-direction and grid-template.",
          "Position: relative moves from normal position, absolute from nearest positioned ancestor, fixed from viewport."
        ],
        responsive: [
          "Responsive design uses media queries like @media (max-width: 768px) to adapt to screen sizes.",
          "Use relative units like em, rem, %, vw/vh instead of px for responsive design.",
          "Mobile-first approach: design for small screens first, then enhance for larger screens."
        ]
      }
    },

    javascript: {
      keywords: ["javascript", "js", "script", "function", "variable", "object", "array", "dom", "event", "async"],
      responses: {
        basics: [
          "JavaScript is a dynamic, interpreted language that runs in browsers and servers (Node.js).",
          "Use let/const for variables, const for constants. var is outdated and has scoping issues.",
          "JavaScript is weakly typed - variables can hold any type, but use === for strict equality."
        ],
        dom: [
          "DOM (Document Object Model) represents HTML as a tree. Use document.querySelector() to select elements.",
          "Manipulate content with textContent (safe) or innerHTML (can execute scripts).",
          "Events like click, submit, load use addEventListener() for modern event handling."
        ],
        functions: [
          "Functions are first-class citizens in JS. Use arrow functions () => {} for concise syntax.",
          "Default parameters: function f(a = 1, b = 2). Rest parameters: function f(...args).",
          "Promises and async/await handle asynchronous operations like API calls and timeouts."
        ]
      }
    }
  },

  // Common programming concepts
  concepts: {
    variables: [
      "Variables store data values. In C: int x = 5; In JS: let x = 5; In HTML/CSS: use for dynamic content.",
      "Choose meaningful variable names. Use camelCase in JS, snake_case in C.",
      "Variables have scope: global (everywhere) vs local (inside functions/classes)."
    ],

    loops: [
      "Loops repeat code: for (counter), while (condition), do-while (at least once).",
      "Avoid infinite loops by ensuring the exit condition can be met.",
      "Use break to exit early, continue to skip current iteration."
    ],

    conditionals: [
      "if-else statements control program flow based on conditions.",
      "Use && (AND), || (OR), ! (NOT) for complex conditions.",
      "Switch statements are good for multiple specific values."
    ],

    arrays: [
      "Arrays store multiple values. C: int arr[5]; JS: let arr = [1,2,3];",
      "Access elements by index (starting from 0).",
      "Arrays can be multidimensional for tables/matrices."
    ],

    functions: [
      "Functions organize code into reusable blocks with inputs (parameters) and outputs (return values).",
      "Pure functions give same output for same inputs, have no side effects.",
      "Recursion: functions calling themselves, needs a base case to stop."
    ]
  },

  // Error explanations
  errors: {
    "syntax error": [
      "Syntax errors are grammar mistakes in code. Check semicolons, brackets, and spelling.",
      "Common causes: missing semicolons, unmatched braces, typos in keywords.",
      "Your code editor usually highlights syntax errors with red squiggly lines."
    ],

    "runtime error": [
      "Runtime errors occur while code runs. Examples: division by zero, null pointer access.",
      "In C: segmentation faults often mean invalid memory access.",
      "In JS: ReferenceError means using undefined variables."
    ],

    "logic error": [
      "Logic errors: code runs but gives wrong results. Use debugging to find these.",
      "Add console.log() or printf() statements to trace variable values.",
      "Unit tests help catch logic errors early."
    ]
  },

  // Learning tips
  tips: [
    "Practice regularly! Code every day, even if just for 30 minutes.",
    "Don't just read code - write it, run it, break it, fix it.",
    "Use online resources like MDN, W3Schools, GeeksforGeeks alongside CodeFlow.",
    "Join coding communities on Reddit, Stack Overflow, Discord.",
    "Teach others what you learn - it reinforces your own understanding.",
    "Debug systematically: isolate the problem, check assumptions, use print statements.",
    "Read other people's code on GitHub to learn different approaches.",
    "Build projects! Apply concepts to real problems.",
    "Take breaks when stuck - sometimes the solution comes when you step away.",
    "Keep a coding journal of what you learn and problems you solve."
  ],

  // Motivational messages
  motivation: [
    "You're making great progress! Every expert was once a beginner.",
    "Programming is like solving puzzles. Each bug you fix makes you stronger.",
    "Don't worry about mistakes - they're how you learn!",
    "You're building valuable skills that will open many doors.",
    "Consistency beats intensity. Keep showing up!",
    "You're not just learning syntax, you're learning to think logically.",
    "Every great programmer started exactly where you are now.",
    "Progress might be slow, but it's happening. Keep going!",
    "You're developing a superpower: the ability to create with code.",
    "Celebrate small wins - they add up to big achievements!"
  ],

  // Get response based on user input
  getResponse: function(userInput) {
    const input = userInput.toLowerCase();

    // Check for greetings
    if (this.isGreeting(input)) {
      return this.getRandomResponse(this.greetings);
    }

    // Check for farewells
    if (this.isFarewell(input)) {
      return this.getRandomResponse(this.farewells);
    }

    // Check for subject-specific questions
    for (const [subject, data] of Object.entries(this.subjects)) {
      if (data.keywords.some(keyword => input.includes(keyword))) {
        return this.getSubjectResponse(subject, input);
      }
    }

    // Check for general concepts
    for (const [concept, responses] of Object.entries(this.concepts)) {
      if (input.includes(concept)) {
        return this.getRandomResponse(responses);
      }
    }

    // Check for error-related questions
    for (const [errorType, responses] of Object.entries(this.errors)) {
      if (input.includes(errorType)) {
        return this.getRandomResponse(responses);
      }
    }

    // Check for help/tips requests
    if (input.includes('help') || input.includes('tip') || input.includes('advice')) {
      return this.getRandomResponse(this.tips);
    }

    // Motivational responses for various inputs
    if (input.includes('hard') || input.includes('difficult') || input.includes('stuck') ||
        input.includes('confused') || input.includes('frustrated')) {
      return this.getRandomResponse(this.motivation);
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! Could you be more specific about what you'd like to know?",
      "I'm here to help with C programming, HTML, CSS, and JavaScript. What specific topic interests you?",
      "Let me know what programming concept you're working on, and I'll do my best to assist!",
      "Feel free to ask about variables, functions, loops, or any other programming concepts!"
    ];

    return this.getRandomResponse(defaultResponses);
  },

  // Helper methods
  isGreeting: function(input) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'];
    return greetings.some(greeting => input.includes(greeting));
  },

  isFarewell: function(input) {
    const farewells = ['bye', 'goodbye', 'see you', 'later', 'thanks', 'thank you'];
    return farewells.some(farewell => input.includes(farewell));
  },

  getSubjectResponse: function(subject, input) {
    const data = this.subjects[subject];

    // Check for specific topics within the subject
    for (const [topic, responses] of Object.entries(data.responses)) {
      if (input.includes(topic)) {
        return this.getRandomResponse(responses);
      }
    }

    // Return general subject response
    return this.getRandomResponse(data.responses.basics || data.responses);
  },

  getRandomResponse: function(responses) {
    if (!Array.isArray(responses) || responses.length === 0) {
      return "I'm not sure about that. Could you rephrase your question?";
    }
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KNOWLEDGE_BASE;
}