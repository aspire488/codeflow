// data/topicsDB.js - Complete topic database for CodeFlow

const TOPICS_DB = {
  // C PROGRAMMING BASICS
  "c-basics": {
    title: "C Program Structure",
    subject: "c",
    concept: [
      "Every C program starts with main() function",
      "Include header files using #include directive",
      "Program execution begins at main()",
      "return 0 indicates successful execution"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    explanation: [
      "#include <stdio.h> - Includes standard I/O functions",
      "int main() - Entry point function",
      "printf() - Outputs text to console",
      "return 0 - Indicates successful program termination"
    ],
    examTip: "Always include necessary headers and return 0 from main()",
    practiceQ: "Write a program that prints 'Welcome to C Programming'",
    quiz: [
      {
        question: "What is the entry point of a C program?",
        options: ["start()", "main()", "run()", "begin()"],
        correct: 1,
        explanation: "main() is the mandatory function where program execution begins."
      },
      {
        question: "What does #include <stdio.h> do?",
        options: ["Includes math functions", "Includes I/O functions", "Includes string functions", "Includes memory functions"],
        correct: 1,
        explanation: "#include <stdio.h> provides input/output functions like printf() and scanf()."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Preprocessor includes stdio.h header" },
      { variables: {}, output: "main() function called" },
      { variables: {}, output: "printf() executes: 'Hello, World!'" },
      { variables: {}, output: "return 0 exits program successfully" }
    ]
  },

  "variables": {
    title: "Variables & Data Types",
    subject: "c",
    concept: [
      "Variables store data with specific data types",
      "Common types: int, float, char, double",
      "Variables must be declared before use",
      "Naming: letters, digits, underscore (no spaces)"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int age = 20;\n    float height = 5.9;\n    char grade = 'A';\n    \n    printf("Age: %d\\n", age);\n    printf("Height: %.1f\\n", height);\n    printf("Grade: %c\\n", grade);\n    \n    return 0;\n}`,
    explanation: [
      "int age = 20 - Integer variable declaration and initialization",
      "float height = 5.9 - Floating point variable",
      "char grade = 'A' - Character variable",
      "printf with %d, %f, %c - Format specifiers for different types"
    ],
    examTip: "Use correct format specifiers: %d for int, %f for float, %c for char, %s for string",
    practiceQ: "Declare variables for name (string), marks (float), and roll_no (int)",
    quiz: [
      {
        question: "Which data type stores decimal numbers?",
        options: ["int", "char", "float", "void"],
        correct: 2,
        explanation: "float stores floating-point numbers (decimals)."
      },
      {
        question: "What is the output: int x = 5; printf(\"%d\", x);",
        options: ["5.0", "5", "x", "Error"],
        correct: 1,
        explanation: "%d format specifier prints integer values."
      }
    ],
    visualizationSteps: [
      { variables: { age: "20 (int)" }, output: "age variable allocated and assigned 20" },
      { variables: { age: "20", height: "5.9 (float)" }, output: "height variable allocated and assigned 5.9" },
      { variables: { age: "20", height: "5.9", grade: "'A' (char)" }, output: "grade variable allocated and assigned 'A'" },
      { variables: { age: "20", height: "5.9", grade: "'A'" }, output: "printf() displays formatted output" }
    ]
  },

  "data-types": {
    title: "Data Types & Storage",
    subject: "c",
    concept: [
      "Primitive types: int, float, char, double, void",
      "Derived types: arrays, pointers, structures",
      "Size varies by platform (use sizeof())",
      "Type determines memory allocation and operations"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    printf("Size of int: %lu bytes\\n", sizeof(int));\n    printf("Size of float: %lu bytes\\n", sizeof(float));\n    printf("Size of char: %lu bytes\\n", sizeof(char));\n    printf("Size of double: %lu bytes\\n", sizeof(double));\n    \n    return 0;\n}`,
    explanation: [
      "sizeof() operator returns size in bytes",
      "int typically 4 bytes, float 4 bytes, char 1 byte, double 8 bytes",
      "Sizes may vary on different systems",
      "Use sizeof() for portable code"
    ],
    examTip: "Remember: char (1), int/float (4), double (8) bytes typically",
    practiceQ: "Write a program to display sizes of all primitive data types",
    quiz: [
      {
        question: "How many bytes does int typically occupy?",
        options: ["1", "2", "4", "8"],
        correct: 2,
        explanation: "int is typically 4 bytes (32 bits) on modern systems."
      }
    ],
    visualizationSteps: []
  },

  "operators": {
    title: "Operators",
    subject: "c",
    concept: [
      "Arithmetic: +, -, *, /, %",
      "Relational: <, >, <=, >=, ==, !=",
      "Logical: &&, ||, !",
      "Assignment: =, +=, -=, *=, /=",
      "Increment/Decrement: ++, --"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int a = 10, b = 3;\n    \n    printf("a + b = %d\\n", a + b);\n    printf("a - b = %d\\n", a - b);\n    printf("a * b = %d\\n", a * b);\n    printf("a / b = %d\\n", a / b);\n    printf("a %% b = %d\\n", a % b);\n    \n    return 0;\n}`,
    explanation: [
      "Arithmetic operators work on numeric values",
      "% is modulus operator (remainder)",
      "Integer division truncates decimal part",
      "Operator precedence: * / % > + -"
    ],
    examTip: "Integer division: 5/2 = 2, not 2.5. Use float for decimal results.",
    practiceQ: "Calculate and print: (a + b) * (c - d) where a=5, b=3, c=10, d=2",
    quiz: [
      {
        question: "What is the output of 7 % 3?",
        options: ["2", "2.33", "21", "1"],
        correct: 0,
        explanation: "7 divided by 3 is 2 with remainder 1, so 7 % 3 = 1."
      }
    ],
    visualizationSteps: [
      { variables: { a: "10", b: "3" }, output: "Variables initialized" },
      { variables: { a: "10", b: "3", result: "13" }, output: "a + b = 13" },
      { variables: { a: "10", b: "3", result: "7" }, output: "a - b = 7" },
      { variables: { a: "10", b: "3", result: "30" }, output: "a * b = 30" },
      { variables: { a: "10", b: "3", result: "3" }, output: "a / b = 3 (integer division)" },
      { variables: { a: "10", b: "3", result: "1" }, output: "a % b = 1 (remainder)" }
    ]
  },

  "input-output": {
    title: "Input & Output",
    subject: "c",
    concept: [
      "printf() - formatted output to console",
      "scanf() - formatted input from keyboard",
      "Format specifiers: %d, %f, %c, %s",
      "&variable - address operator for scanf()"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int age;\n    char name[50];\n    \n    printf("Enter your name: ");\n    scanf("%s", name);\n    \n    printf("Enter your age: ");\n    scanf("%d", &age);\n    \n    printf("Hello %s, you are %d years old!\\n", name, age);\n    \n    return 0;\n}`,
    explanation: [
      "scanf() needs & for variables (except arrays)",
      "Format specifiers must match variable types",
      "%s for strings doesn't need &",
      "Always check scanf() return value in real programs"
    ],
    examTip: "Never forget & in scanf() for non-array variables",
    practiceQ: "Write a program to input two numbers and print their sum",
    quiz: [
      {
        question: "What does scanf() return?",
        options: ["void", "Number of successfully read items", "The input value", "Error code"],
        correct: 1,
        explanation: "scanf() returns the number of input items successfully read."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Program waits for user input" },
      { variables: { name: "'John'" }, output: "User enters name: John" },
      { variables: { name: "'John'", age: "25" }, output: "User enters age: 25" },
      { variables: { name: "'John'", age: "25" }, output: "printf() displays formatted message" }
    ]
  },

  // CONTROL FLOW
  "conditionals": {
    title: "Conditional Statements",
    subject: "c",
    concept: [
      "if statement executes code when condition is true",
      "if-else provides alternative execution paths",
      "Nested if statements for complex conditions",
      "Conditions use relational operators"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int marks = 85;\n    \n    if (marks >= 90) {\n        printf("Grade: A\\n");\n    } else if (marks >= 80) {\n        printf("Grade: B\\n");\n    } else if (marks >= 70) {\n        printf("Grade: C\\n");\n    } else {\n        printf("Grade: F\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "if (condition) - executes when condition is true",
      "else if - checks additional conditions",
      "else - executes when all conditions are false",
      "Conditions: >=, <=, ==, !=, >, <"
    ],
    examTip: "Use == for comparison, = for assignment. Common mistake!",
    practiceQ: "Write a program to check if a number is positive, negative, or zero",
    quiz: [
      {
        question: "What is wrong with: if (x = 5) ?",
        options: ["Missing braces", "Wrong operator", "Missing semicolon", "Wrong syntax"],
        correct: 1,
        explanation: "= is assignment, == is comparison. Should be if (x == 5)"
      }
    ],
    visualizationSteps: [
      { variables: { marks: "85" }, output: "marks = 85" },
      { variables: { marks: "85" }, output: "Check: 85 >= 90? False" },
      { variables: { marks: "85" }, output: "Check: 85 >= 80? True" },
      { variables: { marks: "85" }, output: "Execute: printf('Grade: B')" }
    ]
  },

  "switch-case": {
    title: "Switch Case Statements",
    subject: "c",
    concept: [
      "switch evaluates expression against case values",
      "case labels specify execution points",
      "break prevents fall-through to next case",
      "default case handles unmatched values"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int day = 3;\n    \n    switch (day) {\n        case 1:\n            printf("Monday\\n");\n            break;\n        case 2:\n            printf("Tuesday\\n");\n            break;\n        case 3:\n            printf("Wednesday\\n");\n            break;\n        default:\n            printf("Invalid day\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "switch (expression) - evaluates once",
      "case value: - jump point for matching value",
      "break - exits switch statement",
      "default - executes when no case matches"
    ],
    examTip: "Always use break after each case, except sometimes for intentional fall-through",
    practiceQ: "Write switch case for calculator operations (+, -, *, /)",
    quiz: [
      {
        question: "What happens without break in switch?",
        options: ["Error", "Fall-through to next case", "Default executes", "Nothing"],
        correct: 1,
        explanation: "Without break, execution continues to next case (fall-through)."
      }
    ],
    visualizationSteps: [
      { variables: { day: "3" }, output: "day = 3" },
      { variables: { day: "3" }, output: "switch(day) evaluates to 3" },
      { variables: { day: "3" }, output: "case 3 matches, execute printf('Wednesday')" },
      { variables: { day: "3" }, output: "break exits switch statement" }
    ]
  },

  "loops": {
    title: "Looping Statements",
    subject: "c",
    concept: [
      "for loop: initialization, condition, increment",
      "while loop: condition checked before execution",
      "do-while loop: condition checked after execution",
      "break exits loop, continue skips to next iteration"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    // For loop\n    for (int i = 1; i <= 5; i++) {\n        printf("%d ", i);\n    }\n    printf("\\n");\n    \n    // While loop\n    int j = 1;\n    while (j <= 5) {\n        printf("%d ", j);\n        j++;\n    }\n    \n    return 0;\n}`,
    explanation: [
      "for(int i=1; i<=5; i++) - init, condition, increment",
      "while(condition) - repeats while condition is true",
      "do-while executes at least once",
      "Infinite loops: for(;;) or while(1)"
    ],
    examTip: "for loops for known iterations, while for unknown. Watch for off-by-one errors.",
    practiceQ: "Print numbers from 10 to 1 using for loop",
    quiz: [
      {
        question: "How many times does for(i=0; i<5; i++) execute?",
        options: ["4", "5", "6", "Infinite"],
        correct: 1,
        explanation: "i starts at 0, executes while i<5, so i=0,1,2,3,4 (5 times)."
      }
    ],
    visualizationSteps: [
      { variables: { i: "1" }, output: "for loop starts, i=1" },
      { variables: { i: "1" }, output: "Check: 1 <= 5? True, print 1" },
      { variables: { i: "2" }, output: "i++, i=2, print 2" },
      { variables: { i: "3" }, output: "i++, i=3, print 3" },
      { variables: { i: "4" }, output: "i++, i=4, print 4" },
      { variables: { i: "5" }, output: "i++, i=5, print 5" },
      { variables: { i: "6" }, output: "i=6, 6<=5? False, loop ends" }
    ]
  },

  "nested-loops": {
    title: "Nested Loops",
    subject: "c",
    concept: [
      "Loops inside loops for multi-dimensional processing",
      "Outer loop controls rows, inner loop controls columns",
      "Common for matrices, patterns, complex iterations",
      "Time complexity increases: O(n²) for two nested loops"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        for (int j = 1; j <= 3; j++) {\n            printf("%d ", i * j);\n        }\n        printf("\\n");\n    }\n    return 0;\n}`,
    explanation: [
      "Outer loop i: 1,2,3",
      "Inner loop j: 1,2,3 for each i",
      "Prints multiplication table",
      "Time complexity: O(n²)"
    ],
    examTip: "Use nested loops for matrices, patterns. Watch variable names (i,j,k)",
    practiceQ: "Print a 3x3 matrix with numbers 1-9",
    quiz: [
      {
        question: "Time complexity of two nested for loops?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(2^n)"],
        correct: 1,
        explanation: "Two nested loops give O(n²) time complexity."
      }
    ],
    visualizationSteps: [
      { variables: { i: "1", j: "1" }, output: "Outer i=1, inner j=1, print 1" },
      { variables: { i: "1", j: "2" }, output: "j=2, print 2" },
      { variables: { i: "1", j: "3" }, output: "j=3, print 3, newline" },
      { variables: { i: "2", j: "1" }, output: "Outer i=2, inner j=1, print 2" },
      { variables: { i: "2", j: "2" }, output: "j=2, print 4" },
      { variables: { i: "2", j: "3" }, output: "j=3, print 6, newline" }
    ]
  },

  // FUNCTIONS
  "functions": {
    title: "Functions",
    subject: "c",
    concept: [
      "Functions break code into reusable modules",
      "Declaration: return_type function_name(parameters)",
      "Definition: function body with logic",
      "Call: function_name(arguments)"
    ],
    code: `#include <stdio.h>\n\n// Function declaration\nint add(int a, int b);\n\nint main() {\n    int result = add(5, 3);\n    printf("Sum: %d\\n", result);\n    return 0;\n}\n\n// Function definition\nint add(int a, int b) {\n    return a + b;\n}`,
    explanation: [
      "Function declaration tells compiler about function",
      "Function definition contains the actual code",
      "Parameters are local variables",
      "return statement sends value back"
    ],
    examTip: "Declare functions before main() or define before use",
    practiceQ: "Write a function to find maximum of two numbers",
    quiz: [
      {
        question: "What is function prototype?",
        options: ["Function definition", "Function declaration", "Function call", "Return statement"],
        correct: 1,
        explanation: "Function prototype is the declaration that tells compiler about function signature."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "main() starts execution" },
      { variables: { result: "add(5,3)" }, output: "Call add function with arguments 5,3" },
      { variables: { a: "5", b: "3" }, output: "Function parameters a=5, b=3" },
      { variables: { a: "5", b: "3", sum: "8" }, output: "Calculate a + b = 8" },
      { variables: { result: "8" }, output: "Return 8 to main(), result = 8" },
      { variables: { result: "8" }, output: "printf displays 'Sum: 8'" }
    ]
  },

  "recursion": {
    title: "Recursion",
    subject: "c",
    concept: [
      "Function that calls itself",
      "Must have base case to stop recursion",
      "Recursive case calls function with smaller problem",
      "Uses stack memory for each call"
    ],
    code: `#include <stdio.h>\n\nint factorial(int n) {\n    if (n == 0 || n == 1) {\n        return 1;  // Base case\n    }\n    return n * factorial(n - 1);  // Recursive case\n}\n\nint main() {\n    printf("5! = %d\\n", factorial(5));\n    return 0;\n}`,
    explanation: [
      "factorial(5) calls factorial(4)",
      "factorial(4) calls factorial(3)",
      "...until factorial(1) returns 1",
      "Then multiplies back up: 1*2*3*4*5 = 120"
    ],
    examTip: "Always have base case. Stack overflow if too deep recursion.",
    practiceQ: "Write recursive function to calculate sum of first n natural numbers",
    quiz: [
      {
        question: "What happens without base case in recursion?",
        options: ["Function returns 0", "Stack overflow", "Compilation error", "Infinite loop"],
        correct: 1,
        explanation: "Without base case, recursion never stops, causing stack overflow."
      }
    ],
    visualizationSteps: [
      { variables: { n: "5" }, output: "factorial(5) called" },
      { variables: { n: "4" }, output: "factorial(4) called" },
      { variables: { n: "3" }, output: "factorial(3) called" },
      { variables: { n: "2" }, output: "factorial(2) called" },
      { variables: { n: "1" }, output: "factorial(1) = 1 (base case)" },
      { variables: { n: "2", result: "2" }, output: "2 * 1 = 2" },
      { variables: { n: "3", result: "6" }, output: "3 * 2 = 6" },
      { variables: { n: "4", result: "24" }, output: "4 * 6 = 24" },
      { variables: { n: "5", result: "120" }, output: "5 * 24 = 120" }
    ]
  },

  // ARRAYS AND STRINGS
  "arrays": {
    title: "Arrays",
    subject: "c",
    concept: [
      "Collection of similar data items",
      "Fixed size declared at compile time",
      "Zero-based indexing: array[0] to array[size-1]",
      "Contiguous memory allocation"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int marks[5] = {85, 92, 78, 96, 88};\n    \n    printf("Marks: ");\n    for (int i = 0; i < 5; i++) {\n        printf("%d ", marks[i]);\n    }\n    printf("\\n");\n    \n    // Calculate average\n    int sum = 0;\n    for (int i = 0; i < 5; i++) {\n        sum += marks[i];\n    }\n    printf("Average: %.2f\\n", (float)sum / 5);\n    \n    return 0;\n}`,
    explanation: [
      "int marks[5] - declares array of 5 integers",
      "Initialization with {85, 92, 78, 96, 88}",
      "Access elements with marks[0], marks[1], etc.",
      "Array name is pointer to first element"
    ],
    examTip: "Array size must be constant. No bounds checking - be careful!",
    practiceQ: "Find maximum element in an array of 10 integers",
    quiz: [
      {
        question: "What is the first index of an array?",
        options: ["-1", "0", "1", "Size-1"],
        correct: 1,
        explanation: "Arrays are zero-based, so first element is at index 0."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Array marks[5] allocated in memory" },
      { variables: { "marks[0]": "85", "marks[1]": "92", "marks[2]": "78", "marks[3]": "96", "marks[4]": "88" }, output: "Array initialized with values" },
      { variables: { i: "0", sum: "0" }, output: "Loop starts, i=0, sum=0" },
      { variables: { i: "0", sum: "85" }, output: "sum += marks[0] = 85" },
      { variables: { i: "1", sum: "177" }, output: "sum += marks[1] = 92, total 177" },
      { variables: { i: "2", sum: "255" }, output: "sum += marks[2] = 78, total 255" },
      { variables: { i: "3", sum: "351" }, output: "sum += marks[3] = 96, total 351" },
      { variables: { i: "4", sum: "439" }, output: "sum += marks[4] = 88, total 439" },
      { variables: { i: "5" }, output: "Loop ends, calculate average: 439/5 = 87.8" }
    ]
  },

  "multidimensional-arrays": {
    title: "2D Arrays",
    subject: "c",
    concept: [
      "Arrays of arrays (matrices)",
      "Declaration: data_type array[row][col]",
      "Access: array[i][j]",
      "Row-major storage in memory"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int matrix[3][3] = {\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9}\n    };\n    \n    printf("Matrix:\\n");\n    for (int i = 0; i < 3; i++) {\n        for (int j = 0; j < 3; j++) {\n            printf("%d ", matrix[i][j]);\n        }\n        printf("\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "int matrix[3][3] - 3x3 integer matrix",
      "Nested initialization with curly braces",
      "Outer loop for rows, inner loop for columns",
      "matrix[i][j] accesses element at row i, column j"
    ],
    examTip: "First dimension can be omitted in initialization, second cannot",
    practiceQ: "Add two 2x2 matrices and store result in third matrix",
    quiz: [
      {
        question: "How to access element at row 2, column 3?",
        options: ["matrix[2][3]", "matrix[3][2]", "matrix[1][2]", "matrix[2][2]"],
        correct: 0,
        explanation: "Arrays are zero-based, so row 2 is index 2, column 3 is index 3."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "3x3 matrix allocated in memory" },
      { variables: {}, output: "Matrix initialized with values 1-9" },
      { variables: { i: "0", j: "0" }, output: "Print row 0: 1 2 3" },
      { variables: { i: "1", j: "0" }, output: "Print row 1: 4 5 6" },
      { variables: { i: "2", j: "0" }, output: "Print row 2: 7 8 9" }
    ]
  },

  "string-basics": {
    title: "Strings",
    subject: "c",
    concept: [
      "Character arrays ending with null terminator '\\0'",
      "String literals: \"Hello\"",
      "Library functions in <string.h>",
      "No built-in string type in C"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char name[20] = "John";\n    char greeting[] = "Hello";\n    \n    printf("Name: %s\\n", name);\n    printf("Length: %lu\\n", strlen(name));\n    \n    // Copy string\n    char copy[20];\n    strcpy(copy, name);\n    printf("Copy: %s\\n", copy);\n    \n    return 0;\n}`,
    explanation: [
      "char name[20] - character array for string",
      "Strings end with '\\0' automatically",
      "strlen() returns length excluding null terminator",
      "strcpy() copies strings safely"
    ],
    examTip: "Always allocate space for null terminator. Use strcpy/strncpy safely.",
    practiceQ: "Write a program to concatenate two strings without using strcat()",
    quiz: [
      {
        question: "What terminates a C string?",
        options: ["Space", "Newline", "Null character \\0", "EOF"],
        correct: 2,
        explanation: "C strings are null-terminated, ending with '\\0' character."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "char name[20] allocated" },
      { variables: { "name[0]": "'J'", "name[1]": "'o'", "name[2]": "'h'", "name[3]": "'n'", "name[4]": "'\\0'" }, output: "String 'John' stored with null terminator" },
      { variables: { length: "4" }, output: "strlen() counts characters until \\0" },
      { variables: {}, output: "strcpy() copies characters including \\0" }
    ]
  },

  "string-functions": {
    title: "String Functions",
    subject: "c",
    concept: [
      "strlen() - string length",
      "strcpy() - copy strings",
      "strcat() - concatenate strings",
      "strcmp() - compare strings",
      "strstr() - find substring"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str1[20] = "Hello";\n    char str2[20] = "World";\n    \n    // Concatenate\n    strcat(str1, " ");\n    strcat(str1, str2);\n    printf("Concatenated: %s\\n", str1);\n    \n    // Compare\n    if (strcmp(str1, "Hello World") == 0) {\n        printf("Strings are equal\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "strcat(dest, src) appends src to dest",
      "strcmp() returns 0 if strings equal",
      "strcmp() returns <0 if first < second, >0 if first > second",
      "All functions need <string.h>"
    ],
    examTip: "strcat() assumes destination has enough space. Buffer overflow risk!",
    practiceQ: "Write a program to check if a string is palindrome",
    quiz: [
      {
        question: "What does strcmp() return for equal strings?",
        options: ["-1", "0", "1", "Length difference"],
        correct: 1,
        explanation: "strcmp() returns 0 when strings are identical."
      }
    ],
    visualizationSteps: [
      { variables: { "str1": "'Hello'", "str2": "'World'" }, output: "Strings initialized" },
      { variables: { "str1": "'Hello '" }, output: "strcat(str1, ' ') executed" },
      { variables: { "str1": "'Hello World'" }, output: "strcat(str1, str2) executed" },
      { variables: { result: "0" }, output: "strcmp('Hello World', 'Hello World') returns 0" }
    ]
  },

  // POINTERS
  "pointers": {
    title: "Pointers",
    subject: "c",
    concept: [
      "Variables that store memory addresses",
      "Declaration: data_type *pointer_name",
      "&variable - address of operator",
      "*pointer - dereference operator"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *ptr = &x;  // ptr points to x\n    \n    printf("x = %d\\n", x);\n    printf("Address of x = %p\\n", &x);\n    printf("ptr = %p\\n", ptr);\n    printf("*ptr = %d\\n", *ptr);\n    \n    *ptr = 20;  // Change value through pointer\n    printf("After change: x = %d\\n", x);\n    \n    return 0;\n}`,
    explanation: [
      "int *ptr - pointer to integer",
      "&x - address of x",
      "*ptr - value at address stored in ptr",
      "Changing *ptr changes the original variable"
    ],
    examTip: "Pointers store addresses, not values. Use * to access value, & to get address.",
    practiceQ: "Write a program to swap two numbers using pointers",
    quiz: [
      {
        question: "What does &x return?",
        options: ["Value of x", "Address of x", "Pointer to x", "Reference to x"],
        correct: 1,
        explanation: "& is the address-of operator, returning memory address of x."
      }
    ],
    visualizationSteps: [
      { variables: { x: "10" }, output: "Variable x allocated at address 0x1000" },
      { variables: { x: "10", ptr: "0x1000" }, output: "Pointer ptr assigned address of x" },
      { variables: { x: "10", ptr: "0x1000" }, output: "*ptr accesses value 10" },
      { variables: { x: "20", ptr: "0x1000" }, output: "*ptr = 20 changes x through pointer" }
    ]
  },

  "pointer-arithmetic": {
    title: "Pointer Arithmetic",
    subject: "c",
    concept: [
      "Pointers can be incremented/decremented",
      "p++ moves to next element (based on data type)",
      "Pointer arithmetic follows data type size",
      "Common in array traversal"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    int *ptr = arr;  // Points to arr[0]\n    \n    printf("Using pointer arithmetic:\\n");\n    for (int i = 0; i < 5; i++) {\n        printf("arr[%d] = %d (address: %p)\\n", i, *(ptr + i), (ptr + i));\n    }\n    \n    return 0;\n}`,
    explanation: [
      "int *ptr = arr - ptr points to first element",
      "*(ptr + i) equivalent to arr[i]",
      "ptr + i moves i * sizeof(int) bytes",
      "Pointer arithmetic automatic for data types"
    ],
    examTip: "Pointer arithmetic moves by data type size. int pointer +1 moves 4 bytes.",
    practiceQ: "Traverse an array using pointer arithmetic instead of indexing",
    quiz: [
      {
        question: "If int *p = &arr[0], what does p + 2 point to?",
        options: ["arr[1]", "arr[2]", "arr[3]", "Invalid"],
        correct: 1,
        explanation: "p + 2 points to arr[2] (moves 2 * sizeof(int) = 8 bytes)."
      }
    ],
    visualizationSteps: [
      { variables: { "arr[0]": "10", "arr[1]": "20", "arr[2]": "30", "arr[3]": "40", "arr[4]": "50", ptr: "arr" }, output: "Array and pointer initialized" },
      { variables: { ptr: "arr[0]" }, output: "*(ptr + 0) = arr[0] = 10" },
      { variables: { ptr: "arr[1]" }, output: "*(ptr + 1) = arr[1] = 20" },
      { variables: { ptr: "arr[2]" }, output: "*(ptr + 2) = arr[2] = 30" },
      { variables: { ptr: "arr[3]" }, output: "*(ptr + 3) = arr[3] = 40" },
      { variables: { ptr: "arr[4]" }, output: "*(ptr + 4) = arr[4] = 50" }
    ]
  },

  "pointers-and-arrays": {
    title: "Pointers and Arrays",
    subject: "c",
    concept: [
      "Array name is constant pointer to first element",
      "arr[i] is same as *(arr + i)",
      "Pointers can be used for array operations",
      "Arrays decay to pointers in function calls"
    ],
    code: `#include <stdio.h>\n\nvoid printArray(int *arr, int size) {\n    for (int i = 0; i < size; i++) {\n        printf("%d ", arr[i]);  // arr[i] works!\n    }\n    printf("\\n");\n}\n\nint main() {\n    int numbers[] = {1, 2, 3, 4, 5};\n    \n    printArray(numbers, 5);  // Array decays to pointer\n    \n    return 0;\n}`,
    explanation: [
      "Array parameter int *arr is pointer to int",
      "arr[i] works because of pointer arithmetic",
      "numbers in main() decays to &numbers[0]",
      "Function receives pointer, not copy of array"
    ],
    examTip: "Arrays are passed by reference (as pointers). Changes affect original array.",
    practiceQ: "Write a function to find sum of array elements using pointers",
    quiz: [
      {
        question: "When is array name NOT a pointer?",
        options: ["In function calls", "When using sizeof", "In assignments", "Never"],
        correct: 1,
        explanation: "sizeof(arr) gives array size, not pointer size. Array name is pointer otherwise."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Array numbers[] = {1,2,3,4,5} created" },
      { variables: { arr: "numbers" }, output: "Function parameter arr receives pointer to numbers[0]" },
      { variables: { i: "0" }, output: "arr[0] = *(arr + 0) = 1" },
      { variables: { i: "1" }, output: "arr[1] = *(arr + 1) = 2" },
      { variables: { i: "2" }, output: "arr[2] = *(arr + 2) = 3" },
      { variables: { i: "3" }, output: "arr[3] = *(arr + 3) = 4" },
      { variables: { i: "4" }, output: "arr[4] = *(arr + 4) = 5" }
    ]
  },

  "pointer-functions": {
    title: "Pointers to Functions",
    subject: "c",
    concept: [
      "Functions have addresses like variables",
      "Function pointers store function addresses",
      "Used for callbacks, dynamic function calls",
      "Declaration: return_type (*ptr)(parameters)"
    ],
    code: `#include <stdio.h>\n\nint add(int a, int b) { return a + b; }\nint subtract(int a, int b) { return a - b; }\n\nint main() {\n    int (*operation)(int, int);  // Function pointer\n    \n    operation = add;\n    printf("5 + 3 = %d\\n", operation(5, 3));\n    \n    operation = subtract;\n    printf("5 - 3 = %d\\n", operation(5, 3));\n    \n    return 0;\n}`,
    explanation: [
      "int (*operation)(int, int) - pointer to function returning int",
      "operation = add - assign function address",
      "operation(5, 3) - call function through pointer",
      "Useful for polymorphism, callbacks"
    ],
    examTip: "Function pointers are advanced topic. Know syntax for declarations and calls.",
    practiceQ: "Create a calculator using function pointers for +, -, *, / operations",
    quiz: [
      {
        question: "Function pointer syntax?",
        options: ["int *ptr()", "int (*ptr)()", "int ptr()", "*int ptr()"],
        correct: 1,
        explanation: "int (*ptr)() declares pointer to function returning int."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Functions add and subtract defined" },
      { variables: { operation: "add" }, output: "Function pointer assigned to add" },
      { variables: { operation: "add", result: "8" }, output: "operation(5,3) calls add(5,3) = 8" },
      { variables: { operation: "subtract", result: "2" }, output: "operation(5,3) calls subtract(5,3) = 2" }
    ]
  },

  // STRUCTURES
  "structures": {
    title: "Structures",
    subject: "c",
    concept: [
      "User-defined data type grouping different types",
      "Declaration: struct tag { members };",
      "Access members with dot operator: struct_var.member",
      "Group related data together"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int roll_no;\n    float marks;\n};\n\nint main() {\n    struct Student s1;\n    \n    strcpy(s1.name, "John");\n    s1.roll_no = 101;\n    s1.marks = 85.5;\n    \n    printf("Name: %s\\n", s1.name);\n    printf("Roll No: %d\\n", s1.roll_no);\n    printf("Marks: %.2f\\n", s1.marks);\n    \n    return 0;\n}`,
    explanation: [
      "struct Student - defines structure template",
      "struct Student s1 - creates structure variable",
      "s1.name, s1.roll_no, s1.marks - member access",
      "Members can be different data types"
    ],
    examTip: "Structures group related data. Access with dot operator.",
    practiceQ: "Define a structure for Employee with id, name, salary, department",
    quiz: [
      {
        question: "How to access structure member?",
        options: ["struct->member", "struct.member", "struct[member]", "member.struct"],
        correct: 1,
        explanation: "Dot operator (.) accesses structure members."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "struct Student defined with name, roll_no, marks" },
      { variables: { "s1.name": "'John'", "s1.roll_no": "101", "s1.marks": "85.5" }, output: "Structure members assigned values" },
      { variables: { "s1.name": "'John'" }, output: "Access s1.name = 'John'" },
      { variables: { "s1.roll_no": "101" }, output: "Access s1.roll_no = 101" },
      { variables: { "s1.marks": "85.5" }, output: "Access s1.marks = 85.5" }
    ]
  },

  "nested-structures": {
    title: "Nested Structures",
    subject: "c",
    concept: [
      "Structures containing other structures",
      "Access with multiple dot operators",
      "Useful for complex data relationships",
      "Memory layout is contiguous"
    ],
    code: `#include <stdio.h>\n\nstruct Address {\n    char street[50];\n    char city[30];\n    int pincode;\n};\n\nstruct Employee {\n    char name[50];\n    int id;\n    struct Address addr;\n};\n\nint main() {\n    struct Employee emp;\n    \n    strcpy(emp.name, "Alice");\n    emp.id = 1001;\n    strcpy(emp.addr.street, "Main St");\n    strcpy(emp.addr.city, "NYC");\n    emp.addr.pincode = 10001;\n    \n    printf("Employee: %s (ID: %d)\\n", emp.name, emp.id);\n    printf("Address: %s, %s - %d\\n", emp.addr.street, emp.addr.city, emp.addr.pincode);\n    \n    return 0;\n}`,
    explanation: [
      "struct Address nested inside struct Employee",
      "emp.addr.street - access nested member",
      "Multiple levels of dot operators",
      "Inner structures fully accessible"
    ],
    examTip: "Use nested structures for hierarchical data. Access with chained dots.",
    practiceQ: "Create nested structure for University -> Department -> Student",
    quiz: [
      {
        question: "Access nested structure member?",
        options: ["outer.inner.member", "outer->inner->member", "inner.outer.member", "member.inner.outer"],
        correct: 0,
        explanation: "Use multiple dot operators: outer.inner.member"
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Nested structures Employee and Address defined" },
      { variables: { "emp.name": "'Alice'", "emp.id": "1001" }, output: "Employee data assigned" },
      { variables: { "emp.addr.street": "'Main St'", "emp.addr.city": "'NYC'", "emp.addr.pincode": "10001" }, output: "Nested address data assigned" },
      { variables: {}, output: "Access emp.addr.street for nested member" }
    ]
  },

  "array-of-structures": {
    title: "Arrays of Structures",
    subject: "c",
    concept: [
      "Arrays containing structure elements",
      "Access: array[index].member",
      "Useful for databases, records",
      "Each element is complete structure"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nstruct Book {\n    char title[50];\n    char author[30];\n    float price;\n};\n\nint main() {\n    struct Book library[3];\n    \n    // Initialize books\n    strcpy(library[0].title, "C Programming");\n    strcpy(library[0].author, "Dennis Ritchie");\n    library[0].price = 45.50;\n    \n    strcpy(library[1].title, "Data Structures");\n    strcpy(library[1].author, "Robert Sedgewick");\n    library[1].price = 55.75;\n    \n    // Display all books\n    for (int i = 0; i < 2; i++) {\n        printf("Book %d: %s by %s ($%.2f)\\n", \n               i+1, library[i].title, library[i].author, library[i].price);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "struct Book library[3] - array of 3 Book structures",
      "library[0].title - access first book's title",
      "Each array element is complete structure",
      "Loop through array to process all elements"
    ],
    examTip: "Arrays of structures for multiple records. Access with array[index].member",
    practiceQ: "Create array of 5 Student structures and find student with highest marks",
    quiz: [
      {
        question: "Access title of first book in array?",
        options: ["books.title[0]", "books[0].title", "books[title][0]", "title.books[0]"],
        correct: 1,
        explanation: "books[0].title accesses title member of first structure in array."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Array of 3 Book structures created" },
      { variables: { "library[0].title": "'C Programming'", "library[0].author": "'Dennis Ritchie'", "library[0].price": "45.50" }, output: "First book data assigned" },
      { variables: { "library[1].title": "'Data Structures'", "library[1].author": "'Robert Sedgewick'", "library[1].price": "55.75" }, output: "Second book data assigned" },
      { variables: { i: "0" }, output: "Loop accesses library[0].title, library[0].author, library[0].price" },
      { variables: { i: "1" }, output: "Loop accesses library[1].title, library[1].author, library[1].price" }
    ]
  },

  "unions": {
    title: "Unions",
    subject: "c",
    concept: [
      "Share memory between different data types",
      "Size equals largest member",
      "Only one member active at a time",
      "Memory efficient for mutually exclusive data"
    ],
    code: `#include <stdio.h>\n\nunion Data {\n    int i;\n    float f;\n    char str[20];\n};\n\nint main() {\n    union Data data;\n    \n    data.i = 10;\n    printf("data.i = %d\\n", data.i);\n    \n    data.f = 3.14;\n    printf("data.f = %.2f\\n", data.f);\n    // data.i is now garbage\n    \n    strcpy(data.str, "Hello");\n    printf("data.str = %s\\n", data.str);\n    \n    return 0;\n}`,
    explanation: [
      "union Data - all members share same memory",
      "sizeof(union) = size of largest member",
      "Only one member can hold valid data at a time",
      "Memory efficient but risky"
    ],
    examTip: "Unions save memory but only one member valid at a time. Use carefully!",
    practiceQ: "Create union for different data types and demonstrate memory sharing",
    quiz: [
      {
        question: "Union size equals?",
        options: ["Sum of all members", "Size of smallest member", "Size of largest member", "Fixed 4 bytes"],
        correct: 2,
        explanation: "Union size equals the size of its largest member."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Union Data created, size = max(int, float, char[20]) = 20 bytes" },
      { variables: { "data.i": "10" }, output: "data.i = 10 stored in shared memory" },
      { variables: { "data.f": "3.14" }, output: "data.f = 3.14 overwrites same memory, data.i now garbage" },
      { variables: { "data.str": "'Hello'" }, output: "data.str = 'Hello' overwrites same memory again" }
    ]
  },

  // FILE HANDLING
  "file-basics": {
    title: "File Handling Basics",
    subject: "c",
    concept: [
      "FILE pointer for file operations",
      "fopen() opens file, fclose() closes file",
      "Modes: r (read), w (write), a (append)",
      "Check fopen() return value for errors"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    FILE *file;\n    \n    // Write to file\n    file = fopen("example.txt", "w");\n    if (file == NULL) {\n        printf("Error opening file\\n");\n        return 1;\n    }\n    \n    fprintf(file, "Hello, File!\\n");\n    fprintf(file, "This is line 2.\\n");\n    \n    fclose(file);\n    printf("Data written to file\\n");\n    \n    return 0;\n}`,
    explanation: [
      "FILE *file - file pointer",
      "fopen(\"example.txt\", \"w\") - open for writing",
      "fprintf() - write formatted data to file",
      "fclose() - close file, flush buffers"
    ],
    examTip: "Always check if fopen() returns NULL. Always fclose() files.",
    practiceQ: "Write a program to create a file and write your name and roll number",
    quiz: [
      {
        question: "What does fopen() return on failure?",
        options: ["0", "NULL", "-1", "EOF"],
        correct: 1,
        explanation: "fopen() returns NULL if file cannot be opened."
      }
    ],
    visualizationSteps: [
      { variables: { file: "NULL" }, output: "FILE pointer declared" },
      { variables: { file: "0x2000" }, output: "fopen() succeeds, returns valid file pointer" },
      { variables: { file: "0x2000" }, output: "fprintf() writes 'Hello, File!' to file" },
      { variables: { file: "0x2000" }, output: "fprintf() writes 'This is line 2.' to file" },
      { variables: { file: "NULL" }, output: "fclose() closes file and sets pointer to NULL" }
    ]
  },

  "file-read-write": {
    title: "File Read/Write Operations",
    subject: "c",
    concept: [
      "fprintf() - write formatted data",
      "fscanf() - read formatted data",
      "fgets() - read string with newline",
      "fputs() - write string",
      "feof() - check end of file"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    FILE *file;\n    char buffer[100];\n    \n    // Write numbers to file\n    file = fopen("numbers.txt", "w");\n    for (int i = 1; i <= 5; i++) {\n        fprintf(file, "%d\\n", i);\n    }\n    fclose(file);\n    \n    // Read and display\n    file = fopen("numbers.txt", "r");\n    printf("File contents:\\n");\n    while (fgets(buffer, sizeof(buffer), file) != NULL) {\n        printf("%s", buffer);\n    }\n    fclose(file);\n    \n    return 0;\n}`,
    explanation: [
      "fprintf(file, \"%d\\n\", i) - write number with newline",
      "fgets(buffer, size, file) - read line into buffer",
      "fgets returns NULL at end of file",
      "Text mode handles line endings automatically"
    ],
    examTip: "Use fgets() for safe string reading. Check return values.",
    practiceQ: "Write program to copy contents of one file to another",
    quiz: [
      {
        question: "Function to read formatted data from file?",
        options: ["fread()", "fgets()", "fscanf()", "freadline()"],
        correct: 2,
        explanation: "fscanf() reads formatted data from file, like scanf() for files."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "File opened for writing" },
      { variables: {}, output: "fprintf() writes 1, 2, 3, 4, 5 to file" },
      { variables: {}, output: "File closed" },
      { variables: {}, output: "File reopened for reading" },
      { variables: {}, output: "fgets() reads '1\\n' into buffer" },
      { variables: {}, output: "fgets() reads '2\\n' into buffer" },
      { variables: {}, output: "fgets() reads '3\\n' into buffer" },
      { variables: {}, output: "fgets() reads '4\\n' into buffer" },
      { variables: {}, output: "fgets() reads '5\\n' into buffer" },
      { variables: {}, output: "fgets() returns NULL, loop ends" }
    ]
  },

  "file-functions": {
    title: "File Handling Functions",
    subject: "c",
    concept: [
      "fputc() / fgetc() - character I/O",
      "fputs() / fgets() - string I/O",
      "fread() / fwrite() - binary I/O",
      "Binary mode for non-text data"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    FILE *file;\n    char ch;\n    \n    // Write characters\n    file = fopen("chars.txt", "w");\n    fputc('H', file);\n    fputc('i', file);\n    fputc('!', file);\n    fclose(file);\n    \n    // Read characters\n    file = fopen("chars.txt", "r");\n    printf("File contents: ");\n    while ((ch = fgetc(file)) != EOF) {\n        printf("%c", ch);\n    }\n    printf("\\n");\n    fclose(file);\n    \n    return 0;\n}`,
    explanation: [
      "fputc(ch, file) - write single character",
      "fgetc(file) - read single character",
      "Returns int (EOF = -1) to distinguish from valid char",
      "Character I/O for byte-by-byte processing"
    ],
    examTip: "fgetc() returns int, not char. Check for EOF.",
    practiceQ: "Count number of characters, words, and lines in a text file",
    quiz: [
      {
        question: "fgetc() returns what type?",
        options: ["char", "int", "void", "string"],
        correct: 1,
        explanation: "fgetc() returns int to accommodate EOF (-1) value."
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "File opened for writing" },
      { variables: {}, output: "fputc('H') writes 'H' to file" },
      { variables: {}, output: "fputc('i') writes 'i' to file" },
      { variables: {}, output: "fputc('!') writes '!' to file" },
      { variables: {}, output: "File closed" },
      { variables: {}, output: "File reopened for reading" },
      { variables: { ch: "'H'" }, output: "fgetc() reads 'H'" },
      { variables: { ch: "'i'" }, output: "fgetc() reads 'i'" },
      { variables: { ch: "'!'" }, output: "fgetc() reads '!'" },
      { variables: { ch: "EOF" }, output: "fgetc() returns EOF, loop ends" }
    ]
  },

  // ADVANCED TOPICS
  "dynamic-memory": {
    title: "Dynamic Memory Allocation",
    subject: "c",
    concept: [
      "malloc() - allocate memory at runtime",
      "calloc() - allocate and initialize to zero",
      "realloc() - resize allocated memory",
      "free() - deallocate memory",
      "Prevent memory leaks"
    ],
    code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int *arr;\n    int n = 5;\n    \n    // Allocate memory\n    arr = (int*)malloc(n * sizeof(int));\n    if (arr == NULL) {\n        printf("Memory allocation failed\\n");\n        return 1;\n    }\n    \n    // Use the memory\n    for (int i = 0; i < n; i++) {\n        arr[i] = i + 1;\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    \n    // Free memory\n    free(arr);\n    arr = NULL;  // Good practice\n    \n    return 0;\n}`,
    explanation: [
      "malloc(size) allocates size bytes, returns void*",
      "(int*) - cast to int pointer",
      "sizeof(int) ensures correct size",
      "free() deallocates memory",
      "Always check malloc return value"
    ],
    examTip: "malloc may fail. Always check return value. Always free allocated memory.",
    practiceQ: "Create dynamic array, read n elements, find sum, then free memory",
    quiz: [
      {
        question: "What does malloc() return on failure?",
        options: ["0", "NULL", "-1", "Garbage value"],
        correct: 1,
        explanation: "malloc() returns NULL if memory allocation fails."
      }
    ],
    visualizationSteps: [
      { variables: { n: "5" }, output: "n = 5 elements needed" },
      { variables: { arr: "NULL" }, output: "arr pointer declared" },
      { variables: { arr: "0x3000" }, output: "malloc(5 * 4) = 20 bytes allocated at 0x3000" },
      { variables: { "arr[0]": "1", "arr[1]": "2", "arr[2]": "3", "arr[3]": "4", "arr[4]": "5" }, output: "Array filled with values 1-5" },
      { variables: { arr: "0x3000" }, output: "free(arr) deallocates memory at 0x3000" },
      { variables: { arr: "NULL" }, output: "arr set to NULL to prevent dangling pointer" }
    ]
  },

  "bitwise-operators": {
    title: "Bitwise Operators",
    subject: "c",
    concept: [
      "& - bitwise AND",
      "| - bitwise OR",
      "^ - bitwise XOR",
      "~ - bitwise NOT",
      "<< - left shift",
      ">> - right shift"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int a = 12;  // 1100 in binary\n    int b = 10;  // 1010 in binary\n    \n    printf("a = %d (binary: 1100)\\n", a);\n    printf("b = %d (binary: 1010)\\n", b);\n    \n    printf("a & b = %d (1000)\\n", a & b);  // 8\n    printf("a | b = %d (1110)\\n", a | b);  // 14\n    printf("a ^ b = %d (0110)\\n", a ^ b);  // 6\n    printf("a << 1 = %d (11000)\\n", a << 1);  // 24\n    printf("a >> 1 = %d (0110)\\n", a >> 1);  // 6\n    \n    return 0;\n}`,
    explanation: [
      "Bitwise operators work on individual bits",
      "& compares bits: 1&1=1, otherwise 0",
      "| compares bits: 0|0=0, otherwise 1",
      "^ compares bits: different=1, same=0",
      "<< shifts bits left (multiply by 2)",
      ">> shifts bits right (divide by 2)"
    ],
    examTip: "Bitwise operators manipulate individual bits. Useful for flags, masks, optimization.",
    practiceQ: "Write functions to check if number is even/odd using bitwise operators",
    quiz: [
      {
        question: "What does 5 & 3 equal?",
        options: ["8", "1", "7", "15"],
        correct: 1,
        explanation: "5 is 101, 3 is 011, 101 & 011 = 001 = 1"
      }
    ],
    visualizationSteps: [
      { variables: { a: "12 (1100)", b: "10 (1010)" }, output: "a = 12 (1100), b = 10 (1010)" },
      { variables: { result: "8 (1000)" }, output: "a & b: 1100 & 1010 = 1000 (8)" },
      { variables: { result: "14 (1110)" }, output: "a | b: 1100 | 1010 = 1110 (14)" },
      { variables: { result: "6 (0110)" }, output: "a ^ b: 1100 ^ 1010 = 0110 (6)" },
      { variables: { result: "24 (11000)" }, output: "a << 1: 1100 << 1 = 11000 (24)" },
      { variables: { result: "6 (0110)" }, output: "a >> 1: 1100 >> 1 = 0110 (6)" }
    ]
  },

  // PRACTICE PROGRAMS
  "fibonacci-iterative": {
    title: "Fibonacci (Iterative)",
    subject: "c",
    concept: [
      "Fibonacci: each number is sum of two preceding",
      "Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21...",
      "Iterative approach uses loop",
      "More efficient than recursion for large n"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int n, first = 0, second = 1, next;\n    \n    printf("Enter number of terms: ");\n    scanf("%d", &n);\n    \n    printf("Fibonacci Series: ");\n    \n    for (int i = 0; i < n; i++) {\n        if (i <= 1) {\n            next = i;\n        } else {\n            next = first + second;\n            first = second;\n            second = next;\n        }\n        printf("%d ", next);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "first=0, second=1 are first two Fibonacci numbers",
      "next = first + second generates next number",
      "Update first=second, second=next for next iteration",
      "Loop runs n times to generate n terms"
    ],
    examTip: "Initialize first=0, second=1. Use loop to generate sequence.",
    practiceQ: "Print Fibonacci series up to a given number (not number of terms)",
    quiz: [
      {
        question: "First two Fibonacci numbers?",
        options: ["0, 0", "1, 1", "0, 1", "1, 2"],
        correct: 2,
        explanation: "Fibonacci sequence starts with 0, 1"
      }
    ],
    visualizationSteps: [
      { variables: { n: "5", first: "0", second: "1", i: "0" }, output: "Initialize: first=0, second=1, i=0" },
      { variables: { next: "0", i: "0" }, output: "i=0: next=0 (special case)" },
      { variables: { next: "0", i: "1" }, output: "i=1: next=1 (special case)" },
      { variables: { next: "1", first: "0", second: "1", i: "2" }, output: "i=2: next=0+1=1, first=1, second=1" },
      { variables: { next: "2", first: "1", second: "1", i: "3" }, output: "i=3: next=1+1=2, first=1, second=2" },
      { variables: { next: "3", first: "1", second: "2", i: "4" }, output: "i=4: next=1+2=3, first=2, second=3" }
    ]
  },

  "fibonacci-recursive": {
    title: "Fibonacci (Recursive)",
    subject: "c",
    concept: [
      "Recursive function calls itself",
      "Base case: fib(0)=0, fib(1)=1",
      "Recursive case: fib(n) = fib(n-1) + fib(n-2)",
      "Exponential time complexity O(2^n)"
    ],
    code: `#include <stdio.h>\n\nint fibonacci(int n) {\n    if (n == 0) {\n        return 0;\n    } else if (n == 1) {\n        return 1;\n    } else {\n        return fibonacci(n-1) + fibonacci(n-2);\n    }\n}\n\nint main() {\n    int n;\n    printf("Enter n: ");\n    scanf("%d", &n);\n    \n    printf("Fibonacci(%d) = %d\\n", n, fibonacci(n));\n    \n    return 0;\n}`,
    explanation: [
      "fibonacci(0) = 0 - base case",
      "fibonacci(1) = 1 - base case",
      "fibonacci(n) = fibonacci(n-1) + fibonacci(n-2) - recursive case",
      "Function calls itself with smaller arguments"
    ],
    examTip: "Base cases prevent infinite recursion. Inefficient for large n due to repeated calculations.",
    practiceQ: "Optimize Fibonacci using memoization (store calculated values)",
    quiz: [
      {
        question: "Base cases for Fibonacci recursion?",
        options: ["fib(1)=1, fib(2)=1", "fib(0)=0, fib(1)=1", "fib(1)=1, fib(1)=2", "fib(0)=1, fib(1)=1"],
        correct: 1,
        explanation: "fib(0)=0, fib(1)=1 are the standard base cases"
      }
    ],
    visualizationSteps: [
      { variables: { n: "4" }, output: "fibonacci(4) called" },
      { variables: { n: "3" }, output: "fibonacci(3) = fibonacci(2) + fibonacci(1)" },
      { variables: { n: "2" }, output: "fibonacci(2) = fibonacci(1) + fibonacci(0)" },
      { variables: { n: "1" }, output: "fibonacci(1) = 1 (base case)" },
      { variables: { n: "0" }, output: "fibonacci(0) = 0 (base case)" },
      { variables: { n: "2", result: "1" }, output: "fibonacci(2) = 1 + 0 = 1" },
      { variables: { n: "1" }, output: "fibonacci(1) = 1 (base case)" },
      { variables: { n: "3", result: "2" }, output: "fibonacci(3) = 1 + 1 = 2" },
      { variables: { n: "4", result: "3" }, output: "fibonacci(4) = 2 + 1 = 3" }
    ]
  },

  "factorial-iterative": {
    title: "Factorial (Iterative)",
    subject: "c",
    concept: [
      "Factorial: n! = n × (n-1) × ... × 1",
      "0! = 1 by definition",
      "Iterative approach uses loop",
      "More efficient than recursion"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int n;\n    long long factorial = 1;\n    \n    printf("Enter n: ");\n    scanf("%d", &n);\n    \n    if (n < 0) {\n        printf("Factorial not defined for negative numbers\\n");\n    } else {\n        for (int i = 1; i <= n; i++) {\n            factorial *= i;\n        }\n        printf("%d! = %lld\\n", n, factorial);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Initialize factorial = 1",
      "Loop from 1 to n, multiply factorial by i each time",
      "Use long long for large factorials",
      "Handle negative input"
    ],
    examTip: "Use long long for factorials > 12. 0! = 1. Handle negative numbers.",
    practiceQ: "Calculate factorial using recursion",
    quiz: [
      {
        question: "What is 5!?",
        options: ["120", "60", "24", "720"],
        correct: 0,
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120"
      }
    ],
    visualizationSteps: [
      { variables: { n: "5", factorial: "1", i: "1" }, output: "Initialize factorial=1, i=1" },
      { variables: { factorial: "1", i: "1" }, output: "factorial = 1 × 1 = 1" },
      { variables: { factorial: "2", i: "2" }, output: "factorial = 1 × 2 = 2" },
      { variables: { factorial: "6", i: "3" }, output: "factorial = 2 × 3 = 6" },
      { variables: { factorial: "24", i: "4" }, output: "factorial = 6 × 4 = 24" },
      { variables: { factorial: "120", i: "5" }, output: "factorial = 24 × 5 = 120" }
    ]
  },

  "factorial-recursive": {
    title: "Factorial (Recursive)",
    subject: "c",
    concept: [
      "Recursive factorial: n! = n × (n-1)!",
      "Base case: 0! = 1",
      "Each call reduces problem size by 1",
      "Stack used for recursive calls"
    ],
    code: `#include <stdio.h>\n\nlong long factorial(int n) {\n    if (n == 0) {\n        return 1;  // Base case\n    } else {\n        return n * factorial(n - 1);\n    }\n}\n\nint main() {\n    int n;\n    printf("Enter n: ");\n    scanf("%d", &n);\n    \n    if (n < 0) {\n        printf("Factorial not defined for negative numbers\\n");\n    } else {\n        printf("%d! = %lld\\n", n, factorial(n));\n    }\n    \n    return 0;\n}`,
    explanation: [
      "factorial(0) = 1 - base case",
      "factorial(n) = n * factorial(n-1) - recursive case",
      "Function calls itself with n-1",
      "Multiplication happens during return"
    ],
    examTip: "Base case prevents infinite recursion. Use long long for large results.",
    practiceQ: "Add memoization to recursive factorial for optimization",
    quiz: [
      {
        question: "Base case for factorial recursion?",
        options: ["factorial(1) = 1", "factorial(0) = 1", "factorial(1) = 0", "factorial(0) = 0"],
        correct: 1,
        explanation: "0! = 1 is the base case for factorial"
      }
    ],
    visualizationSteps: [
      { variables: { n: "4" }, output: "factorial(4) called" },
      { variables: { n: "3" }, output: "factorial(4) = 4 * factorial(3)" },
      { variables: { n: "2" }, output: "factorial(3) = 3 * factorial(2)" },
      { variables: { n: "1" }, output: "factorial(2) = 2 * factorial(1)" },
      { variables: { n: "0" }, output: "factorial(1) = 1 * factorial(0)" },
      { variables: { n: "0", result: "1" }, output: "factorial(0) = 1 (base case)" },
      { variables: { n: "1", result: "1" }, output: "factorial(1) = 1 * 1 = 1" },
      { variables: { n: "2", result: "2" }, output: "factorial(2) = 2 * 1 = 2" },
      { variables: { n: "3", result: "6" }, output: "factorial(3) = 3 * 2 = 6" },
      { variables: { n: "4", result: "24" }, output: "factorial(4) = 4 * 6 = 24" }
    ]
  },

  "prime-check": {
    title: "Prime Number Check",
    subject: "c",
    concept: [
      "Prime number: divisible only by 1 and itself",
      "Check divisibility from 2 to sqrt(n)",
      "Optimization: check up to square root of n",
      "1 is not prime, 2 is smallest prime"
    ],
    code: `#include <stdio.h>\n#include <math.h>\n\nint isPrime(int n) {\n    if (n <= 1) return 0;\n    if (n <= 3) return 1;\n    if (n % 2 == 0 || n % 3 == 0) return 0;\n    \n    for (int i = 5; i * i <= n; i += 6) {\n        if (n % i == 0 || n % (i + 2) == 0) {\n            return 0;\n        }\n    }\n    return 1;\n}\n\nint main() {\n    int n;\n    printf("Enter number: ");\n    scanf("%d", &n);\n    \n    if (isPrime(n)) {\n        printf("%d is prime\\n", n);\n    } else {\n        printf("%d is not prime\\n", n);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Check n <= 1 (not prime)",
      "Check n <= 3 (prime)",
      "Eliminate multiples of 2 and 3",
      "Check divisibility up to sqrt(n) with step 6 optimization",
      "Return 1 for prime, 0 for not prime"
    ],
    examTip: "Check up to sqrt(n) for efficiency. Handle 2 and 3 as special cases.",
    practiceQ: "Print all prime numbers between 1 and 100",
    quiz: [
      {
        question: "Is 1 a prime number?",
        options: ["Yes", "No", "Sometimes", "Depends"],
        correct: 1,
        explanation: "1 is not prime because it has only one positive divisor (itself)"
      }
    ],
    visualizationSteps: [
      { variables: { n: "17" }, output: "Check if 17 is prime" },
      { variables: { n: "17" }, output: "17 > 3, not divisible by 2 or 3" },
      { variables: { i: "5" }, output: "Check i=5: 5*5=25 > 17, stop" },
      { variables: { result: "1" }, output: "No divisors found, 17 is prime" }
    ]
  },

  "palindrome-number": {
    title: "Palindrome Number",
    subject: "c",
    concept: [
      "Palindrome: reads same forwards and backwards",
      "Reverse number and compare with original",
      "Use modulo operator to extract digits",
      "Works for numbers like 121, 3443, 12321"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int n, original, reverse = 0, remainder;\n    \n    printf("Enter number: ");\n    scanf("%d", &n);\n    \n    original = n;\n    \n    while (n != 0) {\n        remainder = n % 10;\n        reverse = reverse * 10 + remainder;\n        n /= 10;\n    }\n    \n    if (original == reverse) {\n        printf("%d is palindrome\\n", original);\n    } else {\n        printf("%d is not palindrome\\n", original);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Store original number",
      "Extract last digit with n % 10",
      "Build reverse: reverse * 10 + digit",
      "Remove last digit with n /= 10",
      "Compare original with reverse"
    ],
    examTip: "Use modulo 10 to get last digit, integer division by 10 to remove it.",
    practiceQ: "Check if a string is palindrome (case sensitive)",
    quiz: [
      {
        question: "What is reverse of 123?",
        options: ["321", "132", "213", "231"],
        correct: 0,
        explanation: "123 reversed is 321"
      }
    ],
    visualizationSteps: [
      { variables: { n: "121", original: "121", reverse: "0" }, output: "Initialize: n=121, original=121, reverse=0" },
      { variables: { remainder: "1", reverse: "1", n: "12" }, output: "remainder=121%10=1, reverse=0*10+1=1, n=121/10=12" },
      { variables: { remainder: "2", reverse: "12", n: "1" }, output: "remainder=12%10=2, reverse=1*10+2=12, n=12/10=1" },
      { variables: { remainder: "1", reverse: "121", n: "0" }, output: "remainder=1%10=1, reverse=12*10+1=121, n=1/10=0" },
      { variables: { original: "121", reverse: "121" }, output: "121 == 121, number is palindrome" }
    ]
  },

  "palindrome-string": {
    title: "Palindrome String",
    subject: "c",
    concept: [
      "String palindrome: same forwards and backwards",
      "Compare characters from start and end",
      "Stop when characters don't match",
      "Case sensitive comparison"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[100];\n    int length, isPalindrome = 1;\n    \n    printf("Enter string: ");\n    scanf("%s", str);\n    \n    length = strlen(str);\n    \n    for (int i = 0; i < length / 2; i++) {\n        if (str[i] != str[length - 1 - i]) {\n            isPalindrome = 0;\n            break;\n        }\n    }\n    \n    if (isPalindrome) {\n        printf("%s is palindrome\\n", str);\n    } else {\n        printf("%s is not palindrome\\n", str);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Get string length with strlen()",
      "Loop from 0 to length/2",
      "Compare str[i] with str[length-1-i]",
      "If mismatch, not palindrome",
      "isPalindrome flag tracks result"
    ],
    examTip: "Compare first with last, second with second last, etc. Stop at length/2.",
    practiceQ: "Check palindrome ignoring case (convert to lowercase first)",
    quiz: [
      {
        question: "Is 'radar' a palindrome?",
        options: ["Yes", "No", "Sometimes", "Depends on case"],
        correct: 0,
        explanation: "'radar' reads the same forwards and backwards"
      }
    ],
    visualizationSteps: [
      { variables: { str: "'radar'", length: "5" }, output: "String 'radar', length=5" },
      { variables: { i: "0" }, output: "Compare str[0]='r' with str[4]='r' - match" },
      { variables: { i: "1" }, output: "Compare str[1]='a' with str[3]='a' - match" },
      { variables: { i: "2" }, output: "i=2 >= 5/2=2.5, loop ends" },
      { variables: { isPalindrome: "1" }, output: "All comparisons matched, string is palindrome" }
    ]
  },

  "armstrong-number": {
    title: "Armstrong Number",
    subject: "c",
    concept: [
      "Armstrong: sum of cubes of digits equals number",
      "153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153",
      "Count digits first",
      "Calculate power for each digit"
    ],
    code: `#include <stdio.h>\n#include <math.h>\n\nint main() {\n    int n, original, remainder, result = 0, digits = 0;\n    \n    printf("Enter number: ");\n    scanf("%d", &n);\n    \n    original = n;\n    \n    // Count digits\n    while (original != 0) {\n        original /= 10;\n        digits++;\n    }\n    \n    original = n;\n    \n    // Calculate Armstrong sum\n    while (original != 0) {\n        remainder = original % 10;\n        result += pow(remainder, digits);\n        original /= 10;\n    }\n    \n    if (result == n) {\n        printf("%d is Armstrong number\\n", n);\n    } else {\n        printf("%d is not Armstrong number\\n", n);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Count digits by dividing by 10 until 0",
      "For each digit, calculate digit^digits",
      "Sum all powered digits",
      "Compare sum with original number"
    ],
    examTip: "Count digits first, then calculate sum of powers. Use pow() from math.h.",
    practiceQ: "Find all Armstrong numbers between 1 and 1000",
    quiz: [
      {
        question: "Is 153 an Armstrong number?",
        options: ["Yes", "No", "Maybe", "Depends"],
        correct: 0,
        explanation: "153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153"
      }
    ],
    visualizationSteps: [
      { variables: { n: "153", original: "153", digits: "0" }, output: "Count digits: 153 has 3 digits" },
      { variables: { original: "153", digits: "3" }, output: "Reset original=153" },
      { variables: { remainder: "3", result: "27", original: "15" }, output: "3³=27, result=27, original=15" },
      { variables: { remainder: "5", result: "152", original: "1" }, output: "5³=125, result=27+125=152, original=1" },
      { variables: { remainder: "1", result: "153", original: "0" }, output: "1³=1, result=152+1=153, original=0" },
      { variables: { n: "153", result: "153" }, output: "153 == 153, number is Armstrong" }
    ]
  },

  "sum-of-digits": {
    title: "Sum of Digits",
    subject: "c",
    concept: [
      "Extract each digit using modulo 10",
      "Add digits to running sum",
      "Remove last digit using integer division by 10",
      "Continue until number becomes 0"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int n, sum = 0, remainder;\n    \n    printf("Enter number: ");\n    scanf("%d", &n);\n    \n    while (n != 0) {\n        remainder = n % 10;\n        sum += remainder;\n        n /= 10;\n    }\n    \n    printf("Sum of digits: %d\\n", sum);\n    \n    return 0;\n}`,
    explanation: [
      "n % 10 gets last digit",
      "sum += digit adds to total",
      "n /= 10 removes last digit",
      "Repeat until n becomes 0"
    ],
    examTip: "Use modulo 10 to extract digits, integer division by 10 to remove them.",
    practiceQ: "Calculate sum of digits recursively",
    quiz: [
      {
        question: "Sum of digits of 123?",
        options: ["6", "5", "4", "3"],
        correct: 0,
        explanation: "1 + 2 + 3 = 6"
      }
    ],
    visualizationSteps: [
      { variables: { n: "123", sum: "0" }, output: "Initialize n=123, sum=0" },
      { variables: { remainder: "3", sum: "3", n: "12" }, output: "remainder=123%10=3, sum=0+3=3, n=123/10=12" },
      { variables: { remainder: "2", sum: "5", n: "1" }, output: "remainder=12%10=2, sum=3+2=5, n=12/10=1" },
      { variables: { remainder: "1", sum: "6", n: "0" }, output: "remainder=1%10=1, sum=5+1=6, n=1/10=0" },
      { variables: { sum: "6" }, output: "Sum of digits = 6" }
    ]
  },

  "reverse-number": {
    title: "Reverse Number",
    subject: "c",
    concept: [
      "Build reversed number digit by digit",
      "Extract last digit with n % 10",
      "Add to reverse: reverse * 10 + digit",
      "Remove digit with n /= 10"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int n, reverse = 0, remainder;\n    \n    printf("Enter number: ");\n    scanf("%d", &n);\n    \n    while (n != 0) {\n        remainder = n % 10;\n        reverse = reverse * 10 + remainder;\n        n /= 10;\n    }\n    \n    printf("Reversed number: %d\\n", reverse);\n    \n    return 0;\n}`,
    explanation: [
      "remainder = n % 10 gets last digit",
      "reverse = reverse * 10 + remainder shifts left and adds digit",
      "n /= 10 removes last digit",
      "Process continues until n = 0"
    ],
    examTip: "Multiply reverse by 10 before adding new digit. This shifts digits left.",
    practiceQ: "Reverse a number recursively",
    quiz: [
      {
        question: "Reverse of 123?",
        options: ["321", "132", "213", "231"],
        correct: 0,
        explanation: "123 reversed is 321"
      }
    ],
    visualizationSteps: [
      { variables: { n: "123", reverse: "0" }, output: "Initialize n=123, reverse=0" },
      { variables: { remainder: "3", reverse: "3", n: "12" }, output: "remainder=123%10=3, reverse=0*10+3=3, n=123/10=12" },
      { variables: { remainder: "2", reverse: "32", n: "1" }, output: "remainder=12%10=2, reverse=3*10+2=32, n=12/10=1" },
      { variables: { remainder: "1", reverse: "321", n: "0" }, output: "remainder=1%10=1, reverse=32*10+1=321, n=1/10=0" },
      { variables: { reverse: "321" }, output: "Reversed number = 321" }
    ]
  },

  "matrix-addition": {
    title: "Matrix Addition",
    subject: "c",
    concept: [
      "Matrices must have same dimensions",
      "Result[i][j] = matrix1[i][j] + matrix2[i][j]",
      "Use nested loops for 2D traversal",
      "i for rows, j for columns"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int rows, cols;\n    \n    printf("Enter rows and columns: ");\n    scanf("%d %d", &rows, &cols);\n    \n    int matrix1[10][10], matrix2[10][10], sum[10][10];\n    \n    printf("Enter first matrix:\\n");\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            scanf("%d", &matrix1[i][j]);\n        }\n    }\n    \n    printf("Enter second matrix:\\n");\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            scanf("%d", &matrix2[i][j]);\n        }\n    }\n    \n    // Addition\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            sum[i][j] = matrix1[i][j] + matrix2[i][j];\n        }\n    }\n    \n    printf("Sum matrix:\\n");\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            printf("%d ", sum[i][j]);\n        }\n        printf("\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Read dimensions and both matrices",
      "Use nested loops for element access",
      "sum[i][j] = matrix1[i][j] + matrix2[i][j]",
      "Print result matrix"
    ],
    examTip: "Matrices must have same dimensions for addition. Use 2D arrays.",
    practiceQ: "Implement matrix subtraction and multiplication",
    quiz: [
      {
        question: "Can you add 2x3 and 3x2 matrices?",
        options: ["Yes", "No", "Sometimes", "Depends"],
        correct: 1,
        explanation: "Matrix addition requires same dimensions (rows × columns)"
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Matrix1: [1 2; 3 4], Matrix2: [5 6; 7 8]" },
      { variables: { "sum[0][0]": "6" }, output: "sum[0][0] = 1 + 5 = 6" },
      { variables: { "sum[0][1]": "8" }, output: "sum[0][1] = 2 + 6 = 8" },
      { variables: { "sum[1][0]": "10" }, output: "sum[1][0] = 3 + 7 = 10" },
      { variables: { "sum[1][1]": "12" }, output: "sum[1][1] = 4 + 8 = 12" },
      { variables: {}, output: "Result: [6 8; 10 12]" }
    ]
  },

  "matrix-multiplication": {
    title: "Matrix Multiplication",
    subject: "c",
    concept: [
      "Matrix1 columns must equal Matrix2 rows",
      "Result dimensions: rows1 × columns2",
      "result[i][j] = sum(matrix1[i][k] * matrix2[k][j])",
      "Triple nested loop required"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int r1, c1, r2, c2;\n    \n    printf("Enter dimensions of first matrix: ");\n    scanf("%d %d", &r1, &c1);\n    \n    printf("Enter dimensions of second matrix: ");\n    scanf("%d %d", &r2, &c2);\n    \n    if (c1 != r2) {\n        printf("Matrix multiplication not possible\\n");\n        return 1;\n    }\n    \n    int matrix1[10][10], matrix2[10][10], product[10][10];\n    \n    // Read matrices\n    printf("Enter first matrix:\\n");\n    for (int i = 0; i < r1; i++) {\n        for (int j = 0; j < c1; j++) {\n            scanf("%d", &matrix1[i][j]);\n        }\n    }\n    \n    printf("Enter second matrix:\\n");\n    for (int i = 0; i < r2; i++) {\n        for (int j = 0; j < c2; j++) {\n            scanf("%d", &matrix2[i][j]);\n        }\n    }\n    \n    // Multiplication\n    for (int i = 0; i < r1; i++) {\n        for (int j = 0; j < c2; j++) {\n            product[i][j] = 0;\n            for (int k = 0; k < c1; k++) {\n                product[i][j] += matrix1[i][k] * matrix2[k][j];\n            }\n        }\n    }\n    \n    // Display result\n    printf("Product matrix:\\n");\n    for (int i = 0; i < r1; i++) {\n        for (int j = 0; j < c2; j++) {\n            printf("%d ", product[i][j]);\n        }\n        printf("\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Check c1 == r2 for multiplication possibility",
      "Triple loop: i for result rows, j for result columns, k for summation",
      "product[i][j] += matrix1[i][k] * matrix2[k][j]",
      "Result dimensions: r1 × c2"
    ],
    examTip: "Matrix multiplication requires columns1 == rows2. Use triple nested loop.",
    practiceQ: "Implement matrix transpose operation",
    quiz: [
      {
        question: "For 2x3 and 3x4 matrices, result dimensions?",
        options: ["2x3", "3x4", "2x4", "4x2"],
        correct: 2,
        explanation: "Matrix multiplication: (2x3) * (3x4) = (2x4)"
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "Matrix1: 2x2 [1 2; 3 4], Matrix2: 2x2 [5 6; 7 8]" },
      { variables: { i: "0", j: "0", k: "0" }, output: "product[0][0] += 1*5 = 5" },
      { variables: { i: "0", j: "0", k: "1" }, output: "product[0][0] += 2*7 = 19" },
      { variables: { i: "0", j: "1", k: "0" }, output: "product[0][1] += 1*6 = 6" },
      { variables: { i: "0", j: "1", k: "1" }, output: "product[0][1] += 2*8 = 22" },
      { variables: {}, output: "Result: [19 22; 43 50]" }
    ]
  },

  "linear-search": {
    title: "Linear Search",
    subject: "c",
    concept: [
      "Search element by checking each item sequentially",
      "Start from index 0 to n-1",
      "Return index if found, -1 if not found",
      "O(n) time complexity"
    ],
    code: `#include <stdio.h>\n\nint linearSearch(int arr[], int n, int key) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == key) {\n            return i;  // Found at index i\n        }\n    }\n    return -1;  // Not found\n}\n\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    int n = 5, key = 30;\n    \n    int result = linearSearch(arr, n, key);\n    \n    if (result != -1) {\n        printf("Element found at index %d\\n", result);\n    } else {\n        printf("Element not found\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Loop through array from 0 to n-1",
      "Compare each element with key",
      "Return index if match found",
      "Return -1 if element not found"
    ],
    examTip: "Simple but inefficient for large arrays. Good for unsorted data.",
    practiceQ: "Implement linear search recursively",
    quiz: [
      {
        question: "Time complexity of linear search?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
        explanation: "Linear search checks each element once, so O(n)"
      }
    ],
    visualizationSteps: [
      { variables: { arr: "[10,20,30,40,50]", key: "30", i: "0" }, output: "Check arr[0]=10 == 30? No" },
      { variables: { i: "1" }, output: "Check arr[1]=20 == 30? No" },
      { variables: { i: "2" }, output: "Check arr[2]=30 == 30? Yes, return 2" }
    ]
  },

  "binary-search": {
    title: "Binary Search",
    subject: "c",
    concept: [
      "Search in sorted array by dividing search space",
      "Compare middle element with key",
      "If key < mid, search left half",
      "If key > mid, search right half",
      "O(log n) time complexity"
    ],
    code: `#include <stdio.h>\n\nint binarySearch(int arr[], int left, int right, int key) {\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        \n        if (arr[mid] == key) {\n            return mid;\n        } else if (arr[mid] < key) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return -1;\n}\n\nint main() {\n    int arr[] = {10, 20, 30, 40, 50};\n    int n = 5, key = 30;\n    \n    int result = binarySearch(arr, 0, n-1, key);\n    \n    if (result != -1) {\n        printf("Element found at index %d\\n", result);\n    } else {\n        printf("Element not found\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Calculate mid = left + (right-left)/2",
      "If arr[mid] == key, return mid",
      "If arr[mid] < key, search right half (left = mid+1)",
      "If arr[mid] > key, search left half (right = mid-1)",
      "Continue until left > right"
    ],
    examTip: "Array must be sorted. Much faster than linear search for large arrays.",
    practiceQ: "Implement binary search recursively",
    quiz: [
      {
        question: "Binary search requires array to be?",
        options: ["Sorted", "Reverse sorted", "Random", "Empty"],
        correct: 0,
        explanation: "Binary search requires the array to be sorted"
      }
    ],
    visualizationSteps: [
      { variables: { arr: "[10,20,30,40,50]", key: "30", left: "0", right: "4" }, output: "Search in indices 0-4" },
      { variables: { mid: "2", "arr[2]": "30" }, output: "mid=2, arr[2]=30 == 30, found at index 2" }
    ]
  },

  "bubble-sort": {
    title: "Bubble Sort",
    subject: "c",
    concept: [
      "Compare adjacent elements and swap if out of order",
      "Each pass moves largest element to end",
      "Repeat n-1 passes for n elements",
      "O(n²) time complexity"
    ],
    code: `#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                // Swap\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22};\n    int n = 5;\n    \n    printf("Original array: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    \n    bubbleSort(arr, n);\n    \n    printf("\\nSorted array: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Outer loop: n-1 passes",
      "Inner loop: compare adjacent elements",
      "Swap if arr[j] > arr[j+1]",
      "Each pass places largest element at end"
    ],
    examTip: "Simple but inefficient. Good for small arrays or nearly sorted data.",
    practiceQ: "Optimize bubble sort to stop early if array becomes sorted",
    quiz: [
      {
        question: "Time complexity of bubble sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
        correct: 2,
        explanation: "Bubble sort uses nested loops, giving O(n²) complexity"
      }
    ],
    visualizationSteps: [
      { variables: { arr: "[64,34,25,12,22]", i: "0", j: "0" }, output: "Pass 1: Compare 64>34, swap to [34,64,25,12,22]" },
      { variables: { j: "1" }, output: "Compare 64>25, swap to [34,25,64,12,22]" },
      { variables: { j: "2" }, output: "Compare 64>12, swap to [34,25,12,64,22]" },
      { variables: { j: "3" }, output: "Compare 64>22, swap to [34,25,12,22,64]" },
      { variables: { i: "1", j: "0" }, output: "Pass 2: Compare 34>25, swap to [25,34,12,22,64]" },
      { variables: { j: "1" }, output: "Compare 34>12, swap to [25,12,34,22,64]" },
      { variables: { j: "2" }, output: "Compare 34>22, swap to [25,12,22,34,64]" },
      { variables: { arr: "[12,22,25,34,64]" }, output: "Array sorted after 4 passes" }
    ]
  },

  "selection-sort": {
    title: "Selection Sort",
    subject: "c",
    concept: [
      "Find minimum element and place at beginning",
      "Repeat for remaining unsorted portion",
      "Each pass selects smallest element",
      "O(n²) time complexity"
    ],
    code: `#include <stdio.h>\n\nvoid selectionSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        int minIndex = i;\n        \n        // Find minimum element in unsorted part\n        for (int j = i+1; j < n; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        \n        // Swap minimum with first element\n        if (minIndex != i) {\n            int temp = arr[i];\n            arr[i] = arr[minIndex];\n            arr[minIndex] = temp;\n        }\n    }\n}\n\nint main() {\n    int arr[] = {64, 25, 12, 22, 11};\n    int n = 5;\n    \n    printf("Original array: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    \n    selectionSort(arr, n);\n    \n    printf("\\nSorted array: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Outer loop: n-1 passes",
      "Inner loop: find minimum in unsorted part",
      "Swap minimum with arr[i]",
      "Unsorted portion shrinks by 1 each pass"
    ],
    examTip: "More efficient than bubble sort. Performs fewer swaps.",
    practiceQ: "Implement selection sort recursively",
    quiz: [
      {
        question: "How many swaps in worst case for selection sort?",
        options: ["n", "n-1", "n²", "1"],
        correct: 1,
        explanation: "Selection sort performs at most n-1 swaps (one per pass)"
      }
    ],
    visualizationSteps: [
      { variables: { arr: "[64,25,12,22,11]", i: "0", minIndex: "4" }, output: "Find minimum 11 at index 4" },
      { variables: { arr: "[11,25,12,22,64]" }, output: "Swap 64 and 11: [11,25,12,22,64]" },
      { variables: { i: "1", minIndex: "2" }, output: "Find minimum 12 at index 2" },
      { variables: { arr: "[11,12,25,22,64]" }, output: "Swap 25 and 12: [11,12,25,22,64]" },
      { variables: { i: "2", minIndex: "3" }, output: "Find minimum 22 at index 3" },
      { variables: { arr: "[11,12,22,25,64]" }, output: "Swap 25 and 22: [11,12,22,25,64]" },
      { variables: { arr: "[11,12,22,25,64]" }, output: "Array sorted" }
    ]
  },

  "string-reverse": {
    title: "String Reverse",
    subject: "c",
    concept: [
      "Swap characters from start and end",
      "Use two pointers: i from start, j from end",
      "Swap arr[i] with arr[j], increment i, decrement j",
      "Stop when i >= j"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nvoid reverseString(char str[]) {\n    int length = strlen(str);\n    int i = 0, j = length - 1;\n    \n    while (i < j) {\n        char temp = str[i];\n        str[i] = str[j];\n        str[j] = temp;\n        i++;\n        j--;\n    }\n}\n\nint main() {\n    char str[100];\n    \n    printf("Enter string: ");\n    scanf("%s", str);\n    \n    printf("Original: %s\\n", str);\n    \n    reverseString(str);\n    \n    printf("Reversed: %s\\n", str);\n    \n    return 0;\n}`,
    explanation: [
      "Get string length",
      "Initialize i=0, j=length-1",
      "Swap str[i] with str[j]",
      "Increment i, decrement j",
      "Continue while i < j"
    ],
    examTip: "Two-pointer approach. Modifies string in-place.",
    practiceQ: "Reverse string recursively",
    quiz: [
      {
        question: "Reverse of 'hello'?",
        options: ["hello", "olleh", "lleho", "ohell"],
        correct: 1,
        explanation: "h->o, e->l, l->l, l->e, o->h = 'olleh'"
      }
    ],
    visualizationSteps: [
      { variables: { str: "'hello'", length: "5", i: "0", j: "4" }, output: "i=0, j=4, swap 'h' and 'o'" },
      { variables: { str: "'olleh'", i: "1", j: "3" }, output: "i=1, j=3, swap 'e' and 'l'" },
      { variables: { str: "'olleh'", i: "2", j: "2" }, output: "i=2, j=2, middle character unchanged" },
      { variables: { str: "'olleh'" }, output: "String reversed successfully" }
    ]
  },

  "vowel-count": {
    title: "Vowel Count",
    subject: "c",
    concept: [
      "Count vowels: a, e, i, o, u (both cases)",
      "Loop through each character",
      "Check if character is vowel",
      "Increment counter for each vowel found"
    ],
    code: `#include <stdio.h>\n#include <ctype.h>\n\nint isVowel(char ch) {\n    ch = tolower(ch);\n    return (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u');\n}\n\nint main() {\n    char str[100];\n    int count = 0;\n    \n    printf("Enter string: ");\n    scanf("%s", str);\n    \n    for (int i = 0; str[i] != '\\0'; i++) {\n        if (isVowel(str[i])) {\n            count++;\n        }\n    }\n    \n    printf("Number of vowels: %d\\n", count);\n    \n    return 0;\n}`,
    explanation: [
      "isVowel() checks if character is vowel",
      "tolower() converts to lowercase for case-insensitive check",
      "Loop through string until null terminator",
      "Increment count for each vowel found"
    ],
    examTip: "Use tolower() for case-insensitive comparison. Check for null terminator.",
    practiceQ: "Count consonants and special characters in string",
    quiz: [
      {
        question: "Vowels in 'education'?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "e,u,a,i,o = 5 vowels"
      }
    ],
    visualizationSteps: [
      { variables: { str: "'hello'", i: "0", count: "0" }, output: "Check 'h' - not vowel" },
      { variables: { i: "1", count: "1" }, output: "Check 'e' - vowel, count=1" },
      { variables: { i: "2", count: "1" }, output: "Check 'l' - not vowel" },
      { variables: { i: "3", count: "1" }, output: "Check 'l' - not vowel" },
      { variables: { i: "4", count: "2" }, output: "Check 'o' - vowel, count=2" },
      { variables: { count: "2" }, output: "Total vowels: 2" }
    ]
  },

  "gcd-recursion": {
    title: "GCD (Recursive)",
    subject: "c",
    concept: [
      "GCD: Greatest Common Divisor",
      "Euclidean algorithm: gcd(a,b) = gcd(b, a%b)",
      "Base case: gcd(a,0) = a",
      "Recursive case reduces problem size"
    ],
    code: `#include <stdio.h>\n\nint gcd(int a, int b) {\n    if (b == 0) {\n        return a;  // Base case\n    } else {\n        return gcd(b, a % b);  // Recursive case\n    }\n}\n\nint main() {\n    int a, b;\n    \n    printf("Enter two numbers: ");\n    scanf("%d %d", &a, &b);\n    \n    printf("GCD of %d and %d is %d\\n", a, b, gcd(a, b));\n    \n    return 0;\n}`,
    explanation: [
      "gcd(a,0) = a - base case",
      "gcd(a,b) = gcd(b, a%b) - recursive case",
      "a%b gives remainder when a divided by b",
      "Process continues until b becomes 0"
    ],
    examTip: "Euclidean algorithm. Base case when second number becomes 0.",
    practiceQ: "Implement GCD iteratively",
    quiz: [
      {
        question: "GCD of 48 and 18?",
        options: ["6", "12", "24", "48"],
        correct: 0,
        explanation: "48÷18=2 remainder 12, 18÷12=1 remainder 6, 12÷6=2 remainder 0, GCD=6"
      }
    ],
    visualizationSteps: [
      { variables: { a: "48", b: "18" }, output: "gcd(48,18) = gcd(18, 48%18)" },
      { variables: { a: "18", b: "12" }, output: "gcd(18,12) = gcd(12, 18%12)" },
      { variables: { a: "12", b: "6" }, output: "gcd(12,6) = gcd(6, 12%6)" },
      { variables: { a: "6", b: "0" }, output: "gcd(6,0) = 6 (base case)" },
      { variables: { result: "6" }, output: "GCD = 6" }
    ]
  },

  "power-function": {
    title: "Power Function",
    subject: "c",
    concept: [
      "Calculate x^y using recursion",
      "Base case: x^0 = 1",
      "Recursive case: x^y = x * x^(y-1)",
      "Can be optimized using fast exponentiation"
    ],
    code: `#include <stdio.h>\n\nint power(int x, int y) {\n    if (y == 0) {\n        return 1;  // Base case\n    } else {\n        return x * power(x, y - 1);  // Recursive case\n    }\n}\n\nint main() {\n    int base, exponent;\n    \n    printf("Enter base and exponent: ");\n    scanf("%d %d", &base, &exponent);\n    \n    printf("%d^%d = %d\\n", base, exponent, power(base, exponent));\n    \n    return 0;\n}`,
    explanation: [
      "power(x,0) = 1 - base case",
      "power(x,y) = x * power(x,y-1) - recursive case",
      "Each call reduces exponent by 1",
      "Multiplication happens during return"
    ],
    examTip: "Base case y==0 returns 1. Recursive case multiplies by x.",
    practiceQ: "Implement fast exponentiation (O(log n) time)",
    quiz: [
      {
        question: "2^3 using recursion calls?",
        options: ["3 calls", "4 calls", "2 calls", "1 call"],
        correct: 1,
        explanation: "power(2,3) -> 2*power(2,2) -> 2*2*power(2,1) -> 2*2*2*power(2,0) -> 2*2*2*1 = 4 calls"
      }
    ],
    visualizationSteps: [
      { variables: { x: "2", y: "3" }, output: "power(2,3) = 2 * power(2,2)" },
      { variables: { x: "2", y: "2" }, output: "power(2,2) = 2 * power(2,1)" },
      { variables: { x: "2", y: "1" }, output: "power(2,1) = 2 * power(2,0)" },
      { variables: { x: "2", y: "0", result: "1" }, output: "power(2,0) = 1 (base case)" },
      { variables: { result: "2" }, output: "2 * 1 = 2" },
      { variables: { result: "4" }, output: "2 * 2 = 4" },
      { variables: { result: "8" }, output: "2 * 4 = 8" }
    ]
  },

  "pointer-swap": {
    title: "Pointer Swap",
    subject: "c",
    concept: [
      "Swap two variables using pointers",
      "Pass addresses to function",
      "Dereference pointers to access values",
      "Changes affect original variables"
    ],
    code: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    \n    printf("Before swap: x=%d, y=%d\\n", x, y);\n    \n    swap(&x, &y);\n    \n    printf("After swap: x=%d, y=%d\\n", x, y);\n    \n    return 0;\n}`,
    explanation: [
      "swap() takes pointer parameters",
      "&x, &y pass addresses",
      "*a, *b dereference to access values",
      "temp = *a saves first value",
      "*a = *b, *b = temp swaps values"
    ],
    examTip: "Use & to pass addresses, * to access values. Changes original variables.",
    practiceQ: "Swap two strings using pointers",
    quiz: [
      {
        question: "Why use pointers for swap?",
        options: ["Faster", "Memory efficient", "Modify original variables", "All of above"],
        correct: 2,
        explanation: "Pointers allow function to modify original variables passed by address"
      }
    ],
    visualizationSteps: [
      { variables: { x: "10", y: "20" }, output: "Before swap: x=10, y=20" },
      { variables: { a: "&x", b: "&y" }, output: "Function receives addresses of x and y" },
      { variables: { temp: "10" }, output: "temp = *a = 10" },
      { variables: { x: "20", temp: "10" }, output: "*a = *b sets x = 20" },
      { variables: { y: "10", temp: "10" }, output: "*b = temp sets y = 10" },
      { variables: { x: "20", y: "10" }, output: "After swap: x=20, y=10" }
    ]
  },

  "array-sum-pointer": {
    title: "Array Sum with Pointers",
    subject: "c",
    concept: [
      "Use pointers to traverse array",
      "Array name is pointer to first element",
      "Increment pointer to access next elements",
      "Pointer arithmetic: ptr + i ≡ &arr[i]"
    ],
    code: `#include <stdio.h>\n\nint sumArray(int *arr, int n) {\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        sum += *(arr + i);  // arr[i] equivalent\n    }\n    return sum;\n}\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    int n = 5;\n    \n    int total = sumArray(arr, n);\n    \n    printf("Sum of array elements: %d\\n", total);\n    \n    return 0;\n}`,
    explanation: [
      "sumArray() takes int *arr (pointer to int)",
      "arr parameter receives &arr[0]",
      "*(arr + i) equivalent to arr[i]",
      "Pointer arithmetic moves by sizeof(int) bytes"
    ],
    examTip: "Array parameters decay to pointers. Use pointer arithmetic for traversal.",
    practiceQ: "Find maximum element in array using pointers",
    quiz: [
      {
        question: "*(arr + 2) is same as?",
        options: ["arr[2]", "arr + 2", "&arr[2]", "arr[2] + 2"],
        correct: 0,
        explanation: "*(arr + 2) dereferences arr + 2 positions, equivalent to arr[2]"
      }
    ],
    visualizationSteps: [
      { variables: { arr: "[1,2,3,4,5]", n: "5", sum: "0", i: "0" }, output: "sum += *(arr + 0) = 1, sum=1" },
      { variables: { i: "1", sum: "3" }, output: "sum += *(arr + 1) = 2, sum=3" },
      { variables: { i: "2", sum: "6" }, output: "sum += *(arr + 2) = 3, sum=6" },
      { variables: { i: "3", sum: "10" }, output: "sum += *(arr + 3) = 4, sum=10" },
      { variables: { i: "4", sum: "15" }, output: "sum += *(arr + 4) = 5, sum=15" },
      { variables: { sum: "15" }, output: "Total sum = 15" }
    ]
  },

  "student-struct": {
    title: "Student Structure",
    subject: "c",
    concept: [
      "Define structure for student data",
      "Members: name, roll_no, marks, grade",
      "Create array of structures",
      "Access members with dot operator"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int roll_no;\n    float marks;\n    char grade;\n};\n\nint main() {\n    struct Student students[3];\n    \n    // Input student data\n    for (int i = 0; i < 3; i++) {\n        printf("Enter details for student %d:\\n", i+1);\n        printf("Name: ");\n        scanf("%s", students[i].name);\n        printf("Roll No: ");\n        scanf("%d", &students[i].roll_no);\n        printf("Marks: ");\n        scanf("%f", &students[i].marks);\n        \n        // Assign grade\n        if (students[i].marks >= 90) students[i].grade = 'A';\n        else if (students[i].marks >= 80) students[i].grade = 'B';\n        else if (students[i].marks >= 70) students[i].grade = 'C';\n        else students[i].grade = 'F';\n    }\n    \n    // Display students\n    printf("\\nStudent Details:\\n");\n    for (int i = 0; i < 3; i++) {\n        printf("Name: %s, Roll: %d, Marks: %.2f, Grade: %c\\n",\n               students[i].name, students[i].roll_no, \n               students[i].marks, students[i].grade);\n    }\n    \n    return 0;\n}`,
    explanation: [
      "struct Student defines student data structure",
      "struct Student students[3] creates array of 3 students",
      "students[i].name accesses name of ith student",
      "Grade assigned based on marks"
    ],
    examTip: "Structures group related data. Use arrays of structures for multiple records.",
    practiceQ: "Find student with highest marks and display details",
    quiz: [
      {
        question: "Access roll_no of first student?",
        options: ["students.roll_no[0]", "students[0].roll_no", "roll_no.students[0]", "students[roll_no][0]"],
        correct: 1,
        explanation: "students[0].roll_no accesses roll_no member of first student"
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "struct Student defined with name, roll_no, marks, grade" },
      { variables: {}, output: "Array students[3] created" },
      { variables: { "students[0].name": "'John'", "students[0].roll_no": "101", "students[0].marks": "85.5" }, output: "First student data assigned" },
      { variables: { "students[0].grade": "'B'" }, output: "Grade 'B' assigned (marks >= 80)" },
      { variables: { "students[1].name": "'Alice'", "students[1].roll_no": "102", "students[1].marks": "92.0" }, output: "Second student data assigned" },
      { variables: { "students[1].grade": "'A'" }, output: "Grade 'A' assigned (marks >= 90)" }
    ]
  },

  "file-read-write-program": {
    title: "File Read/Write Program",
    subject: "c",
    concept: [
      "Write student data to file",
      "Read data back from file",
      "Use fprintf() for writing, fscanf() for reading",
      "Handle file operations safely"
    ],
    code: `#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int roll_no;\n    float marks;\n};\n\nint main() {\n    FILE *file;\n    struct Student s;\n    \n    // Write to file\n    file = fopen("students.txt", "w");\n    if (file == NULL) {\n        printf("Error opening file\\n");\n        return 1;\n    }\n    \n    strcpy(s.name, "John");\n    s.roll_no = 101;\n    s.marks = 85.5;\n    \n    fprintf(file, "%s %d %.2f\\n", s.name, s.roll_no, s.marks);\n    fclose(file);\n    \n    // Read from file\n    file = fopen("students.txt", "r");\n    if (file == NULL) {\n        printf("Error opening file\\n");\n        return 1;\n    }\n    \n    printf("Data from file:\\n");\n    fscanf(file, "%s %d %f", s.name, &s.roll_no, &s.marks);\n    printf("Name: %s, Roll: %d, Marks: %.2f\\n", s.name, s.roll_no, s.marks);\n    \n    fclose(file);\n    \n    return 0;\n}`,
    explanation: [
      "fprintf(file, format, variables) writes formatted data",
      "fscanf(file, format, addresses) reads formatted data",
      "Structure data written and read back",
      "File closed after operations"
    ],
    examTip: "Use fprintf/fscanf for formatted file I/O. Always check fopen return value.",
    practiceQ: "Write program to store and retrieve array of student records from file",
    quiz: [
      {
        question: "Function to write formatted data to file?",
        options: ["fwrite()", "fprintf()", "fputs()", "fputc()"],
        correct: 1,
        explanation: "fprintf() writes formatted data to file, like printf() for files"
      }
    ],
    visualizationSteps: [
      { variables: {}, output: "File opened for writing" },
      { variables: { "s.name": "'John'", "s.roll_no": "101", "s.marks": "85.5" }, output: "Student data prepared" },
      { variables: {}, output: "fprintf() writes 'John 101 85.50' to file" },
      { variables: {}, output: "File closed" },
      { variables: {}, output: "File reopened for reading" },
      { variables: {}, output: "fscanf() reads name, roll_no, marks from file" },
      { variables: { "s.name": "'John'", "s.roll_no": "101", "s.marks": "85.5" }, output: "Data successfully read back" }
    ]
  },

  "star-pattern": {
    title: "Star Pattern",
    subject: "c",
    concept: [
      "Print patterns using nested loops",
      "Outer loop controls rows",
      "Inner loop controls columns/stars",
      "Use printf(\"*\") and printf(\"\\n\")"
    ],
    code: `#include <stdio.h>\n\nint main() {\n    int rows = 5;\n    \n    // Right triangle pattern\n    printf("Right Triangle:\\n");\n    for (int i = 1; i <= rows; i++) {\n        for (int j = 1; j <= i; j++) {\n            printf("* ");\n        }\n        printf("\\n");\n    }\n    \n    printf("\\nInverted Right Triangle:\\n");\n    for (int i = rows; i >= 1; i--) {\n        for (int j = 1; j <= i; j++) {\n            printf("* ");\n        }\n        printf("\\n");\n    }\n    \n    return 0;\n}`,
    explanation: [
      "Outer loop i: 1 to rows (controls rows)",
      "Inner loop j: 1 to i (controls stars per row)",
      "printf(\"* \") prints star with space",
      "printf(\"\\n\") moves to next line"
    ],
    examTip: "Nested loops: outer for rows, inner for columns. Watch loop bounds carefully.",
    practiceQ: "Print pyramid pattern and diamond pattern",
    quiz: [
      {
        question: "For right triangle with 3 rows, row 2 has?",
        options: ["1 star", "2 stars", "3 stars", "6 stars"],
        correct: 1,
        explanation: "Row i has i stars, so row 2 has 2 stars"
      }
    ],
    visualizationSteps: [
      { variables: { rows: "3", i: "1", j: "1" }, output: "Row 1: print 1 star" },
      { variables: { i: "2", j: "1" }, output: "Row 2: print star 1" },
      { variables: { i: "2", j: "2" }, output: "Row 2: print star 2" },
      { variables: { i: "3", j: "1" }, output: "Row 3: print star 1" },
      { variables: { i: "3", j: "2" }, output: "Row 3: print star 2" },
      { variables: { i: "3", j: "3" }, output: "Row 3: print star 3" }
    ]
  },

  // HTML TOPICS
  "html-basics": {
    title: "HTML Basics",
    subject: "html",
    concept: [
      "HTML: HyperText Markup Language",
      "Structure: <!DOCTYPE html>, <html>, <head>, <body>",
      "Elements: <h1>-<h6>, <p>, <div>, <span>",
      "Attributes: class, id, src, href"
    ],
    code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome to HTML</h1>\n    <p>This is a paragraph.</p>\n    <div id="container">\n        <span class="highlight">Important text</span>\n    </div>\n</body>\n</html>`,
    explanation: [
      "<!DOCTYPE html> declares HTML5 document",
      "<html> root element with lang attribute",
      "<head> contains meta information and title",
      "<body> contains visible page content",
      "Elements have opening and closing tags"
    ],
    examTip: "Always include DOCTYPE. Use semantic elements. Close all tags.",
    practiceQ: "Create HTML page with heading, paragraph, and image",
    quiz: [
      {
        question: "Purpose of <!DOCTYPE html>?",
        options: ["Styling", "Scripting", "Document type declaration", "Meta data"],
        correct: 2,
        explanation: "<!DOCTYPE html> tells browser this is HTML5 document"
      }
    ],
    visualizationSteps: []
  },

  "html-elements": {
    title: "HTML Elements",
    subject: "html",
    concept: [
      "Block elements: <div>, <p>, <h1>, take full width",
      "Inline elements: <span>, <a>, <img>, flow with text",
      "Semantic elements: <header>, <nav>, <main>, <article>",
      "Void elements: <img>, <br>, <input>, no closing tag"
    ],
    code: `<div class="container">\n    <header>\n        <h1>Website Title</h1>\n        <nav>\n            <a href="#home">Home</a>\n            <a href="#about">About</a>\n        </nav>\n    </header>\n    \n    <main>\n        <article>\n            <h2>Article Title</h2>\n            <p>This is the main content.</p>\n            <img src="image.jpg" alt="Description">\n        </article>\n    </main>\n</div>`,
    explanation: [
      "<header> site header with navigation",
      "<nav> navigation links",
      "<main> main content area",
      "<article> self-contained content",
      "<img> void element, no closing tag"
    ],
    examTip: "Use semantic elements for better accessibility and SEO.",
    practiceQ: "Create semantic HTML structure for blog post",
    quiz: [
      {
        question: "Which is a void element?",
        options: ["<div>", "<p>", "<img>", "<span>"],
        correct: 2,
        explanation: "<img> is a void element that doesn't need a closing tag"
      }
    ],
    visualizationSteps: []
  },

  "html-links-images": {
    title: "Links and Images",
    subject: "html",
    concept: [
      "<a> element creates hyperlinks",
      "href attribute specifies destination",
      "target=\"_blank\" opens in new tab",
      "<img> displays images",
      "src attribute specifies image path",
      "alt attribute for accessibility"
    ],
    code: `<h2>Links and Images</h2>\n\n<!-- External link -->\n<a href="https://www.example.com" target="_blank">\n    Visit Example\n</a>\n\n<!-- Internal link -->\n<a href="#section1">Go to Section 1</a>\n\n<!-- Email link -->\n<a href="mailto:contact@example.com">Send Email</a>\n\n<!-- Image -->\n<img src="photo.jpg" alt="A beautiful photo" width="300">\n\n<!-- Image with link -->\n<a href="gallery.html">\n    <img src="thumbnail.jpg" alt="Gallery">\n</a>`,
    explanation: [
      "href=\"https://...\" external links",
      "href=\"#id\" internal page links",
      "href=\"mailto:...\" email links",
      "src=\"path\" image source",
      "alt=\"text\" alternative text for screen readers"
    ],
    examTip: "Always include alt text for images. Use target=\"_blank\" for external links.",
    practiceQ: "Create image gallery with links to full-size images",
    quiz: [
      {
        question: "Purpose of alt attribute?",
        options: ["Styling", "Animation", "Accessibility", "Layout"],
        correct: 2,
        explanation: "alt provides alternative text for screen readers and when image fails to load"
      }
    ],
    visualizationSteps: []
  },

  "html-lists": {
    title: "HTML Lists",
    subject: "html",
    concept: [
      "Ordered lists: <ol> with <li> items",
      "Unordered lists: <ul> with <li> items",
      "Definition lists: <dl> with <dt> and <dd>",
      "Nested lists for hierarchical data",
      "List styling with CSS"
    ],
    code: `<h2>Types of Lists</h2>\n\n<!-- Ordered List -->\n<h3>Programming Languages:</h3>\n<ol>\n    <li>C</li>\n    <li>Java</li>\n    <li>Python</li>\n</ol>\n\n<!-- Unordered List -->\n<h3>Features:</h3>\n<ul>\n    <li>Easy to learn</li>\n    <li>Powerful</li>\n    <li>Versatile</li>\n</ul>\n\n<!-- Definition List -->\n<h3>Terms:</h3>\n<dl>\n    <dt>HTML</dt>\n    <dd>HyperText Markup Language</dd>\n    <dt>CSS</dt>\n    <dd>Cascading Style Sheets</dd>\n</dl>`,
    explanation: [
      "<ol> creates numbered list (1, 2, 3...)",
      "<ul> creates bulleted list",
      "<dl> creates definition list",
      "<dt> definition term, <dd> definition description",
      "Lists can be nested inside each other"
    ],
    examTip: "Use <ol> for ordered sequences, <ul> for unordered items, <dl> for terms/definitions.",
    practiceQ: "Create nested list for course syllabus with modules and topics",
    quiz: [
      {
        question: "Which tag creates numbered list?",
        options: ["<ul>", "<ol>", "<dl>", "<li>"],
        correct: 1,
        explanation: "<ol> creates ordered (numbered) list"
      }
    ],
    visualizationSteps: []
  },

  "html-tables": {
    title: "HTML Tables",
    subject: "html",
    concept: [
      "<table> creates table structure",
      "<tr> table row, <td> table data cell",
      "<th> table header cell",
      "colspan and rowspan for cell spanning",
      "Semantic table structure with <thead>, <tbody>, <tfoot>"
    ],
    code: `<table border="1">\n    <thead>\n        <tr>\n            <th>Name</th>\n            <th>Age</th>\n            <th>City</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>John</td>\n            <td>25</td>\n            <td>NYC</td>\n        </tr>\n        <tr>\n            <td>Alice</td>\n            <td>30</td>\n            <td>LA</td>\n        </tr>\n    </tbody>\n    <tfoot>\n        <tr>\n            <th colspan="3">Total: 2 people</th>\n        </tr>\n    </tfoot>\n</table>`,
    explanation: [
      "<thead> table header section",
      "<tbody> table body with data",
      "<tfoot> table footer",
      "<th> header cells (bold, centered)",
      "<td> data cells",
      "colspan=\"3\" spans across 3 columns"
    ],
    examTip: "Use semantic table structure. <th> for headers, <td> for data.",
    practiceQ: "Create timetable with days as columns and periods as rows",
    quiz: [
      {
        question: "Purpose of colspan attribute?",
        options: ["Row span", "Column span", "Table width", "Cell height"],
        correct: 1,
        explanation: "colspan makes cell span across multiple columns"
      }
    ],
    visualizationSteps: []
  },

  "html-forms": {
    title: "HTML Forms",
    subject: "html",
    concept: [
      "<form> creates data submission form",
      "Input types: text, password, email, number, date",
      "<textarea> for multi-line text",
      "<select> dropdown, <option> choices",
      "<input type=\"radio\"> single choice",
      "<input type=\"checkbox\"> multiple choices"
    ],
    code: `<form action="/submit" method="post">\n    <label for="name">Name:</label>\n    <input type="text" id="name" name="name" required>\n    \n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" required>\n    \n    <label for="age">Age:</label>\n    <input type="number" id="age" name="age" min="1" max="120">\n    \n    <label for="message">Message:</label>\n    <textarea id="message" name="message" rows="4"></textarea>\n    \n    <label>Gender:</label>\n    <input type="radio" name="gender" value="male"> Male\n    <input type="radio" name="gender" value="female"> Female\n    \n    <input type="submit" value="Submit">\n</form>`,
    explanation: [
      "<form> wraps form elements",
      "action=\"/submit\" submission URL",
      "method=\"post\" HTTP method",
      "required attribute makes field mandatory",
      "name attribute for form data submission",
      "type=\"email\" validates email format"
    ],
    examTip: "Use appropriate input types for validation. Always include labels.",
    practiceQ: "Create registration form with validation for username, password, confirm password",
    quiz: [
      {
        question: "Which input type validates email?",
        options: ["text", "password", "email", "url"],
        correct: 2,
        explanation: "type=\"email\" provides built-in email validation"
      }
    ],
    visualizationSteps: []
  },

  // CSS TOPICS
  "css-selectors": {
    title: "CSS Selectors",
    subject: "css",
    concept: [
      "Element selectors: p, div, h1",
      "Class selectors: .classname",
      "ID selectors: #idname",
      "Attribute selectors: [attr=\"value\"]",
      "Pseudo-classes: :hover, :focus, :nth-child()",
      "Combinators: descendant, child, adjacent sibling"
    ],
    code: `/* Element selector */\np {\n    color: blue;\n}\n\n/* Class selector */\n.highlight {\n    background-color: yellow;\n}\n\n/* ID selector */\n#header {\n    font-size: 24px;\n}\n\n/* Attribute selector */\ninput[type="text"] {\n    border: 1px solid #ccc;\n}\n\n/* Pseudo-class */\nbutton:hover {\n    background-color: #f0f0f0;\n}\n\n/* Descendant combinator */\n.container p {\n    margin: 10px;\n}`,
    explanation: [
      "p selects all <p> elements",
      ".highlight selects elements with class=\"highlight\"",
      "#header selects element with id=\"header\"",
      "input[type=\"text\"] selects text inputs",
      "button:hover applies on mouse hover",
      ".container p selects p elements inside .container"
    ],
    examTip: "ID selectors (#) have highest specificity. Classes (.) are reusable.",
    practiceQ: "Style navigation menu with hover effects using CSS selectors",
    quiz: [
      {
        question: "Which has highest specificity?",
        options: ["Element selector", "Class selector", "ID selector", "Universal selector"],
        correct: 2,
        explanation: "ID selectors (#id) have highest specificity over classes (.) and elements"
      }
    ],
    visualizationSteps: []
  },

  "css-box-model": {
    title: "CSS Box Model",
    subject: "css",
    concept: [
      "Every element is a rectangular box",
      "Content: actual content area",
      "Padding: space around content",
      "Border: line around padding",
      "Margin: space outside border",
      "Width/height apply to content area"
    ],
    code: `.box {\n    width: 200px;\n    height: 100px;\n    padding: 20px;\n    border: 2px solid #000;\n    margin: 10px;\n    \n    /* Total width: 200 + 40 + 4 + 20 = 264px */\n    /* Content: 200px */\n    /* Padding: 20px × 2 = 40px */\n    /* Border: 2px × 2 = 4px */\n    /* Margin: 10px × 2 = 20px */\n}`,
    explanation: [
      "width: 200px sets content width",
      "padding: 20px adds 20px on all sides",
      "border: 2px solid #000 adds 2px border",
      "margin: 10px adds 10px space outside",
      "Total element width: content + padding + border + margin"
    ],
    examTip: "Box model: Content → Padding → Border → Margin. Width/height = content only.",
    practiceQ: "Create card component with proper spacing using box model properties",
    quiz: [
      {
        question: "Box model order from inside to outside?",
        options: ["Margin, Border, Padding, Content", "Content, Padding, Border, Margin", "Border, Content, Margin, Padding", "Padding, Margin, Content, Border"],
        correct: 1,
        explanation: "Content (innermost) → Padding → Border → Margin (outermost)"
      }
    ],
    visualizationSteps: []
  },

  "css-text-font": {
    title: "CSS Text and Fonts",
    subject: "css",
    concept: [
      "font-family: specify font stack",
      "font-size: text size (px, em, rem)",
      "font-weight: normal, bold, 100-900",
      "color: text color",
      "text-align: left, center, right, justify",
      "text-decoration: none, underline, line-through"
    ],
    code: `.heading {\n    font-family: 'Arial', sans-serif;\n    font-size: 24px;\n    font-weight: bold;\n    color: #333;\n    text-align: center;\n    text-decoration: none;\n}\n\n.paragraph {\n    font-family: 'Times New Roman', serif;\n    font-size: 16px;\n    line-height: 1.5;\n    color: #666;\n    text-align: left;\n}\n\n.link {\n    color: #007bff;\n    text-decoration: underline;\n}\n\n.link:hover {\n    text-decoration: none;\n}`,
    explanation: [
      "font-family with fallbacks",
      "font-size in px, em, rem units",
      "font-weight: normal(400), bold(700)",
      "line-height for readability",
      "text-decoration for links",
      ":hover pseudo-class for interactions"
    ],
    examTip: "Use relative units (em, rem) for responsive design. Always specify font fallbacks.",
    practiceQ: "Style a blog post with proper typography hierarchy",
    quiz: [
      {
        question: "Best unit for font-size?",
        options: ["px", "em", "rem", "pt"],
        correct: 2,
        explanation: "rem is relative to root font-size, good for responsive design"
      }
    ],
    visualizationSteps: []
  },

  "css-colors-background": {
    title: "CSS Colors and Backgrounds",
    subject: "css",
    concept: [
      "Color formats: named, hex, rgb(), hsl()",
      "background-color: solid colors",
      "background-image: url() for images",
      "background-repeat, background-position, background-size",
      "Gradients: linear-gradient(), radial-gradient()",
      "Transparency with rgba(), opacity"
    ],
    code: `.color-examples {\n    /* Named colors */\n    color: red;\n    background-color: blue;\n    \n    /* Hex colors */\n    color: #ff0000;\n    background-color: #0000ff;\n    \n    /* RGB colors */\n    color: rgb(255, 0, 0);\n    background-color: rgb(0, 0, 255);\n}\n\n.background-examples {\n    /* Background image */\n    background-image: url('image.jpg');\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: cover;\n    \n    /* Linear gradient */\n    background: linear-gradient(to right, #ff0000, #0000ff);\n    \n    /* Transparency */\n    background-color: rgba(255, 0, 0, 0.5);\n}`,
    explanation: [
      "Named colors: red, blue, green, etc.",
      "Hex: #RRGGBB format",
      "RGB: rgb(red, green, blue) 0-255",
      "RGBA: adds alpha for transparency",
      "Gradients create smooth color transitions",
      "Background properties control image display"
    ],
    examTip: "Use rgba() for transparency. Gradients work with background-image.",
    practiceQ: "Create button with gradient background and hover effects",
    quiz: [
      {
        question: "RGBA stands for?",
        options: ["Red Green Blue Alpha", "Red Green Black Alpha", "Red Gray Blue Alpha", "Red Green Blue Angle"],
        correct: 0,
        explanation: "RGBA = Red, Green, Blue, Alpha (transparency)"
      }
    ],
    visualizationSteps: []
  },

  "css-display": {
    title: "CSS Display Property",
    subject: "css",
    concept: [
      "display: block - full width, stack vertically",
      "display: inline - flow with text, width as content",
      "display: inline-block - inline but with block properties",
      "display: none - remove from layout",
      "display: flex - flexbox layout",
      "display: grid - grid layout"
    ],
    code: `.block-element {\n    display: block;\n    width: 100%;\n    background: lightblue;\n}\n\n.inline-element {\n    display: inline;\n    background: lightgreen;\n}\n\n.inline-block-element {\n    display: inline-block;\n    width: 100px;\n    height: 50px;\n    background: lightyellow;\n}\n\n.hidden-element {\n    display: none;\n}\n\n.flex-container {\n    display: flex;\n    justify-content: space-between;\n}\n\n.grid-container {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n}`,
    explanation: [
      "block: div, p, h1 default",
      "inline: span, a, strong default",
      "inline-block: combines inline and block",
      "none: completely hidden",
      "flex: modern layout system",
      "grid: two-dimensional layout"
    ],
    examTip: "Block elements take full width. Inline elements respect text flow.",
    practiceQ: "Create navigation bar using flexbox with proper spacing",
    quiz: [
      {
        question: "Default display of <div>?",
        options: ["inline", "inline-block", "block", "flex"],
        correct: 2,
        explanation: "<div> has display: block by default"
      }
    ],
    visualizationSteps: []
  },

  "css-positioning": {
    title: "CSS Positioning",
    subject: "css",
    concept: [
      "position: static - default, normal flow",
      "position: relative - relative to normal position",
      "position: absolute - relative to nearest positioned ancestor",
      "position: fixed - relative to viewport",
      "position: sticky - hybrid of relative and fixed",
      "z-index for stacking order"
    ],
    code: `.static {\n    position: static; /* Default */\n}\n\n.relative {\n    position: relative;\n    top: 10px;\n    left: 20px;\n}\n\n.absolute {\n    position: absolute;\n    top: 0;\n    right: 0;\n}\n\n.fixed {\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n}\n\n.sticky {\n    position: sticky;\n    top: 0;\n}\n\n.stacked {\n    position: relative;\n    z-index: 10;\n}`,
    explanation: [
      "static: normal document flow",
      "relative: offset from normal position",
      "absolute: positioned relative to ancestor",
      "fixed: fixed to viewport",
      "sticky: sticks during scroll",
      "z-index: higher values appear on top"
    ],
    examTip: "Absolute positioned elements need positioned ancestor. Fixed relative to viewport.",
    practiceQ: "Create modal dialog with proper positioning and z-index",
    quiz: [
      {
        question: "Position relative to viewport?",
        options: ["static", "relative", "absolute", "fixed"],
        correct: 3,
        explanation: "position: fixed is relative to the viewport (browser window)"
      }
    ],
    visualizationSteps: []
  },

  "css-flexbox": {
    title: "CSS Flexbox",
    subject: "css",
    concept: [
      "display: flex enables flexbox",
      "flex-direction: row, column, row-reverse, column-reverse",
      "justify-content: alignment along main axis",
      "align-items: alignment along cross axis",
      "flex-wrap: wrap items to new line",
      "flex: grow shrink basis shorthand"
    ],
    code: `.container {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 10px;\n}\n\n.item {\n    flex: 1 1 200px; /* grow shrink basis */\n}\n\n/* Specific alignments */\n.start { justify-content: flex-start; }\n.center { justify-content: center; }\n.end { justify-content: flex-end; }\n.space-between { justify-content: space-between; }\n.space-around { justify-content: space-around; }`,
    explanation: [
      "flex-direction: main axis direction",
      "justify-content: main axis alignment",
      "align-items: cross axis alignment",
      "flex-wrap: prevent overflow",
      "gap: spacing between items",
      "flex: 1 1 200px means grow, shrink, min-width 200px"
    ],
    examTip: "Main axis: justify-content. Cross axis: align-items. Flex: grow shrink basis.",
    practiceQ: "Create responsive card layout using flexbox",
    quiz: [
      {
        question: "justify-content aligns items along?",
        options: ["Cross axis", "Main axis", "Z axis", "Diagonal"],
        correct: 1,
        explanation: "justify-content aligns items along the main axis"
      }
    ],
    visualizationSteps: []
  },

  // JAVASCRIPT TOPICS
  "js-variables": {
    title: "JavaScript Variables",
    subject: "js",
    concept: [
      "var: function-scoped, can be redeclared",
      "let: block-scoped, cannot be redeclared",
      "const: block-scoped, cannot be reassigned",
      "Variable hoisting with var",
      "Primitive types: string, number, boolean, null, undefined",
      "Reference types: object, array, function"
    ],
    code: `// Variable declarations\nvar name = "John"; // Function scoped\nlet age = 25; // Block scoped\nconst PI = 3.14159; // Cannot reassign\n\n// Data types\nlet message = "Hello"; // String\nlet count = 42; // Number\nlet isActive = true; // Boolean\nlet data = null; // Null\nlet value; // Undefined\n\n// Objects and arrays\nlet person = { name: "Alice", age: 30 }; // Object\nlet numbers = [1, 2, 3, 4, 5]; // Array\n\nconsole.log(name, age, PI);`,
    explanation: [
      "var variables are hoisted to function top",
      "let/const are block-scoped",
      "const prevents reassignment, not mutation",
      "Primitive types: string, number, boolean, null, undefined",
      "Reference types store memory references"
    ],
    examTip: "Use const by default, let when reassignment needed, avoid var in modern code.",
    practiceQ: "Create variables for student object with name, grades array, and isEnrolled boolean",
    quiz: [
      {
        question: "Which can be reassigned?",
        options: ["var", "let", "const", "None"],
        correct: 1,
        explanation: "let variables can be reassigned, const cannot, var can but shouldn't be used"
      }
    ],
    visualizationSteps: []
  },

  "js-operators": {
    title: "JavaScript Operators",
    subject: "js",
    concept: [
      "Arithmetic: +, -, *, /, %, ** (exponentiation)",
      "Assignment: =, +=, -=, *=, /=, %=",
      "Comparison: ==, ===, !=, !==, <, >, <=, >=",
      "Logical: &&, ||, !",
      "Ternary: condition ? true : false",
      "Typeof operator for type checking"
    ],
    code: `// Arithmetic operators\nlet a = 10, b = 3;\nconsole.log(a + b); // 13\nconsole.log(a - b); // 7\nconsole.log(a * b); // 30\nconsole.log(a / b); // 3.333...\nconsole.log(a % b); // 1\nconsole.log(a ** b); // 1000\n\n// Comparison operators\nconsole.log(a == b); // false\nconsole.log(a === b); // false\nconsole.log(a != b); // true\nconsole.log(a !== b); // true\nconsole.log(a > b); // true\n\n// Logical operators\nlet x = true, y = false;\nconsole.log(x && y); // false\nconsole.log(x || y); // true\nconsole.log(!x); // false\n\n// Ternary operator\nlet result = a > b ? "a is greater" : "b is greater";\nconsole.log(result); // "a is greater"`,
    explanation: [
      "** is exponentiation (ES6)",
      "=== strict equality (value and type)",
      "== loose equality (type coercion)",
      "&& requires both true, || requires one true",
      "! negates boolean value",
      "Ternary: condition ? valueIfTrue : valueIfFalse"
    ],
    examTip: "Use === instead of == for strict comparison. ** for exponentiation.",
    practiceQ: "Write expressions using all comparison and logical operators",
    quiz: [
      {
        question: "Difference between == and ===?",
        options: ["None", "=== checks type", "== checks type", "=== is faster"],
        correct: 1,
        explanation: "=== checks both value and type, == performs type coercion"
      }
    ],
    visualizationSteps: []
  },

  "js-conditionals": {
    title: "JavaScript Conditionals",
    subject: "js",
    concept: [
      "if statement: execute if condition true",
      "else: execute if condition false",
      "else if: check multiple conditions",
      "switch: multi-way branch based on value",
      "Truthy/falsy values in conditions",
      "Short-circuit evaluation"
    ],
    code: `// If-else statements\nlet age = 20;\n\nif (age >= 18) {\n    console.log("Adult");\n} else {\n    console.log("Minor");\n}\n\n// Else if chain\nlet score = 85;\nif (score >= 90) {\n    console.log("A");\n} else if (score >= 80) {\n    console.log("B");\n} else if (score >= 70) {\n    console.log("C");\n} else {\n    console.log("F");\n}\n\n// Switch statement\nlet day = 3;\nswitch (day) {\n    case 1:\n        console.log("Monday");\n        break;\n    case 2:\n        console.log("Tuesday");\n        break;\n    case 3:\n        console.log("Wednesday");\n        break;\n    default:\n        console.log("Invalid day");\n}`,
    explanation: [
      "if (condition) executes when true",
      "else executes when if condition false",
      "else if checks additional conditions",
      "switch compares value against cases",
      "break prevents fall-through",
      "default executes if no case matches"
    ],
    examTip: "Use switch for multiple specific values. Don't forget break statements.",
    practiceQ: "Write program to check if number is positive, negative, or zero using if-else",
    quiz: [
      {
        question: "What happens without break in switch?",
        options: ["Error", "Fall-through", "Default executes", "Nothing"],
        correct: 1,
        explanation: "Without break, execution continues to next case (fall-through)"
      }
    ],
    visualizationSteps: []
  },

  "js-loops": {
    title: "JavaScript Loops",
    subject: "js",
    concept: [
      "for: initialization, condition, increment",
      "while: condition checked before execution",
      "do-while: condition checked after execution",
      "for-in: iterate object properties",
      "for-of: iterate arrays/strings (ES6)",
      "break and continue statements"
    ],
    code: `// For loop\nfor (let i = 0; i < 5; i++) {\n    console.log(i);\n}\n\n// While loop\nlet j = 0;\nwhile (j < 5) {\n    console.log(j);\n    j++;\n}\n\n// Do-while loop\nlet k = 0;\ndo {\n    console.log(k);\n    k++;\n} while (k < 5);\n\n// For-of loop (arrays)\nlet numbers = [1, 2, 3, 4, 5];\nfor (let num of numbers) {\n    console.log(num);\n}\n\n// For-in loop (objects)\nlet person = { name: "John", age: 30 };\nfor (let key in person) {\n    console.log(key + ": " + person[key]);\n}`,
    explanation: [
      "for: init; condition; increment",
      "while: checks condition first",
      "do-while: executes once then checks",
      "for-of: iterates array elements",
      "for-in: iterates object keys",
      "break exits loop, continue skips iteration"
    ],
    examTip: "Use for-of for arrays, for-in for objects. Watch infinite loops.",
    practiceQ: "Print multiplication table using nested for loops",
    quiz: [
      {
        question: "Which loop executes at least once?",
        options: ["for", "while", "do-while", "for-of"],
        correct: 2,
        explanation: "do-while executes body once before checking condition"
      }
    ],
    visualizationSteps: []
  },

  "js-functions": {
    title: "JavaScript Functions",
    subject: "js",
    concept: [
      "Function declaration: function name(params) {}",
      "Function expression: const name = function() {}",
      "Arrow functions: (params) => expression",
      "Parameters and arguments",
      "Return statement",
      "Scope and closures"
    ],
    code: `// Function declaration\nfunction greet(name) {\n    return "Hello, " + name + "!";\n}\n\n// Function expression\nconst add = function(a, b) {\n    return a + b;\n};\n\n// Arrow function\nconst multiply = (a, b) => a * b;\n\n// Function with default parameters\nfunction power(base, exponent = 2) {\n    return base ** exponent;\n}\n\n// Usage\nconsole.log(greet("Alice")); // "Hello, Alice!"\nconsole.log(add(5, 3)); // 8\nconsole.log(multiply(4, 5)); // 20\nconsole.log(power(3)); // 9\nconsole.log(power(2, 3)); // 8`,
    explanation: [
      "Function declaration is hoisted",
      "Arrow functions inherit this from parent scope",
      "Default parameters if argument not provided",
      "Functions can return values or undefined",
      "Parameters are local variables"
    ],
    examTip: "Use arrow functions for short expressions. Function declarations are hoisted.",
    practiceQ: "Create calculator functions for +, -, *, / with arrow functions",
    quiz: [
      {
        question: "Arrow function syntax?",
        options: ["function() {}", "() => {}", "function => {}", "=> function() {}"],
        correct: 1,
        explanation: "(parameters) => expression or (parameters) => { statements }"
      }
    ],
    visualizationSteps: []
  },

  "js-dom": {
    title: "DOM Manipulation",
    subject: "js",
    concept: [
      "Document Object Model represents HTML",
      "Select elements: getElementById, querySelector",
      "Modify content: textContent, innerHTML",
      "Modify styles: style property",
      "Create elements: createElement",
      "Event handling: addEventListener"
    ],
    code: `// Selecting elements\nconst title = document.getElementById('title');\nconst buttons = document.querySelectorAll('.btn');\nconst container = document.querySelector('.container');\n\n// Modifying content\ntitle.textContent = "New Title";\ncontainer.innerHTML = "<p>New content</p>";\n\n// Modifying styles\ntitle.style.color = "red";\ntitle.style.fontSize = "24px";\n\n// Creating elements\nconst newDiv = document.createElement('div');\nnewDiv.textContent = "New element";\nnewDiv.className = "new-element";\n\n// Adding to DOM\ncontainer.appendChild(newDiv);\n\n// Event handling\nconst button = document.querySelector('.btn');\nbutton.addEventListener('click', function() {\n    alert('Button clicked!');\n});`,
    explanation: [
      "getElementById for single element by ID",
      "querySelector for CSS selectors",
      "textContent for text, innerHTML for HTML",
      "style property for inline styles",
      "createElement to make new elements",
      "addEventListener for user interactions"
    ],
    examTip: "Use querySelector for modern selection. Avoid innerHTML for user input.",
    practiceQ: "Create dynamic list where users can add/remove items",
    quiz: [
      {
        question: "Select all buttons with class 'btn'?",
        options: ["getElementById('btn')", "querySelector('.btn')", "querySelectorAll('.btn')", "getElementsByClassName('btn')"],
        correct: 2,
        explanation: "querySelectorAll('.btn') returns all elements with class 'btn'"
      }
    ],
    visualizationSteps: []
  },

  "js-events": {
    title: "JavaScript Events",
    subject: "js",
    concept: [
      "Event types: click, submit, keydown, load, etc.",
      "Event object contains event information",
      "addEventListener vs onclick property",
      "Event propagation: bubbling and capturing",
      "preventDefault() to stop default behavior",
      "Event delegation for dynamic elements"
    ],
    code: `// Click event\nconst button = document.querySelector('.btn');\nbutton.addEventListener('click', function(event) {\n    console.log('Button clicked!');\n    console.log('Event type:', event.type);\n    console.log('Target:', event.target);\n});\n\n// Form submit event\nconst form = document.querySelector('form');\nform.addEventListener('submit', function(event) {\n    event.preventDefault(); // Stop form submission\n    console.log('Form submitted');\n});\n\n// Keyboard events\ndocument.addEventListener('keydown', function(event) {\n    console.log('Key pressed:', event.key);\n    if (event.key === 'Escape') {\n        // Close modal or something\n    }\n});\n\n// Mouse events\nconst box = document.querySelector('.box');\nbox.addEventListener('mouseenter', function() {\n    box.style.backgroundColor = 'yellow';\n});\n\nbox.addEventListener('mouseleave', function() {\n    box.style.backgroundColor = 'white';\n});`,
    explanation: [
      "addEventListener(type, function, options)",
      "Event object has type, target, etc.",
      "preventDefault() stops default browser behavior",
      "Event bubbling: child to parent propagation",
      "Event capturing: parent to child"
    ],
    examTip: "Use addEventListener over onclick. preventDefault() for forms.",
    practiceQ: "Create interactive form with validation and submit handling",
    quiz: [
      {
        question: "Prevent default form submission?",
        options: ["stopPropagation()", "preventDefault()", "stopImmediatePropagation()", "cancelBubble()"],
        correct: 1,
        explanation: "event.preventDefault() stops the browser's default action"
      }
    ],
    visualizationSteps: []
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TOPICS_DB;
}