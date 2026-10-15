/* ============================================
   MIX CLUB · Service Worker
   离线优先缓存：应用外壳 + 运行时资源（图片等）
   ============================================ */

const CACHE_NAME = 'mix-club-v29';

// 应用外壳：首装即缓存，保证离线可打开
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/pages.css',
  './js/data.js',
  './js/qrcode.js',
  './js/utils.js',
  './js/i18n.js',
  './js/echarts.min.js',
  './js/app.js',
  './js/pages/home.js',
  './js/pages/menu.js',
  './js/pages/booking.js',
  './js/pages/events.js',
  './js/pages/queue.js',
  './js/pages/vip.js',
  './js/pages/login.js',
  './js/pages/register.js',
  './js/pages/music.js',
  './js/pages/cart.js',
  './js/pages/profile.js',
  './js/pages/merchant.js',
  './js/pages/tablebooking.js'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).catch(function (err) {
      console.warn('[SW] 预缓存失败，部分资源将在访问时缓存', err);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// 缓存优先：命中缓存直接返回，未命中则请求并写入缓存
self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // 跨域资源不做离线缓存

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      }).catch(function () {
        // 离线且未缓存：尝试返回应用外壳，避免白屏
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
