// logicQuestDB.js - Logic Quest Game Levels

const LOGIC_QUEST_LEVELS = [
  {
    id: 'loops-1',
    name: 'Loop Starter',
    topic: 'loops',
    difficulty: 'easy',
    xp: 10,
    code: `for(int i = 0; i < 3; i++) {
    printf("*");
}`,
    question: 'What will be the output?',
    options: ['***', '* * *', '*** ', '*'],
    correct: 0,
    hint: 'The loop runs 3 times, printing * each time with no space.',
    explanation: 'The for loop executes 3 times (i=0,1,2), printing * each iteration.'
  },
  {
    id: 'loops-2',
    name: 'While Loop',
    topic: 'loops',
    difficulty: 'easy',
    xp: 10,
    code: `int i = 0;
while(i < 2) {
    printf("%d", i);
    i++;
}`,
    question: 'What is the output?',
    options: ['01', '0 1 ', '0,1', '12'],
    correct: 0,
    hint: 'i starts at 0 and increments until it reaches 2.',
    explanation: 'i takes values 0 and 1, printed consecutively as "01".'
  },
  {
    id: 'conditionals-1',
    name: 'If Basics',
    topic: 'conditionals',
    difficulty: 'easy',
    xp: 15,
    code: `int x = 5;
if(x > 3)
    printf("A");
else
    printf("B");
printf("C");`,
    question: 'What is the output?',
    options: ['AC', 'BC', 'ABC', 'A'],
    correct: 0,
    hint: 'Check both the if-else and the final printf.',
    explanation: '5 > 3 is true, so "A" prints. Then "C" prints unconditionally.'
  },
  {
    id: 'arrays-1',
    name: 'Array Index',
    topic: 'arrays',
    difficulty: 'medium',
    xp: 20,
    code: `int arr[3] = {10, 20, 30};
printf("%d", arr[1]);`,
    question: 'What is the output?',
    options: ['10', '20', '30', '0'],
    correct: 1,
    hint: 'Array indexing starts at 0.',
    explanation: 'arr[0]=10, arr[1]=20, arr[2]=30. So arr[1] prints 20.'
  },
  {
    id: 'pointers-1',
    name: 'Pointer Basics',
    topic: 'pointers',
    difficulty: 'medium',
    xp: 20,
    code: `int x = 42;
int *p = &x;
printf("%d", *p);`,
    question: 'What is the output?',
    options: ['42', '&x', 'address', '0'],
    correct: 0,
    hint: '*p dereferences the pointer to get the value at that address.',
    explanation: 'p holds address of x, *p gets the value 42 from that address.'
  },
  {
    id: 'recursion-1',
    name: 'Recursion Starter',
    topic: 'recursion',
    difficulty: 'hard',
    xp: 30,
    code: `int fact(int n) {
    if(n <= 1) return 1;
    return n * fact(n-1);
}
printf("%d", fact(3));`,
    question: 'What is the output?',
    options: ['3', '6', '9', '1'],
    correct: 1,
    hint: 'fact(3) = 3 * fact(2) = 3 * 2 * fact(1)',
    explanation: 'fact(3) = 3*2*1 = 6'
  },
  {
    id: 'nested-loops-1',
    name: 'Nested Loops',
    topic: 'loops',
    difficulty: 'medium',
    xp: 25,
    code: `for(int i=0; i<2; i++) {
    for(int j=0; j<2; j++) {
        printf("%d%d ", i, j);
    }
}`,
    question: 'What is the output?',
    options: ['00 01 10 11 ', '0 1 2 3 ', '11 12 21 22 ', '0 0 1 1 '],
    correct: 0,
    hint: 'Outer loop i=0: prints 00 01. Then i=1: prints 10 11.',
    explanation: 'Nested loops print all combinations of i and j values.'
  },
  {
    id: 'switch-1',
    name: 'Switch Case',
    topic: 'conditionals',
    difficulty: 'medium',
    xp: 20,
    code: `int x = 2;
switch(x) {
    case 1: printf("One"); break;
    case 2: printf("Two");
    case 3: printf("Three"); break;
    default: printf("Other");
}`,
    question: 'What is the output?',
    options: ['Two', 'TwoThree', 'One', 'Other'],
    correct: 1,
    hint: 'Missing break causes fall-through to next case.',
    explanation: 'Case 2 matches and prints "Two", then falls through to case 3.'
  },
  {
    id: 'string-1',
    name: 'String Length',
    topic: 'strings',
    difficulty: 'easy',
    xp: 15,
    code: `char s[] = "CODE";
printf("%d", strlen(s));`,
    question: 'What is the output?',
    options: ['3', '4', '5', '0'],
    correct: 1,
    hint: 'strlen counts characters before null terminator.',
    explanation: '"CODE" has 4 characters, null terminator not counted.'
  },
  {
    id: 'pointer-arith-1',
    name: 'Pointer Arithmetic',
    topic: 'pointers',
    difficulty: 'hard',
    xp: 30,
    code: `int arr[] = {10, 20, 30};
int *p = arr;
printf("%d", *(p+2));`,
    question: 'What is the output?',
    options: ['10', '20', '30', '40'],
    correct: 2,
    hint: 'p+2 moves 2 integers past the start of the array.',
    explanation: '*(p+2) accesses arr[2] which is 30.'
  },
  {
    id: 'boss-recursion',
    name: 'Recursion Boss',
    topic: 'recursion',
    difficulty: 'boss',
    xp: 50,
    code: `int fib(int n) {
    if(n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
printf("%d", fib(5));`,
    question: 'What is the output? (Boss Challenge)',
    options: ['3', '5', '8', '13'],
    correct: 1,
    hint: 'Fibonacci: 0,1,1,2,3,5,8,13...',
    explanation: 'fib(5) = fib(4)+fib(3) = 3+2 = 5'
  },
  {
    id: 'boss-pointer',
    name: 'Pointer Boss',
    topic: 'pointers',
    difficulty: 'boss',
    xp: 50,
    code: `int a = 5, b = 10;
int *arr[2] = {&a, &b};
printf("%d", *arr[0] + *arr[1]);`,
    question: 'What is the output? (Boss Challenge)',
    options: ['5', '10', '15', '510'],
    correct: 2,
    hint: 'arr[0] points to a, arr[1] points to b',
    explanation: '*arr[0]=5, *arr[1]=10, sum = 15'
  }
];

const LOGIC_QUEST_MAP = [
  { id: 'loops-1', x: 10, y: 80, requires: null },
  { id: 'loops-2', x: 30, y: 60, requires: 'loops-1' },
  { id: 'conditionals-1', x: 50, y: 80, requires: 'loops-2' },
  { id: 'arrays-1', x: 70, y: 60, requires: 'conditionals-1' },
  { id: 'pointers-1', x: 30, y: 30, requires: 'arrays-1' },
  { id: 'nested-loops-1', x: 50, y: 40, requires: 'pointers-1' },
  { id: 'switch-1', x: 70, y: 30, requires: 'nested-loops-1' },
  { id: 'string-1', x: 90, y: 50, requires: 'switch-1' },
  { id: 'recursion-1', x: 50, y: 10, requires: 'string-1' },
  { id: 'pointer-arith-1', x: 70, y: 15, requires: 'recursion-1' },
  { id: 'boss-recursion', x: 90, y: 10, requires: 'pointer-arith-1' },
  { id: 'boss-pointer', x: 90, y: 30, requires: 'boss-recursion' }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOGIC_QUEST_LEVELS, LOGIC_QUEST_MAP };
}