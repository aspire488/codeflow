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
      names: ["c", "c programming", "c language"],
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
          "Common pointer mistake: using a pointer that is NULL, uninitialised or already freed. Make it point at valid memory first, either the address of a variable (&x) or memory from malloc(), and check for NULL before dereferencing."
        ],
        memory: [
          "Dynamic memory in C uses malloc(), calloc(), realloc(), and free(). Always free() what you malloc()!",
          "Memory leaks occur when you allocate memory but never free it. Use valgrind or similar tools to detect them.",
          "Stack memory is automatic, heap memory (malloc) needs manual management."
        ],
        functions: [
          "A function is a named, reusable block of code that takes parameters and can return a value. In C, give it a clear purpose and a return type, and use void for functions that don't return a value.",
          "C always passes arguments by value. To modify the caller's data, pass a pointer (the pointer is copied, but it still points at the original). Arrays are passed as a pointer to their first element.",
          "Function prototypes help the compiler know about functions before they're defined."
        ]
      }
    },

    html: {
      names: ["html"],
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
      names: ["css"],
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
      names: ["javascript", "js"],
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
      "Variables store data values. In C: int x = 5; In JS: let x = 5; In CSS: custom properties like --main-color: blue; are variables.",
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
    ],

    recursion: [
      "Recursion is when a function calls itself on a smaller version of the problem. It needs a base case that stops the calls, e.g. fact(n) returns 1 when n <= 1, otherwise n * fact(n - 1).",
      "Each recursive call gets its own stack frame; when the base case returns, the frames unwind one by one. Without a base case you get a stack overflow."
    ],

    stack: [
      "Stack vs heap: the stack holds local variables and function call frames; it is automatic, fast and freed when the function returns, but small. The heap is memory you request with malloc() in C; it lasts until you free() it and is larger, but you must manage it yourself.",
      "Rule of thumb: local variables live on the stack; malloc()'d memory lives on the heap. Forgetting to free() heap memory causes a leak."
    ],

    var: [
      "let vs var in JavaScript: var is function-scoped and hoisted (initialised to undefined); let is block-scoped and cannot be used before its declaration (temporal dead zone). Prefer let, or const when the value never changes. A var declared in a loop also leaks out of the loop block, while a block-scoped let stays inside it."
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
      "In C: a segmentation fault means the program touched memory it isn't allowed to, e.g. dereferencing a NULL or uninitialised pointer, indexing past the end of an array, or using freed memory.",
      "In JS: ReferenceError means using undefined variables."
    ],

    "segmentation fault": [
      "A segmentation fault (segfault) happens when a C program accesses memory it doesn't own: dereferencing a NULL or uninitialised pointer, reading past an array's end, or using memory after free(). Check pointers are valid before using them and compile with -g and run under a debugger or valgrind.",
      "Common segfault causes: scanf(\"%d\", x) without &, writing to a string literal, and unbounded recursion that overflows the stack."
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

    // "Explain X" / "What is X" / bare "X": the concept's definition, always the same one.
    const defined = this.defineTerm(input);
    if (defined) return defined;

    // Check for greetings
    if (this.isGreeting(input)) {
      return this.getRandomResponse(this.greetings);
    }

    // Check for farewells
    if (this.isFarewell(input)) {
      return this.getRandomResponse(this.farewells);
    }

    // Check for subject-specific questions: the subject the user names wins,
    // otherwise the one matching the most keywords (ties go to the first listed).
    let best = null, bestScore = 0;
    for (const [subject, data] of Object.entries(this.subjects)) {
      const score = data.keywords.filter(k => this.has(input, k)).length +
        10 * data.names.filter(n => this.has(input, n)).length;
      if (score > bestScore) { best = subject; bestScore = score; }
    }
    if (best) return this.getSubjectResponse(best, input);

    // Check for general concepts
    for (const [concept, responses] of Object.entries(this.concepts)) {
      if (this.has(input, concept)) {
        return this.getRandomResponse(responses);
      }
    }

    // Check for error-related questions
    for (const [errorType, responses] of Object.entries(this.errors)) {
      if (this.has(input, errorType)) {
        return this.getRandomResponse(responses);
      }
    }

    // Check for help/tips requests
    if (this.has(input, 'help') || this.has(input, 'tip') || this.has(input, 'advice')) {
      return this.getRandomResponse(this.tips);
    }

    // Motivational responses for various inputs
    if (['hard', 'difficult', 'stuck', 'confused', 'frustrated'].some(w => this.has(input, w))) {
      return this.getRandomResponse(this.motivation);
    }

    // Default responses
    const defaultResponses = [
      "I don't have an answer for that. I can help with C (pointers, memory, arrays, functions, loops, recursion), HTML, CSS and JavaScript, plus common errors such as syntax errors and segmentation faults. Try asking, for example, \"What is a pointer?\""
    ];

    return this.getRandomResponse(defaultResponses);
  },

  // Helper methods
  // Whole-word match of a plain-text term (optional plural s/es) so "hi" does not hit "this".
  has: function(input, term) {
    return new RegExp('(^|[^a-z0-9])' + term + '(e?s)?($|[^a-z0-9])').test(input);
  },

  // The first entry of every concept / topic list is its definition. Returns null unless the whole
  // input is just a short term (optionally after "explain", "what is", "define"...).
  defineTerm: function(input) {
    const m = /^\s*(?:(?:explain|define|describe|tell me about|what(?:'s|\s+is|\s+are))\s+)?(?:(?:an?|the)\s+)?([a-z]+(?: [a-z]+){0,2})\s*[?.!]*\s*$/.exec(input);
    if (!m) return null;
    const stem = (w) => w.replace(/s$/, '');
    const term = stem(m[1]);
    const key = Object.keys(this.concepts).find(k => stem(k) === term);
    if (key) return this.concepts[key][0];
    const err = Object.keys(this.errors).find(k => stem(k) === term);
    if (err) return this.errors[err][0];
    for (const data of Object.values(this.subjects)) {
      const topic = Object.keys(data.responses).find(k => k !== 'basics' && stem(k) === term);
      if (topic) return data.responses[topic][0];
    }
    return null;
  },

  isGreeting: function(input) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'];
    return greetings.some(greeting => this.has(input, greeting));
  },

  isFarewell: function(input) {
    const farewells = ['bye', 'goodbye', 'see you', 'later', 'thanks', 'thank you'];
    return farewells.some(farewell => this.has(input, farewell));
  },

  getSubjectResponse: function(subject, input) {
    const data = this.subjects[subject];

    // Check for specific topics within the subject
    for (const [topic, responses] of Object.entries(data.responses)) {
      if (this.has(input, topic) || this.has(input, topic.replace(/s$/, ''))) {
        return this.getRandomResponse(responses);
      }
    }

    // Otherwise prefer a topic whose text actually mentions a keyword the user used
    for (const keyword of data.keywords.filter(k => this.has(input, k)).sort((x, y) => y.length - x.length)) {
      for (const responses of Object.values(data.responses)) {
        const hit = responses.find(text => text.toLowerCase().includes(keyword));
        if (hit) return hit;
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