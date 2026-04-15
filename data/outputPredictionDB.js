// outputPredictionDB.js - KTU-style Output Prediction Questions

const outputPredictionDB = [
  // LOOPS - Basic For Loops
  {
    id: "loop-basic-1",
    topic: "loops",
    difficulty: "easy",
    code: `for(int i = 1; i <= 3; i++) {
    printf("%d", i);
}`,
    answer: "123",
    explanation: "The for loop starts at i=1 and prints i for each iteration: 1, 2, 3. No spaces or newlines.",
    hint: "Check the printf format - it prints the value directly without any separator."
  },
  {
    id: "loop-basic-2",
    topic: "loops",
    difficulty: "easy",
    code: `for(int i = 0; i < 4; i++) {
    printf("%d ", i);
}`,
    answer: "0 1 2 3 ",
    explanation: "Loop runs for i = 0,1,2,3. Each number followed by a space. Final space is included.",
    hint: "Note the space after %d in the format string."
  },
  {
    id: "loop-basic-3",
    topic: "loops",
    difficulty: "easy",
    code: `for(int i = 5; i >= 1; i -= 2) {
    printf("%d", i);
}`,
    answer: "531",
    explanation: "Loop starts at 5, decrements by 2 each time: 5, 3, 1. Stops when i becomes -1.",
    hint: "Check the decrement: i -= 2 means i = i - 2"
  },

  // LOOPS - While Loops
  {
    id: "loop-while-1",
    topic: "loops",
    difficulty: "easy",
    code: `int i = 1;
while(i < 4) {
    printf("%d", i);
    i++;
}`,
    answer: "123",
    explanation: "While loop prints 1, 2, 3 and stops when i becomes 4 (condition fails).",
    hint: "Remember: condition is checked BEFORE each iteration."
  },
  {
    id: "loop-while-2",
    topic: "loops",
    difficulty: "medium",
    code: `int i = 5;
while(i > 2) {
    printf("%d ", i);
    i -= 2;
}`,
    answer: "5 3 ",
    explanation: "Starts at 5, prints 5 3, then i becomes 1 which fails condition > 2.",
    hint: "Trace each iteration: 5>2 (print), 3>2 (print), 1>2 (stop)"
  },

  // LOOPS - Nested Loops
  {
    id: "loop-nested-1",
    topic: "loops",
    difficulty: "medium",
    code: `for(int i = 1; i <= 2; i++) {
    for(int j = 1; j <= 2; j++) {
        printf("%d%d ", i, j);
    }
}`,
    answer: "11 12 21 22 ",
    explanation: "Outer loop i=1: prints 11 12. Then i=2: prints 21 22. Each pair separated by space.",
    hint: "Inner loop completes all iterations for each outer iteration."
  },
  {
    id: "loop-nested-2",
    topic: "loops",
    difficulty: "medium",
    code: `for(int i = 1; i <= 3; i++) {
    for(int j = i; j <= 3; j++) {
        printf("*");
    }
    printf("\\n");
}`,
    answer: "***\n**\n*\n",
    explanation: "i=1 prints 3 stars, i=2 prints 2 stars, i=3 prints 1 star, each followed by newline.",
    hint: "Inner loop runs from i to 3, outer loop controls newlines."
  },

  // CONDITIONALS - If-Else
  {
    id: "cond-if-1",
    topic: "conditionals",
    difficulty: "easy",
    code: `int x = 7;
if(x > 5)
    printf("A");
else
    printf("B");
if(x == 7)
    printf("C");`,
    answer: "AC",
    explanation: "First if: 7 > 5 is true, prints 'A'. Second if: 7 == 7 is true, prints 'C'.",
    hint: "Each if-else is independent. Don't forget the second if after the else block."
  },
  {
    id: "cond-if-2",
    topic: "conditionals",
    difficulty: "easy",
    code: `int a = 10, b = 20;
if(a > b)
    printf("X");
if(a < b)
    printf("Y");
else
    printf("Z");`,
    answer: "YZ",
    explanation: "First if: 10 > 20 false, nothing prints. Second if: 10 < 20 true prints Y, else prints Z.",
    hint: "The else belongs to the SECOND if, not the first."
  },
  {
    id: "cond-if-3",
    topic: "conditionals",
    difficulty: "medium",
    code: `int x = 5;
if(x = 10)
    printf("A");
printf("%d", x);`,
    answer: "A10",
    explanation: "x = 10 is an assignment, returns 10 (non-zero = true), prints 'A'. Then x is 10.",
    hint: "Watch out! = is assignment, == is comparison. Assignment returns the assigned value."
  },

  // CONDITIONALS - Switch
  {
    id: "cond-switch-1",
    topic: "conditionals",
    difficulty: "easy",
    code: `int x = 2;
switch(x) {
    case 1: printf("One "); break;
    case 2: printf("Two ");
    case 3: printf("Three"); break;
    default: printf("Other");
}`,
    answer: "TwoThree",
    explanation: "Case 2 matches and prints 'Two '. No break, so it falls through to case 3 and prints 'Three'.",
    hint: "Missing break causes fall-through to next case."
  },
  {
    id: "cond-switch-2",
    topic: "conditionals",
    difficulty: "medium",
    code: `int x = 5;
switch(x) {
    case 1:
    case 2: printf("A"); break;
    case 3: printf("B"); break;
    default: printf("C");
}`,
    answer: "C",
    explanation: "x=5 doesn't match any case (1,2,3), so default executes printing 'C'.",
    hint: "Empty cases (case 1: case 2:) fall through to the next non-empty case."
  },

  // POINTERS - Basic
  {
    id: "pointer-basic-1",
    topic: "pointers",
    difficulty: "easy",
    code: `int x = 10;
int *p = &x;
printf("%d", *p);`,
    answer: "10",
    explanation: "p stores address of x. *p dereferences to get value at that address: 10.",
    hint: "& gives address, * dereferences pointer."
  },
  {
    id: "pointer-basic-2",
    topic: "pointers",
    difficulty: "easy",
    code: `int a = 5, b = 10;
int *ptr = &a;
printf("%d", *ptr);
ptr = &b;
printf("%d", *ptr);`,
    answer: "510",
    explanation: "ptr first points to a (5), then changes to point to b (10). Both values printed.",
    hint: "Pointer can be reassigned to point to different variables."
  },
  {
    id: "pointer-basic-3",
    topic: "pointers",
    difficulty: "medium",
    code: `int x = 25;
int *p = &x;
printf("%d", x);
*x = 30;
printf("%d", x);`,
    answer: "2530",
    explanation: "Initially x=25 prints 25. Then *p=30 modifies x through pointer. x becomes 30.",
    hint: "Changing *p changes the original variable since it points to its memory."
  },
  {
    id: "pointer-basic-4",
    topic: "pointers",
    difficulty: "medium",
    code: `int arr[3] = {10, 20, 30};
int *p = arr;
printf("%d", *p);
printf("%d", *(p+1));
printf("%d", *p+2);`,
    answer: "102030",
    explanation: "arr decays to pointer to first element. *p = 10, *(p+1) = 20, *p+2 = 10+2 = 12.",
    hint: "arr points to first element. *(p+1) is second element. *p+2 adds 2 to value."
  },

  // POINTERS - Pointer Arithmetic
  {
    id: "pointer-arith-1",
    topic: "pointers",
    difficulty: "medium",
    code: `int arr[4] = {5, 10, 15, 20};
int *p = arr + 2;
printf("%d", *p);
printf("%d", *(p-1));`,
    answer: "1510",
    explanation: "arr+2 points to arr[2]=15. *p prints 15. *(p-1) = arr[1] = 10.",
    hint: "Pointer arithmetic works in units of sizeof(element)."
  },
  {
    id: "pointer-arith-2",
    topic: "pointers",
    difficulty: "hard",
    code: `char str[] = "ABC";
char *p = str;
while(*p) {
    printf("%c", *p);
    p++;
}`,
    answer: "ABC",
    explanation: "p points to 'A'. Loop prints A, B, C. Then *p = '\\0' (null), loop exits.",
    hint: "Strings end with null character '\\0' which evaluates to false."
  },

  // ARRAYS - Basic
  {
    id: "array-basic-1",
    topic: "arrays",
    difficulty: "easy",
    code: `int arr[5] = {1, 2, 3};
printf("%d", arr[0]);
printf("%d", arr[4]);`,
    answer: "10",
    explanation: "arr[0] = 1, arr[4] = 0 (uninitialized elements default to 0).",
    hint: "Uninitialized array elements are initialized to 0 in C."
  },
  {
    id: "array-basic-2",
    topic: "arrays",
    difficulty: "easy",
    code: `int a[3] = {10, 20, 30};
printf("%d", a[0] + a[2]);`,
    answer: "40",
    explanation: "a[0] = 10, a[2] = 30, sum = 40.",
    hint: "Array elements can be used in expressions."
  },
  {
    id: "array-basic-3",
    topic: "arrays",
    difficulty: "medium",
    code: `int arr[4] = {5, 10, 15, 20};
for(int i = 1; i < 4; i++) {
    printf("%d ", arr[i] - arr[i-1]);
}`,
    answer: "5 5 5 ",
    explanation: "arr[1]-arr[0]=10-5=5, arr[2]-arr[1]=15-10=5, arr[3]-arr[2]=20-15=5.",
    hint: "Each iteration calculates difference between consecutive elements."
  },

  // ARRAYS - 2D Arrays
  {
    id: "array-2d-1",
    topic: "arrays",
    difficulty: "medium",
    code: `int mat[2][2] = {{1,2}, {3,4}};
printf("%d", mat[0][1]);
printf("%d", mat[1][0]);`,
    answer: "23",
    explanation: "mat[0][1] = 2 (row 0, col 1), mat[1][0] = 3 (row 1, col 0).",
    hint: "First index is row, second is column."
  },
  {
    id: "array-2d-2",
    topic: "arrays",
    difficulty: "hard",
    code: `int mat[3][3] = {1,2,3,4,5,6,7,8,9};
printf("%d", mat[1][1]);`,
    answer: "5",
    explanation: "Linear initialization fills row by row. mat[1][1] is the center element = 5.",
    hint: "2D arrays are stored in row-major order."
  },

  // RECURSION - Basic
  {
    id: "recursion-basic-1",
    topic: "recursion",
    difficulty: "easy",
    code: `int fact(int n) {
    if(n <= 1) return 1;
    return n * fact(n-1);
}
printf("%d", fact(3));`,
    answer: "6",
    explanation: "fact(3) = 3 * fact(2) = 3 * 2 * fact(1) = 3 * 2 * 1 = 6.",
    hint: "Each call multiplies n by factorial of (n-1)."
  },
  {
    id: "recursion-basic-2",
    topic: "recursion",
    difficulty: "easy",
    code: `int sum(int n) {
    if(n == 0) return 0;
    return n + sum(n-1);
}
printf("%d", sum(4));`,
    answer: "10",
    explanation: "4 + 3 + 2 + 1 + 0 = 10. Sum of first n natural numbers.",
    hint: "Base case is n=0 returning 0."
  },
  {
    id: "recursion-basic-3",
    topic: "recursion",
    difficulty: "medium",
    code: `void show(int n) {
    if(n > 0) {
        printf("%d ", n);
        show(n-1);
    }
}
show(3);`,
    answer: "3 2 1 ",
    explanation: "Prints n then calls with n-1. Prints 3, then 2, then 1.",
    hint: "Printing happens BEFORE recursive call."
  },
  {
    id: "recursion-basic-4",
    topic: "recursion",
    difficulty: "medium",
    code: `void show(int n) {
    if(n > 0) {
        show(n-1);
        printf("%d ", n);
    }
}
show(3);`,
    answer: "1 2 3 ",
    explanation: "Recursive call happens first, printing in reverse order as calls unwind.",
    hint: "Printing happens AFTER recursive call returns (post-order)."
  },
  {
    id: "recursion-basic-5",
    topic: "recursion",
    difficulty: "medium",
    code: `int fib(int n) {
    if(n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
printf("%d", fib(5));`,
    answer: "5",
    explanation: "Fibonacci: 0,1,1,2,3,5,8... fib(5) = 5.",
    hint: "Each fib(n) = fib(n-1) + fib(n-2)"
  },

  // RECURSION - With Parameters
  {
    id: "recursion-params-1",
    topic: "recursion",
    difficulty: "medium",
    code: `int power(int base, int exp) {
    if(exp == 0) return 1;
    return base * power(base, exp-1);
}
printf("%d", power(2, 4));`,
    answer: "16",
    explanation: "2^4 = 2 * 2 * 2 * 2 = 16.",
    hint: "Multiply base by power with decremented exponent."
  },
  {
    id: "recursion-params-2",
    topic: "recursion",
    difficulty: "hard",
    code: `int count(int arr[], int n) {
    if(n == 0) return 0;
    return 1 + count(arr, n-1);
}
int a[] = {1,2,3,4,5};
printf("%d", count(a, 5));`,
    answer: "5",
    explanation: "Recursively counts elements. 1 + 1 + 1 + 1 + 1 = 5.",
    hint: "Base case: empty array returns 0."
  },

  // FUNCTIONS - Parameter Passing
  {
    id: "func-pass-1",
    topic: "functions",
    difficulty: "medium",
    code: `void modify(int x) {
    x = 20;
}
int main() {
    int a = 10;
    modify(a);
    printf("%d", a);
}`,
    answer: "10",
    explanation: "Pass by value - x is a copy. Original a remains 10.",
    hint: "Changes to parameter don't affect original variable."
  },
  {
    id: "func-pass-2",
    topic: "functions",
    difficulty: "medium",
    code: `void modify(int *p) {
    *p = 20;
}
int main() {
    int a = 10;
    modify(&a);
    printf("%d", a);
}`,
    answer: "20",
    explanation: "Pass by reference (pointer). *p modifies a directly.",
    hint: "Pointer allows modifying the original variable."
  },
  {
    id: "func-pass-3",
    topic: "functions",
    difficulty: "hard",
    code: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
int main() {
    int x = 5, y = 10;
    swap(&x, &y);
    printf("%d %d", x, y);
}`,
    answer: "10 5",
    explanation: "swap exchanges values through pointers. x becomes 10, y becomes 5.",
    hint: "Pointers allow function to modify multiple values."
  },

  // STRINGS
  {
    id: "string-basic-1",
    topic: "strings",
    difficulty: "easy",
    code: `char s[] = "KTU";
printf("%c", s[1]);`,
    answer: "T",
    explanation: "s[0]='K', s[1]='T', s[2]='U'.",
    hint: "String indexing starts at 0."
  },
  {
    id: "string-basic-2",
    topic: "strings",
    difficulty: "easy",
    code: `char s[] = "CODE";
printf("%lu", strlen(s));`,
    answer: "4",
    explanation: "strlen returns number of characters before null terminator.",
    hint: "Null terminator '\\0' is not counted."
  },
  {
    id: "string-basic-3",
    topic: "strings",
    difficulty: "medium",
    code: `char s1[] = "Hello";
char s2[] = "World";
printf("%d", strcmp(s1, s2));`,
    answer: "-1",
    explanation: "strcmp returns negative when first string < second (H < W in ASCII).",
    hint: "Compares character by character using ASCII values."
  },

  // STRUCTURES
  {
    id: "struct-basic-1",
    topic: "structures",
    difficulty: "medium",
    code: `struct Student {
    int marks;
    char grade;
};
struct Student s = {85, 'A'};
printf("%d %c", s.marks, s.grade);`,
    answer: "85 A",
    explanation: "Structure members accessed using dot operator.",
    hint: "Structure is a composite data type."
  },
  {
    id: "struct-basic-2",
    topic: "structures",
    difficulty: "medium",
    code: `struct Point {
    int x, y;
};
struct Point p1 = {10, 20};
struct Point *ptr = &p1;
printf("%d", ptr->x);`,
    answer: "10",
    explanation: "Arrow operator (->) accesses structure members through pointer.",
    hint: "ptr->x is equivalent to (*ptr).x"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { outputPredictionDB };
}