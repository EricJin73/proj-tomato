const CACHE_NAME = 'xueyihui-v1';
const STATIC_ASSETS = [
  '/Index_v2.html',
  '/manifest.json'
];

// 安装时缓存静态资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 请求拦截：优先网络，失败时走缓存（AI 接口始终走网络）
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // AI API 请求直接放行，不缓存
  if (url.hostname.includes('googleapis.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
