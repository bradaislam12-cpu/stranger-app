const CACHE_NAME = 'sm-chat-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/chat.html',
  '/style.css',
  '/ui-logic.js',
  '/manifest.json'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// تفعيل وتحديث الكاش
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// استراتيجية الجلب (Network First) لضمان تحديث البيانات
self.addEventListener('fetch', (e) => {
  // تجاوز طلبات Firebase (لا نريد كاش لبيانات الدردشة الحية)
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis.com')) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
