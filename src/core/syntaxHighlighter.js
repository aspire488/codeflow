// ============================================
// SYNTAX HIGHLIGHTER
//
// Scans source text once, escapes every plain chunk, then wraps tokens in
// spans. It never replaces over markup it has already produced - that bug
// corrupted generated attributes into visible text.
// ============================================

const CF_C_KEYWORDS = /^(?:auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|NULL|true|false)$/;
const CF_C_FUNCTIONS = /^(?:printf|scanf|fprintf|sprintf|fgets|fopen|fclose|malloc|calloc|realloc|free|strlen|strcpy|strcmp|strcat|memcpy|memset|puts|getchar)$/;
const CF_JS_KEYWORDS = /^(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|of|return|super|switch|this|throw|try|typeof|var|void|while|yield|true|false|null|undefined|NaN)$/;
const CF_JS_BUILTINS = /^(?:console|document|window|Math|JSON|Array|Object|String|Number|Promise|setTimeout|setInterval|parseInt|parseFloat|isNaN|alert|fetch|localStorage)$/;

function cfEscape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cfWrap(kind, text) {
  return '<span class="tok-' + kind + '">' + cfEscape(text) + '</span>';
}

function cfPlain(text) {
  return cfEscape(text);
}

function cfScanC(code) {
  const pattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#[^\n]*)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)/gm;
  let out = '';
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    out += cfPlain(code.slice(last, match.index));
    if (match[1]) {
      out += cfWrap('com', match[1]);
    } else if (match[2]) {
      out += cfWrap('str', match[2]);
    } else if (match[3]) {
      const directive = match[3].match(/^([ \t]*)(#\w+)(.*)$/);
      if (directive) {
        out += cfPlain(directive[1]) + cfWrap('pre', directive[2]) + cfWrap('str', directive[3]);
      } else {
        out += cfWrap('pre', match[3]);
      }
    } else if (match[4]) {
      out += cfWrap('num', match[4]);
    } else if (match[5]) {
      const word = match[5];
      if (CF_C_KEYWORDS.test(word)) out += cfWrap('kw', word);
      else if (CF_C_FUNCTIONS.test(word)) out += cfWrap('fn', word);
      else out += cfPlain(word);
    }
    last = match.index + match[0].length;
  }

  return out + cfPlain(code.slice(last));
}

function cfScanJS(code) {
  const pattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)/g;
  let out = '';
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    out += cfPlain(code.slice(last, match.index));
    if (match[1]) {
      out += cfWrap('com', match[1]);
    } else if (match[2]) {
      out += cfWrap('str', match[2]);
    } else if (match[3]) {
      out += cfWrap('num', match[3]);
    } else if (match[4]) {
      const word = match[4];
      if (CF_JS_KEYWORDS.test(word)) out += cfWrap('kw', word);
      else if (CF_JS_BUILTINS.test(word)) out += cfWrap('fn', word);
      else out += cfPlain(word);
    }
    last = match.index + match[0].length;
  }

  return out + cfPlain(code.slice(last));
}

function cfScanHTML(code) {
  const pattern = /(<!--[\s\S]*?-->)|(<\/?)([a-zA-Z][\w:-]*)([^<>]*)>/g;
  let out = '';
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    out += cfPlain(code.slice(last, match.index));
    if (match[1]) {
      out += cfWrap('com', match[1]);
    } else {
      out += cfPlain(match[2]) + cfWrap('tag', match[3]);
      const attrs = match[4] || '';
      const attrPattern = /(\s+)([\w:-]+)(=)("[^"]*"|'[^']*'|[^\s"'>]+)?/g;
      let attrLast = 0;
      let attrMatch;
      while ((attrMatch = attrPattern.exec(attrs)) !== null) {
        out += cfPlain(attrs.slice(attrLast, attrMatch.index));
        out += cfPlain(attrMatch[1]) + cfWrap('attr', attrMatch[2]);
        if (attrMatch[3]) out += cfPlain(attrMatch[3]);
        if (attrMatch[4]) out += cfWrap('str', attrMatch[4]);
        attrLast = attrMatch.index + attrMatch[0].length;
      }
      out += cfPlain(attrs.slice(attrLast)) + cfPlain('>');
    }
    last = match.index + match[0].length;
  }

  return out + cfPlain(code.slice(last));
}

function cfScanCSS(code) {
  const pattern = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|\b(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|fr|deg)?)\b|([a-zA-Z-]+)(?=\s*:)/g;
  let out = '';
  let last = 0;
  let match;

  while ((match = pattern.exec(code)) !== null) {
    out += cfPlain(code.slice(last, match.index));
    if (match[1]) out += cfWrap('com', match[1]);
    else if (match[2]) out += cfWrap('str', match[2]);
    else if (match[3]) out += cfWrap('kw', match[3]);
    else if (match[4]) out += cfWrap('num', match[4]);
    else if (match[5]) out += cfWrap('num', match[5]);
    else if (match[6]) out += cfWrap('prop', match[6]);
    last = match.index + match[0].length;
  }

  return out + cfPlain(code.slice(last));
}

function highlightCode(code, language) {
  const source = String(code == null ? '' : code);
  if (!source) return '';

  switch (language) {
    case 'javascript':
    case 'js':
      return cfScanJS(source);
    case 'html':
      return cfScanHTML(source);
    case 'css':
      return cfScanCSS(source);
    case 'c':
    case 'cpp':
    default:
      return cfScanC(source);
  }
}
