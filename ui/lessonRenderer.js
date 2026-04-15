// ============================================
// LESSON RENDERER - Lesson Content UI
// ============================================

function renderLesson(topicId) {
    const content = document.getElementById('lesson-content');
    const title = document.getElementById('lesson-title');

    if (!content || !title) return;

    // Clear existing content
    content.innerHTML = '';

    // Get topic data
    let topic = null;
    if (typeof TOPICS_DB !== 'undefined' && TOPICS_DB.topics) {
        topic = TOPICS_DB.topics.find(t => t.id === topicId);
    }

    if (!topic) {
        // Fallback topic data
        const fallbackTopics = {
            'variables': {
                title: 'Variables & Data Types',
                content: `
                    <div class="stitch-card p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">What are Variables?</h3>
                        <p class="text-gray-300 mb-4">
                            Variables are containers for storing data values. In C programming, you must declare a variable before using it.
                        </p>
                        <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
                            <pre><code class="language-c">// Variable declaration
int age = 25;
float price = 19.99;
char letter = 'A';</code></pre>
                        </div>
                    </div>

                    <div class="stitch-card p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">Data Types</h3>
                        <ul class="space-y-2 text-gray-300">
                            <li><strong>int:</strong> Integer numbers (-2,147,483,648 to 2,147,483,647)</li>
                            <li><strong>float:</strong> Floating-point numbers (3.14, -0.5)</li>
                            <li><strong>char:</strong> Single characters ('A', 'z', '1')</li>
                            <li><strong>double:</strong> Double precision floating-point</li>
                        </ul>
                    </div>
                `
            },
            'loops': {
                title: 'Loops & Control Flow',
                content: `
                    <div class="stitch-card p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">For Loops</h3>
                        <p class="text-gray-300 mb-4">
                            For loops are used when you know how many times to repeat a block of code.
                        </p>
                        <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
                            <pre><code class="language-c">for(int i = 0; i < 10; i++) {
    printf("Count: %d\\n", i);
}</code></pre>
                        </div>
                    </div>

                    <div class="stitch-card p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">While Loops</h3>
                        <p class="text-gray-300 mb-4">
                            While loops repeat as long as a condition is true.
                        </p>
                        <div class="bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
                            <pre><code class="language-c">int count = 0;
while(count < 5) {
    printf("Count: %d\\n", count);
    count++;
}</code></pre>
                        </div>
                    </div>
                `
            }
        };

        topic = fallbackTopics[topicId] || {
            title: 'Lesson Content',
            content: '<div class="stitch-card p-6"><p class="text-gray-400">Lesson content coming soon...</p></div>'
        };
    }

    // Update title
    title.textContent = topic.title;

    // Render content
    content.innerHTML = topic.content || '<div class="stitch-card p-6"><p class="text-gray-400">Lesson content not available.</p></div>';

    // Apply syntax highlighting
    applySyntaxHighlighting();
}