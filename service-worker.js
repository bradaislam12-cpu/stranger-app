const CACHE_NAME = 'sm-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/ui-logic.js',
    '/manifest.json',
    '/login.html',
    '/register.html',
    '/dashboard.html',
    '/profile.html',
    '/chat.html',
    '/meeting.html'
];

// تثبيت ملف الخدمة وتخزين الملفات الأساسية
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// استراتيجية التحميل: من الكاش أولاً ثم الشبكة لضمان السرعة
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});
