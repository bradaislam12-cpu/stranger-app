const CACHE_NAME = 'sm-app-v2';

// قائمة الملفات التي سيتم حفظها في ذاكرة الهاتف للعمل بدون إنترنت
const ASSETS = [
  './',
  './index.html',
  './login.html',
  './register.html',
  './dashboard.html',
  './chat.html',
  './profile.html',
  './meeting.html',
  './terms.html',
  './style.css',
  './ui-logic.js',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/3649/3649460.png'
];

// 1. مرحلة التثبيت (Install): حفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: يتم الآن حفظ ملفات الـ App Shell ✅');
      return cache.addAll(ASSETS);
    })
  );
  // إجبار الـ Service Worker الجديد على أن يصبح نشطاً فوراً
  self.skipWaiting();
});

// 2. مرحلة التفعيل (Activate): تنظيف الملفات القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // السيطرة على العميل (المتصفح) فوراً
  self.clients.claim();
});

// 3. جلب البيانات (Fetch): إدارة طلبات الشبكة والكاش
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // استثناء طلبات Firebase و Jitsi من الكاش لضمان عمل الدردشة والفيديو بشكل حي
  if (
    url.includes('firestore.googleapis.com') || 
    url.includes('meet.jit.si') || 
    url.includes('firebaseauthjs') ||
    event.request.method !== 'GET' // الكاش يعمل فقط مع طلبات GET
  ) {
    return; // دع المتصفح يذهب للإنترنت مباشرة
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الكاش، ارجعه فوراً (لسرعة الفتح)
      // وقم بعمل تحديث في الخلفية (Revalidate)
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حال فشل الإنترنت تماماً ولم يتوفر كاش (Offline Mode)
        console.log('SW: لا يوجد اتصال بالإنترنت حالياً');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
