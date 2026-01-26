// service-worker.js

const CACHE_NAME = "stranger-meeting-v1.1"; // تحديث الإصدار عند تغيير الكود
const urlsToCache = [
  "./",
  "./index.html",
  "./login.html",
  "./register.html",
  "./profile.html",
  "./dashboard.html",
  "./chat.html",
  "./meeting.html",
  "./terms.html",
  "./style.css",
  "./manifest.json",
  "./ui-logic.js",
  "./translations.js",
  "./matchmaking.js",
  "./default-avatar.png"
];

// ✅ تثبيت Service Worker
self.addEventListener("install", (event) => {
  // تجبر الـ SW الجديد على العمل فوراً دون انتظار إغلاق التبويبات المفتوحة
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 [Service Worker] ملفات النظام تم تخزينها بنجاح");
      return cache.addAll(urlsToCache);
    })
  );
});

// ✅ تفعيل الخدمة وتنظيف الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ [Service Worker] حذف الكاش القديم:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // السيطرة على العميل فور التفعيل
  return self.clients.claim();
});

// ✅ إدارة جلب الملفات (استراتيجية: Cache First, falling back to Network)
self.addEventListener("fetch", (event) => {
  // استثناء طلبات Firebase و API من الكاش المسبق لضمان البيانات الحية
  if (event.request.url.includes("firestore.googleapis.com") || event.request.url.includes("firebaseauth.googleapis.com")) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجدنا الملف في الكاش، نرجعه فوراً لسرعة الأداء
      if (response) {
        return response;
      }

      // إذا لم يوجد، نجلبه من الشبكة
      return fetch(event.request).then((networkResponse) => {
        // التحقق من صحة الاستجابة قبل تخزينها
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // تخزين نسخة من الملفات الجديدة (مثل صور المستخدمين) في الكاش ديناميكياً
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // في حال انقطاع الإنترنت التام وعدم وجود الملف في الكاش
        if (event.request.mode === 'navigate') {
          return caches.match("./index.html");
        }
      });
    })
  );
});

// ✅ استقبال الرسائل لتحديث الكاش يدوياً
self.addEventListener("message", (event) => {
  if (event.data === "updateCache") {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache);
      console.log("🔄 [Service Worker] تم تحديث موارد التطبيق");
    });
  }
});

