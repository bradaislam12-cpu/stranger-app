// service-worker.js

const CACHE_NAME = "stranger-meeting-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./login.html",
  "./register.html",
  "./profile.html",
  "./dashboard.html",
  "./meeting.html",
  "./style.css",
  "./manifest.json",
  "./ui-logic.js",
  "./matchmaking.js",
  "./default-avatar.png"
];

// ✅ تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("✅ الملفات تم تخزينها في الكاش");
      return cache.addAll(urlsToCache);
    })
  );
});

// ✅ تفعيل Service Worker وحذف الكاش القديم
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ حذف الكاش القديم:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// ✅ جلب الملفات (يدعم العمل بدون اتصال)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا الملف موجود في الكاش → رجعه
      if (response) {
        return response;
      }
      // إذا غير موجود → جلبه من الشبكة وتخزينه
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});

// ✅ حدث خاص لتحديث الكاش عند الطلب
self.addEventListener("message", (event) => {
  if (event.data === "updateCache") {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache);
      console.log("🔄 تم تحديث الكاش يدوياً");
    });
  }
});
