const CACHE_NAME = 'sm-app-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/chat.html',
  '/profile.html',
  '/meeting.html',
  '/terms.html',
  '/style.css',
  '/ui-logic.js',
  '/manifest.json',
  'https://cdn-icons-png.flaticon.com/512/3649/3649460.png'
];

// 1. مرحلة التثبيت: تخزين الملفات الأساسية في ذاكرة الهاتف
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('تم حفظ ملفات الموقع في التخزين المؤقت ✅');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. مرحلة التفعيل: مسح التخزين القديم عند تحديث الموقع
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. جلب البيانات: محاولة التحميل من الذاكرة أولاً ثم الإنترنت (للسرعة)
self.addEventListener('fetch', (event) => {
  // لا نقوم بتخزين طلبات Firebase أو الفيديو مؤقتاً لضمان البيانات الحية
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('meet.jit.si')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
