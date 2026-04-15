// data/quizDB.js - Quiz database for CodeFlow

const QUIZ_DB = {
  // C PROGRAMMING QUIZZES
  "c-basics": [
    {
      question: "What is the correct way to include a header file in C?",
      options: ["#include <stdio.h>", "include <stdio.h>", "#include 'stdio.h'", "import stdio.h"],
      correct: 0,
      explanation: "#include <stdio.h> is the correct preprocessor directive to include standard I/O functions."
    },
    {
      question: "Which of the following is the correct main function signature?",
      options: ["int main()", "void main()", "main()", "int main(void)"],
      correct: 3,
      explanation: "int main(void) is the most standard and correct signature for the main function."
    },
    {
      question: "What does return 0; indicate in the main function?",
      options: ["Program error", "Successful execution", "Program termination", "Memory allocation"],
      correct: 1,
      explanation: "return 0; indicates successful program execution to the operating system."
    }
  ],

  "variables": [
    {
      question: "Which data type is used to store decimal numbers in C?",
      options: ["int", "char", "float", "void"],
      correct: 2,
      explanation: "float data type stores floating-point (decimal) numbers."
    },
    {
      question: "What is the output of: printf(\"%d\", sizeof(int)); (assuming 4-byte int)",
      options: ["4", "2", "8", "1"],
      correct: 0,
      explanation: "sizeof(int) returns the size of int in bytes, typically 4 on modern systems."
    },
    {
      question: "Which format specifier is used for printing float values?",
      options: ["%d", "%c", "%f", "%s"],
      correct: 2,
      explanation: "%f is used for float and double values in printf."
    }
  ],

  "operators": [
    {
      question: "What is the result of 7 % 3 in C?",
      options: ["2", "2.33", "21", "1"],
      correct: 3,
      explanation: "7 divided by 3 gives quotient 2 and remainder 1, so 7 % 3 = 1."
    },
    {
      question: "Which operator has higher precedence: * or +?",
      options: ["*", "+", "Same precedence", "Depends on context"],
      correct: 0,
      explanation: "Multiplication (*) has higher precedence than addition (+)."
    },
    {
      question: "What does the ++ operator do?",
      options: ["Divide by 2", "Multiply by 2", "Increment by 1", "Decrement by 1"],
      correct: 2,
      explanation: "++ is the increment operator that increases the value by 1."
    }
  ],

  "input-output": [
    {
      question: "What must be included before & in scanf()?",
      options: ["Nothing", "Variable name", "Data type", "Address operator is not needed"],
      correct: 3,
      explanation: "& is the address-of operator required for scanf() with variables (except arrays)."
    },
    {
      question: "Which function is used for formatted output in C?",
      options: ["scanf()", "printf()", "gets()", "puts()"],
      correct: 1,
      explanation: "printf() is used for formatted output to the console."
    },
    {
      question: "What does scanf() return?",
      options: ["void", "Number of successfully read items", "The input value", "Error code"],
      correct: 1,
      explanation: "scanf() returns the number of input items successfully read and assigned."
    }
  ],

  "conditionals": [
    {
      question: "What is wrong with: if (x = 5)?",
      options: ["Missing braces", "Wrong operator", "Missing semicolon", "Wrong syntax"],
      correct: 1,
      explanation: "= is assignment operator. Should be == for comparison."
    },
    {
      question: "How many else statements can follow an if?",
      options: ["0", "1", "Multiple with else if", "Unlimited"],
      correct: 2,
      explanation: "You can have one else, but multiple else if statements."
    },
    {
      question: "What executes when all if conditions are false?",
      options: ["Nothing", "else block", "default case", "Error"],
      correct: 1,
      explanation: "The else block executes when all if/else if conditions are false."
    }
  ],

  "switch-case": [
    {
      question: "What happens if break is missing in switch?",
      options: ["Error", "Fall-through to next case", "Default executes", "Program exits"],
      correct: 1,
      explanation: "Without break, execution continues to the next case (fall-through)."
    },
    {
      question: "Which keyword handles unmatched values in switch?",
      options: ["case", "break", "default", "else"],
      correct: 2,
      explanation: "default case executes when no case value matches the switch expression."
    },
    {
      question: "Can switch work with float values?",
      options: ["Yes", "No", "Only with casting", "Only positive floats"],
      correct: 1,
      explanation: "Switch requires integer or character values, not float."
    }
  ],

  "loops": [
    {
      question: "How many times does for(i=0; i<5; i++) execute?",
      options: ["4", "5", "6", "Infinite"],
      correct: 1,
      explanation: "i starts at 0, executes while i<5, so i=0,1,2,3,4 (5 times)."
    },
    {
      question: "Which loop executes at least once?",
      options: ["for", "while", "do-while", "All of them"],
      correct: 2,
      explanation: "do-while executes the body once before checking the condition."
    },
    {
      question: "What does continue statement do?",
      options: ["Exit loop", "Skip current iteration", "Restart loop", "Pause execution"],
      correct: 1,
      explanation: "continue skips the rest of current iteration and moves to next iteration."
    }
  ],

  "functions": [
    {
      question: "What is function prototype?",
      options: ["Function definition", "Function declaration", "Function call", "Return statement"],
      correct: 1,
      explanation: "Function prototype is the declaration that tells compiler about function signature."
    },
    {
      question: "Can functions return multiple values?",
      options: ["Yes, directly", "No, but can use pointers", "Only with arrays", "Only with structures"],
      correct: 1,
      explanation: "Functions can return only one value, but pointers can modify multiple values."
    },
    {
      question: "What happens if function has no return statement?",
      options: ["Error", "Returns 0", "Returns garbage", "Returns void"],
      correct: 2,
      explanation: "Non-void functions without return statement return garbage value."
    }
  ],

  "recursion": [
    {
      question: "What is base case in recursion?",
      options: ["First call", "Last call", "Termination condition", "Recursive call"],
      correct: 2,
      explanation: "Base case is the condition that stops the recursion."
    },
    {
      question: "What happens without base case?",
      options: ["Function returns 0", "Stack overflow", "Compilation error", "Infinite loop"],
      correct: 1,
      explanation: "Without base case, recursion never stops, causing stack overflow."
    },
    {
      question: "Is factorial recursive by nature?",
      options: ["Yes", "No", "Sometimes", "Depends on implementation"],
      correct: 0,
      explanation: "Factorial can be defined recursively: n! = n × (n-1)!"
    }
  ],

  "arrays": [
    {
      question: "What is the first index of an array?",
      options: ["-1", "0", "1", "Size-1"],
      correct: 1,
      explanation: "Arrays are zero-based, so first element is at index 0."
    },
    {
      question: "Can array size be negative?",
      options: ["Yes", "No", "Only in dynamic arrays", "Only in structures"],
      correct: 1,
      explanation: "Array size must be positive constant in C."
    },
    {
      question: "What happens when accessing array[size]?",
      options: ["Error", "Garbage value", "Undefined behavior", "Zero"],
      correct: 2,
      explanation: "Accessing beyond array bounds causes undefined behavior."
    }
  ],

  "multidimensional-arrays": [
    {
      question: "How to access element at row 2, column 3?",
      options: ["array[2][3]", "array[3][2]", "array[1][2]", "array[2][2]"],
      correct: 0,
      explanation: "Arrays are zero-based, so row 2 is index 2, column 3 is index 3."
    },
    {
      question: "In int arr[3][4], what does arr[1] represent?",
      options: ["First element", "Second row", "Memory address", "Error"],
      correct: 1,
      explanation: "arr[1] is the entire second row (index 1) of the 2D array."
    },
    {
      question: "Which dimension can be omitted in initialization?",
      options: ["First", "Second", "Both", "None"],
      correct: 0,
      explanation: "First dimension can be omitted, second cannot: int arr[][3] = {...};"
    }
  ],

  "string-basics": [
    {
      question: "What terminates a C string?",
      options: ["Space", "Newline", "Null character \\0", "EOF"],
      correct: 2,
      explanation: "C strings are null-terminated, ending with '\\0' character."
    },
    {
      question: "How to declare a string variable?",
      options: ["string str;", "char str[];", "char* str;", "All of above"],
      correct: 3,
      explanation: "Strings can be declared as char array, char pointer, or with string literal."
    },
    {
      question: "What is string literal?",
      options: ["Variable name", "String in quotes", "Function name", "Header file"],
      correct: 1,
      explanation: "String literal is text enclosed in double quotes, like \"Hello\"."
    }
  ],

  "string-functions": [
    {
      question: "What does strcmp() return for equal strings?",
      options: ["-1", "0", "1", "Length difference"],
      correct: 1,
      explanation: "strcmp() returns 0 when strings are identical."
    },
    {
      question: "Which function copies strings safely?",
      options: ["strcpy()", "strncpy()", "Both", "Neither"],
      correct: 1,
      explanation: "strncpy() is safer as it prevents buffer overflow by limiting copy length."
    },
    {
      question: "What does strlen() return?",
      options: ["String size in memory", "Length excluding null terminator", "Length including null terminator", "Number of words"],
      correct: 1,
      explanation: "strlen() returns the number of characters before the null terminator."
    }
  ],

  "pointers": [
    {
      question: "What does &x return?",
      options: ["Value of x", "Address of x", "Pointer to x", "Reference to x"],
      correct: 1,
      explanation: "& is the address-of operator, returning memory address of x."
    },
    {
      question: "What does *ptr do?",
      options: ["Declare pointer", "Get address", "Dereference pointer", "Multiply"],
      correct: 2,
      explanation: "*ptr accesses the value at the memory address stored in ptr."
    },
    {
      question: "Can pointers store addresses of different types?",
      options: ["Yes, always", "No, never", "With casting", "Only same type"],
      correct: 2,
      explanation: "Pointers can point to different types with explicit casting, but it's risky."
    }
  ],

  "pointer-arithmetic": [
    {
      question: "If int *p = &arr[0], what does p + 2 point to?",
      options: ["arr[1]", "arr[2]", "arr[3]", "Invalid"],
      correct: 1,
      explanation: "p + 2 points to arr[2] (moves 2 * sizeof(int) = 8 bytes)."
    },
    {
      question: "What is pointer arithmetic based on?",
      options: ["Variable name", "Data type size", "Memory address", "Array index"],
      correct: 1,
      explanation: "Pointer arithmetic moves by the size of the data type being pointed to."
    },
    {
      question: "Can you subtract pointers?",
      options: ["Yes", "No", "Only same type", "Only different arrays"],
      correct: 0,
      explanation: "Pointer subtraction gives the number of elements between pointers."
    }
  ],

  "pointers-and-arrays": [
    {
      question: "When is array name NOT a pointer?",
      options: ["In function calls", "When using sizeof", "In assignments", "Never"],
      correct: 1,
      explanation: "sizeof(arr) gives array size, not pointer size. Array name is pointer otherwise."
    },
    {
      question: "What does *(arr + i) equal to?",
      options: ["arr[i]", "arr + i", "&arr[i]", "arr[i] + i"],
      correct: 0,
      explanation: "*(arr + i) is equivalent to arr[i] due to pointer arithmetic."
    },
    {
      question: "How are arrays passed to functions?",
      options: ["By value", "By reference", "By address", "All of above"],
      correct: 1,
      explanation: "Arrays are passed by reference (as pointers) to functions."
    }
  ],

  "structures": [
    {
      question: "How to access structure member?",
      options: ["struct->member", "struct.member", "struct[member]", "member.struct"],
      correct: 1,
      explanation: "Dot operator (.) accesses structure members."
    },
    {
      question: "Can structures contain different data types?",
      options: ["Yes", "No", "Only same type", "Only primitive types"],
      correct: 0,
      explanation: "Structures can contain different data types - that's their purpose."
    },
    {
      question: "What is structure padding?",
      options: ["Memory waste", "Memory alignment", "Data compression", "Error handling"],
      correct: 1,
      explanation: "Structure padding aligns members for efficient memory access."
    }
  ],

  "nested-structures": [
    {
      question: "Access nested structure member?",
      options: ["outer.inner.member", "outer->inner->member", "inner.outer.member", "member.inner.outer"],
      correct: 0,
      explanation: "Use multiple dot operators: outer.inner.member"
    },
    {
      question: "When to use nested structures?",
      options: ["Simple data", "Hierarchical data", "Single values", "Primitive types"],
      correct: 1,
      explanation: "Nested structures represent hierarchical or complex data relationships."
    },
    {
      question: "Can nested structures be initialized?",
      options: ["Yes", "No", "Only outer", "Only inner"],
      correct: 0,
      explanation: "Nested structures can be initialized with nested curly braces."
    }
  ],

  "array-of-structures": [
    {
      question: "Access title of first book in array?",
      options: ["books.title[0]", "books[0].title", "books[title][0]", "title.books[0]"],
      correct: 1,
      explanation: "books[0].title accesses title member of first structure in array."
    },
    {
      question: "What is array of structures useful for?",
      options: ["Single record", "Multiple records", "Memory saving", "Fast access"],
      correct: 1,
      explanation: "Arrays of structures store multiple related records efficiently."
    },
    {
      question: "How to initialize array of structures?",
      options: ["{val1, val2}", "{{val1, val2}, {val3, val4}}", "[val1, val2]", "val1, val2"],
      correct: 1,
      explanation: "Use nested braces: {{member1, member2}, {member1, member2}}"
    }
  ],

  "unions": [
    {
      question: "Union size equals?",
      options: ["Sum of all members", "Size of smallest member", "Size of largest member", "Fixed 4 bytes"],
      correct: 2,
      explanation: "Union size equals the size of its largest member."
    },
    {
      question: "How many union members can hold valid data simultaneously?",
      options: ["All", "One", "Half", "Depends on size"],
      correct: 1,
      explanation: "Only one member can hold valid data at a time in a union."
    },
    {
      question: "When to use unions?",
      options: ["Multiple data types", "Mutually exclusive data", "Large data", "Small data"],
      correct: 1,
      explanation: "Unions are used when data is mutually exclusive (only one type at a time)."
    }
  ],

  "file-basics": [
    {
      question: "What does fopen() return on failure?",
      options: ["0", "NULL", "-1", "EOF"],
      correct: 1,
      explanation: "fopen() returns NULL if file cannot be opened."
    },
    {
      question: "Which mode opens file for reading?",
      options: ["w", "a", "r", "x"],
      correct: 2,
      explanation: "r mode opens file for reading."
    },
    {
      question: "What should you always do after file operations?",
      options: ["Close file", "Delete file", "Rename file", "Copy file"],
      correct: 0,
      explanation: "Always fclose() files to free resources and flush buffers."
    }
  ],

  "file-read-write": [
    {
      question: "Function to read formatted data from file?",
      options: ["fread()", "fgets()", "fscanf()", "freadline()"],
      correct: 2,
      explanation: "fscanf() reads formatted data from file, like scanf() for files."
    },
    {
      question: "What does fgets() read?",
      options: ["Single character", "Whole file", "Line until newline", "Formatted data"],
      correct: 2,
      explanation: "fgets() reads a line from file until newline or specified length."
    },
    {
      question: "When does fgets() return NULL?",
      options: ["Success", "Error", "End of file", "Buffer full"],
      correct: 2,
      explanation: "fgets() returns NULL when it reaches end of file or encounters an error."
    }
  ],

  "dynamic-memory": [
    {
      question: "What does malloc() return on failure?",
      options: ["0", "NULL", "-1", "Garbage value"],
      correct: 1,
      explanation: "malloc() returns NULL if memory allocation fails."
    },
    {
      question: "What is the purpose of free()?",
      options: ["Allocate memory", "Deallocate memory", "Resize memory", "Clear memory"],
      correct: 1,
      explanation: "free() deallocates dynamically allocated memory."
    },
    {
      question: "What happens if you don't free() allocated memory?",
      options: ["Error", "Memory leak", "Program crash", "Nothing"],
      correct: 1,
      explanation: "Not freeing allocated memory causes memory leaks."
    }
  ],

  "bitwise-operators": [
    {
      question: "What does 5 & 3 equal?",
      options: ["8", "1", "7", "15"],
      correct: 1,
      explanation: "5 is 101, 3 is 011, 101 & 011 = 001 = 1"
    },
    {
      question: "What does << operator do?",
      options: ["Right shift", "Left shift", "Rotate", "Swap"],
      correct: 1,
      explanation: "<< is left shift operator, multiplies by 2 for each shift."
    },
    {
      question: "What is ~ (bitwise NOT) of 5?",
      options: ["-6", "-5", "10", "4"],
      correct: 0,
      explanation: "~5 inverts all bits, giving -6 in two's complement."
    }
  ],

  // HTML QUIZZES
  "html-basics": [
    {
      question: "What does <!DOCTYPE html> declare?",
      options: ["HTML version", "Document type", "Meta information", "Page title"],
      correct: 1,
      explanation: "<!DOCTYPE html> tells browser this is HTML5 document."
    },
    {
      question: "Which tag contains page title?",
      options: ["<head>", "<title>", "<body>", "<html>"],
      correct: 1,
      explanation: "<title> tag contains the page title shown in browser tab."
    },
    {
      question: "What goes in <body> tag?",
      options: ["Meta data", "Page title", "Visible content", "Scripts"],
      correct: 2,
      explanation: "<body> contains all visible content of the webpage."
    }
  ],

  "html-elements": [
    {
      question: "Which is a void element?",
      options: ["<div>", "<p>", "<img>", "<span>"],
      correct: 2,
      explanation: "<img> is a void element that doesn't need a closing tag."
    },
    {
      question: "Default display of <div>?",
      options: ["inline", "inline-block", "block", "flex"],
      correct: 2,
      explanation: "<div> has display: block by default."
    },
    {
      question: "Purpose of semantic elements?",
      options: ["Styling", "Accessibility", "Layout", "Animation"],
      correct: 1,
      explanation: "Semantic elements improve accessibility and SEO."
    }
  ],

  "html-links-images": [
    {
      question: "Purpose of alt attribute?",
      options: ["Styling", "Animation", "Accessibility", "Layout"],
      correct: 2,
      explanation: "alt provides alternative text for screen readers and when image fails to load."
    },
    {
      question: "Open link in new tab?",
      options: ["target='new'", "target='_blank'", "target='tab'", "newtab='true'"],
      correct: 1,
      explanation: "target='_blank' opens link in new tab/window."
    },
    {
      question: "Email link syntax?",
      options: ["href='email:'", "href='mailto:'", "href='send:'", "href='contact:'"],
      correct: 1,
      explanation: "href='mailto:email@example.com' creates email link."
    }
  ],

  "html-lists": [
    {
      question: "Which tag creates numbered list?",
      options: ["<ul>", "<ol>", "<dl>", "<li>"],
      correct: 1,
      explanation: "<ol> creates ordered (numbered) list."
    },
    {
      question: "Purpose of <dl> tag?",
      options: ["Numbered list", "Bulleted list", "Definition list", "Nested list"],
      correct: 2,
      explanation: "<dl> creates definition list with <dt> and <dd>."
    },
    {
      question: "Can lists be nested?",
      options: ["Yes", "No", "Only ordered", "Only unordered"],
      correct: 0,
      explanation: "Lists can be nested inside other lists."
    }
  ],

  "html-tables": [
    {
      question: "Purpose of colspan attribute?",
      options: ["Row span", "Column span", "Table width", "Cell height"],
      correct: 1,
      explanation: "colspan makes cell span across multiple columns."
    },
    {
      question: "Which tag contains header cells?",
      options: ["<td>", "<tr>", "<th>", "<table>"],
      correct: 2,
      explanation: "<th> creates header cells (bold, centered)."
    },
    {
      question: "Table data cells use?",
      options: ["<th>", "<tr>", "<td>", "<table>"],
      correct: 2,
      explanation: "<td> creates data cells in table."
    }
  ],

  "html-forms": [
    {
      question: "Which input type validates email?",
      options: ["text", "password", "email", "url"],
      correct: 2,
      explanation: "type='email' provides built-in email validation."
    },
    {
      question: "Make input required?",
      options: ["required='true'", "mandatory='yes'", "required", "validate='required'"],
      correct: 2,
      explanation: "required attribute makes field mandatory."
    },
    {
      question: "Multi-line text input?",
      options: ["<input>", "<textarea>", "<multiline>", "<text>"],
      correct: 1,
      explanation: "<textarea> creates multi-line text input."
    }
  ],

  // CSS QUIZZES
  "css-selectors": [
    {
      question: "Which has highest specificity?",
      options: ["Element selector", "Class selector", "ID selector", "Universal selector"],
      correct: 2,
      explanation: "ID selectors (#id) have highest specificity over classes (.) and elements."
    },
    {
      question: "Select element with class 'btn'?",
      options: ["#btn", ".btn", "btn", "*btn"],
      correct: 1,
      explanation: ".btn selects elements with class='btn'."
    },
    {
      question: "Select all p elements inside div?",
      options: ["div p", "div > p", "div + p", "p div"],
      correct: 0,
      explanation: "div p is descendant selector (p inside div)."
    }
  ],

  "css-box-model": [
    {
      question: "Box model order from inside to outside?",
      options: ["Margin, Border, Padding, Content", "Content, Padding, Border, Margin", "Border, Content, Margin, Padding", "Padding, Margin, Content, Border"],
      correct: 1,
      explanation: "Content (innermost) → Padding → Border → Margin (outermost)."
    },
    {
      question: "Width property sets?",
      options: ["Total width", "Content width", "Content + padding", "Content + padding + border"],
      correct: 1,
      explanation: "width sets content width only, not including padding/border/margin."
    },
    {
      question: "Space between content and border?",
      options: ["Margin", "Padding", "Border", "Content"],
      correct: 1,
      explanation: "Padding is the space between content and border."
    }
  ],

  "css-text-font": [
    {
      question: "Best unit for font-size?",
      options: ["px", "em", "rem", "pt"],
      correct: 2,
      explanation: "rem is relative to root font-size, good for responsive design."
    },
    {
      question: "Font-weight: bold equals?",
      options: ["100", "400", "700", "900"],
      correct: 2,
      explanation: "bold = 700, normal = 400."
    },
    {
      question: "Text alignment values?",
      options: ["left, center, right", "top, middle, bottom", "start, middle, end", "first, second, third"],
      correct: 0,
      explanation: "text-align: left, center, right, justify."
    }
  ],

  "css-colors-background": [
    {
      question: "RGBA stands for?",
      options: ["Red Green Blue Alpha", "Red Green Black Alpha", "Red Gray Blue Alpha", "Red Green Blue Angle"],
      correct: 0,
      explanation: "RGBA = Red, Green, Blue, Alpha (transparency)."
    },
    {
      question: "Create gradient background?",
      options: ["background-color", "background-image", "background-gradient", "background-pattern"],
      correct: 1,
      explanation: "Gradients use background-image property."
    },
    {
      question: "Transparent color syntax?",
      options: ["rgb(255,0,0,0.5)", "rgba(255,0,0,0.5)", "Both", "Neither"],
      correct: 1,
      explanation: "rgba() includes alpha channel for transparency."
    }
  ],

  "css-display": [
    {
      question: "Default display of <div>?",
      options: ["inline", "inline-block", "block", "flex"],
      correct: 2,
      explanation: "<div> has display: block by default."
    },
    {
      question: "Inline elements can have?",
      options: ["Width and height", "Only width", "Only height", "Neither"],
      correct: 3,
      explanation: "Inline elements ignore width and height properties."
    },
    {
      question: "Display: none does what?",
      options: ["Hides element", "Makes transparent", "Moves element", "Changes size"],
      correct: 0,
      explanation: "display: none removes element from layout completely."
    }
  ],

  "css-positioning": [
    {
      question: "Position relative to viewport?",
      options: ["static", "relative", "absolute", "fixed"],
      correct: 3,
      explanation: "position: fixed is relative to the viewport (browser window)."
    },
    {
      question: "Position: absolute needs?",
      options: ["Nothing", "Positioned ancestor", "Fixed parent", "Viewport"],
      correct: 1,
      explanation: "Absolute positioned elements need a positioned (non-static) ancestor."
    },
    {
      question: "Z-index controls?",
      options: ["Horizontal position", "Vertical position", "Stacking order", "Size"],
      correct: 2,
      explanation: "z-index controls the stacking order of positioned elements."
    }
  ],

  "css-flexbox": [
    {
      question: "justify-content aligns items along?",
      options: ["Cross axis", "Main axis", "Z axis", "Diagonal"],
      correct: 1,
      explanation: "justify-content aligns items along the main axis."
    },
    {
      question: "align-items aligns items along?",
      options: ["Main axis", "Cross axis", "Z axis", "Center"],
      correct: 1,
      explanation: "align-items aligns items along the cross axis."
    },
    {
      question: "Flex: 1 1 200px means?",
      options: ["Grow only", "Shrink only", "Grow, shrink, base 200px", "Fixed 200px"],
      correct: 2,
      explanation: "flex: grow shrink basis - can grow, shrink, minimum 200px."
    }
  ],

  // JAVASCRIPT QUIZZES
  "js-variables": [
    {
      question: "Which can be reassigned?",
      options: ["var", "let", "const", "None"],
      correct: 1,
      explanation: "let variables can be reassigned, const cannot, var can but shouldn't be used."
    },
    {
      question: "Variable hoisting occurs with?",
      options: ["var", "let", "const", "All"],
      correct: 0,
      explanation: "var variables are hoisted to function top, let/const are not."
    },
    {
      question: "Primitive types include?",
      options: ["object", "array", "string", "function"],
      correct: 2,
      explanation: "Primitive types: string, number, boolean, null, undefined."
    }
  ],

  "js-operators": [
    {
      question: "Difference between == and ===?",
      options: ["None", "=== checks type", "== checks type", "=== is faster"],
      correct: 1,
      explanation: "=== checks both value and type, == performs type coercion."
    },
    {
      question: "Exponentiation operator?",
      options: ["^", "**", "^^", "exp"],
      correct: 1,
      explanation: "** is exponentiation operator (ES6)."
    },
    {
      question: "Logical AND operator?",
      options: ["&", "&&", "and", "AND"],
      correct: 1,
      explanation: "&& is logical AND operator."
    }
  ],

  "js-conditionals": [
    {
      question: "What happens without break in switch?",
      options: ["Error", "Fall-through", "Default executes", "Nothing"],
      correct: 1,
      explanation: "Without break, execution continues to next case (fall-through)."
    },
    {
      question: "Truthy values include?",
      options: ["0", "\"\"", "null", "All except false"],
      correct: 3,
      explanation: "All values except false, 0, \"\", null, undefined, NaN are truthy."
    },
    {
      question: "Ternary operator syntax?",
      options: ["condition ? : value", "condition ? value : value", "condition : value ? value", "value ? condition : value"],
      correct: 1,
      explanation: "condition ? valueIfTrue : valueIfFalse"
    }
  ],

  "js-loops": [
    {
      question: "Which loop executes at least once?",
      options: ["for", "while", "do-while", "for-of"],
      correct: 2,
      explanation: "do-while executes body once before checking condition."
    },
    {
      question: "Iterate array elements?",
      options: ["for-in", "for-of", "for-each", "for-while"],
      correct: 1,
      explanation: "for-of iterates over array elements (ES6)."
    },
    {
      question: "Iterate object properties?",
      options: ["for-of", "for-in", "for-each", "for-while"],
      correct: 1,
      explanation: "for-in iterates over object property names."
    }
  ],

  "js-functions": [
    {
      question: "Arrow function syntax?",
      options: ["function() {}", "() => {}", "function => {}", "=> function() {}"],
      correct: 1,
      explanation: "(parameters) => expression or (parameters) => { statements }"
    },
    {
      question: "Function declarations are?",
      options: ["Not hoisted", "Hoisted", "Block scoped", "Arrow only"],
      correct: 1,
      explanation: "Function declarations are hoisted, can be called before definition."
    },
    {
      question: "Default parameter syntax?",
      options: ["function f(a = 1)", "function f(a: 1)", "function f(a == 1)", "function f(a ? 1)"],
      correct: 0,
      explanation: "function f(param = defaultValue) sets default parameter value."
    }
  ],

  "js-dom": [
    {
      question: "Select all buttons with class 'btn'?",
      options: ["getElementById('btn')", "querySelector('.btn')", "querySelectorAll('.btn')", "getElementsByClassName('btn')"],
      correct: 2,
      explanation: "querySelectorAll('.btn') returns all elements with class 'btn'."
    },
    {
      question: "Change element text content?",
      options: ["innerHTML", "textContent", "Both", "Neither"],
      correct: 1,
      explanation: "textContent changes text safely, innerHTML can execute scripts."
    },
    {
      question: "Create new element?",
      options: ["createElement", "new Element", "makeElement", "buildElement"],
      correct: 0,
      explanation: "document.createElement('tagName') creates new element."
    }
  ],

  "js-events": [
    {
      question: "Prevent default form submission?",
      options: ["stopPropagation()", "preventDefault()", "stopImmediatePropagation()", "cancelBubble()"],
      correct: 1,
      explanation: "event.preventDefault() stops the browser's default action."
    },
    {
      question: "Add event listener syntax?",
      options: ["element.event = function", "element.addEventListener(type, function)", "Both", "Neither"],
      correct: 1,
      explanation: "addEventListener(type, function) is the modern way to add events."
    },
    {
      question: "Event bubbling direction?",
      options: ["Parent to child", "Child to parent", "Random", "No direction"],
      correct: 1,
      explanation: "Event bubbling propagates from target element up to parent elements."
    }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QUIZ_DB;
}