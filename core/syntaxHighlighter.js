// ============================================
// SYNTAX HIGHLIGHTER - Code Rendering Fix
// ============================================

function highlightCode(code, language = 'c') {
    if (!code) return '';

    let highlighted = code;

    // C/C++ highlighting
    if (language === 'c' || language === 'cpp') {
        highlighted = highlighted
            // Preprocessor directives
            .replace(/#include/g, '<span class="text-[#8b949e]">#include</span>')
            .replace(/#define/g, '<span class="text-[#8b949e]">#define</span>')
            .replace(/#ifndef/g, '<span class="text-[#8b949e]">#ifndef</span>')
            .replace(/#endif/g, '<span class="text-[#8b949e]">#endif</span>')
            // Keywords
            .replace(/\b(int|void|char|float|double|if|else|for|while|do|return|break|continue|switch|case|default|struct|typedef|const|static|extern|sizeof)\b/g, '<span class="text-[#d73a49]">$1</span>')
            // Types
            .replace(/\b(printf|scanf|malloc|free|strlen|strcpy)\b/g, '<span class="text-[#6f42c1]">$1</span>')
            // Strings
            .replace(/"([^"]*)"/g, '<span class="text-[#032f62]">"$1"</span>')
            // Comments
            .replace(/\/\/(.*)/g, '<span class="text-[#6a737d]">//$1</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-[#6a737d]">$&</span>')
            // Numbers
            .replace(/\b\d+\b/g, '<span class="text-[#005cc5]">$&</span>');
    }

    // JavaScript highlighting
    else if (language === 'javascript') {
        highlighted = highlighted
            // Keywords
            .replace(/\b(function|var|let|const|if|else|for|while|do|return|break|continue|switch|case|default|class|extends|import|export|from|try|catch|finally|throw|new|this|super)\b/g, '<span class="text-[#d73a49]">$1</span>')
            // Functions
            .replace(/\b(console\.log|alert|prompt|parseInt|parseFloat|isNaN|setTimeout|setInterval)\b/g, '<span class="text-[#6f42c1]">$1</span>')
            // Strings
            .replace(/("([^"]*)")|('([^']*)')/g, '<span class="text-[#032f62]">$1</span>')
            // Comments
            .replace(/\/\/(.*)/g, '<span class="text-[#6a737d]">//$1</span>')
            .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-[#6a737d]">$&</span>')
            // Numbers
            .replace(/\b\d+\b/g, '<span class="text-[#005cc5]">$&</span>');
    }

    // HTML highlighting
    else if (language === 'html') {
        highlighted = highlighted
            // Tags
            .replace(/&lt;([a-zA-Z][a-zA-Z0-9]*)/g, '&lt;<span class="text-[#22863a]">$1</span>')
            .replace(/&lt;\/([a-zA-Z][a-zA-Z0-9]*)/g, '&lt;/<span class="text-[#22863a]">$1</span>')
            .replace(/([a-zA-Z][a-zA-Z0-9]*)=/g, '<span class="text-[#6f42c1]">$1</span>=')
            // Strings
            .replace(/"([^"]*)"/g, '<span class="text-[#032f62]">"$1"</span>');
    }

    // CSS highlighting
    else if (language === 'css') {
        highlighted = highlighted
            // Properties
            .replace(/([a-z-]+):/g, '<span class="text-[#6f42c1]">$1</span>:')
            // Values
            .replace(/:\s*([^;]+);/g, ': <span class="text-[#005cc5]">$1</span>;')
            // Selectors
            .replace(/^([^{]+){/gm, '<span class="text-[#22863a]">$1</span>{');
    }

    return highlighted;
}

// Apply highlighting to code elements
function applySyntaxHighlighting() {
    document.querySelectorAll('code').forEach(codeElement => {
        if (!codeElement.classList.contains('highlighted')) {
            const language = codeElement.getAttribute('data-language') || 'c';
            const originalText = codeElement.textContent;
            codeElement.innerHTML = highlightCode(originalText, language);
            codeElement.classList.add('highlighted');
        }
    });
}