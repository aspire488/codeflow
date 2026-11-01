// Regression tests for the syntax highlighter. The original implementation
// chained replace() calls over HTML it had already generated, so attribute
// text leaked into code blocks and `<` was swallowed. These tests pin the
// correct behaviour down.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(
  readFileSync(path.resolve(__dirname, '..', 'src/core/syntaxHighlighter.js'), 'utf8'),
  sandbox
);

const highlight = sandbox.highlightCode;

test('highlighting never nests markup inside generated attributes', () => {
  const languages = {
    c: '#include <stdio.h>\nint main() { printf("hi %d", 42); return 0; }',
    javascript: 'const total = 1; // note\nconsole.log("a < b");',
    html: '<div class="card">text</div>',
    css: 'body { color: #fff; margin: 0 auto; }'
  };

  Object.entries(languages).forEach(([language, code]) => {
    const output = highlight(code, language);
    assert.doesNotMatch(output, /<span class=</, `${language} produced nested spans`);
    assert.doesNotMatch(output, /class="text-\[/, `${language} leaked Tailwind class text`);
    assert.doesNotMatch(output, /<span class="tok-[a-z]+"[^>]*<span/, `${language} nested spans`);
  });
});

test('angle brackets are escaped, never dropped', () => {
  const output = highlight('#include <stdio.h>', 'c');
  assert.match(output, /&lt;stdio\.h&gt;/);
  assert.doesNotMatch(output, /<stdio\.h>/);
  assert.match(output, /class="tok-pre"/);
});

test('C keywords, strings, numbers and comments get distinct token classes', () => {
  const output = highlight('int x = 5; // five\nprintf("%d", x);', 'c');
  assert.match(output, /class="tok-kw">int</);
  assert.match(output, /class="tok-num">5</);
  assert.match(output, /class="tok-com">\/\/ five</);
  assert.match(output, /class="tok-fn">printf</);
  assert.match(output, /class="tok-str">/);
});

test('HTML tags and attributes are highlighted without touching text content', () => {
  const output = highlight('<a href="/x">link</a>', 'html');
  assert.match(output, /class="tok-tag">a</);
  assert.match(output, /class="tok-attr">href</);
  assert.match(output, /link/);
  assert.doesNotMatch(output, /class="tok-tag">link/);
});

test('CSS properties and values are distinguished', () => {
  const output = highlight('.card { color: red; padding: 12px; }', 'css');
  assert.match(output, /class="tok-prop">color</);
  assert.match(output, /class="tok-prop">padding</);
  assert.match(output, /class="tok-num">12px</);
});

test('JavaScript strings survive quotes and template syntax', () => {
  const output = highlight('const name = "Ada";\nconst msg = `hi ${name}`;', 'javascript');
  assert.match(output, /class="tok-kw">const</);
  assert.match(output, /Ada/);
  assert.match(output, /hi/);
  assert.doesNotMatch(output, /<span class=</);
});

test('highlighting is pure: empty input is empty and source is not mutated', () => {
  assert.equal(highlight('', 'c'), '');
  assert.equal(highlight(null, 'c'), '');
  const source = 'int main() {}';
  highlight(source, 'c');
  assert.equal(source, 'int main() {}');
});
