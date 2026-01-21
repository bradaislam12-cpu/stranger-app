const CACHE_NAME = 'sm-app-v2';
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './register.html',
  './dashboard.html',
  './chat.html',
  './profile.html',
  './meeting.html',
  './style.css',
  './ui-logic.js',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/3649/3649460.png'
];

// 1. التثبيت: تخزين ملفات "App Shell"
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: تم تخزين ملفات الواجهة بنجاح ✅');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. التفعيل: تنظيف النسخ القديمة لضمان وصول التحديثات للمستخدم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. استراتيجية الجلب (Stale-While-Revalidate)
// تقوم بعرض المحتوى من الكاش فوراً، ثم تحديثه في الخلفية من الإنترنت
self.addEventListener('fetch', (event) => {
  // استبعاد خدمات Firebase الحية و Jitsi
  if (
    event.request.url.includes('firestore.googleapis.com') || 
    event.request.url.includes('meet.jit.si') ||
    event.request.url.includes('firebaseauthjs')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // تحديث الكاش بالنسخة الجديدة من الإنترنت
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حال فشل الإنترنت تماماً وعدم وجود كاش
        console.log('SW: المستخدم غير متصل بالإنترنت حالياً');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
