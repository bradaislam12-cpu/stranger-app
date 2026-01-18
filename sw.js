// sw.js - هذا الملف يجعل التطبيق يعمل أوفلاين ويسمح بالتثبيت
const cacheName = 'sm-app-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/ui-logic.js',
  'https://cdn-icons-png.flaticon.com/512/3649/3649460.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
