// service-worker.js - CodeFlow PWA service worker
const CACHE_VERSION = 'codeflow-v5';

const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/data/topicsDB.js',
  '/data/quizDB.js',
  '/data/outputPredictionDB.js',
  '/data/logicQuestDB.js',
  '/data/gameLevels.js',
  '/data/knowledgeBase.js',
  '/src/core/syntaxHighlighter.js',
  '/src/core/router.js',
  '/src/core/app.js',
  '/src/engines/visualizationEngine.js',
  '/src/engines/outputPredictionEngine.js',
  '/src/engines/logicAnalyzerEngine.js',
  '/src/engines/logicQuestEngine.js',
  '/src/engines/adaptivePracticeEngine.js',
  '/src/engines/quizEngine.js',
  '/src/ui/dashboardRenderer.js',
  '/src/ui/lessonRenderer.js',
  '/src/ui/quizRenderer.js',
  '/src/ui/chatbotRenderer.js',
  '/src/ui/logicRenderer.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // Cache each asset independently: one missing file must not abort install.
    await Promise.all(PRECACHE.map(async (asset) => {
      try {
        await cache.add(new Request(asset, { cache: 'reload' }));
      } catch (error) {
        console.warn('[sw] Skipped precache for', asset, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name !== CACHE_VERSION).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;
  if (url.origin !== self.location.origin) return;

  // Navigations: network first so a new deploy is picked up, offline fallback to the shell.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh.ok) {
          const cache = await caches.open(CACHE_VERSION);
          cache.put('/index.html', fresh.clone());
        }
        return fresh;
      } catch (error) {
        const cached = await caches.match('/index.html');
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then((response) => {
      if (response && response.ok) {
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    }).catch(() => null);

    return cached || (await network) || new Response('Offline', { status: 503 });
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
