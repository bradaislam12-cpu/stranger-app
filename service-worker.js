// service-worker.js - PWA Core Manager

const CACHE_NAME = "stranger-meeting-v1.2"; // تم تحديث الإصدار لضمان مسح الكاش القديم عند المستخدمين
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
  "./economy.js",
  "./default-avatar.png",
  "https://cdn-icons-png.flaticon.com/512/3649/3649460.png"
];

// 1. التثبيت (Install): تخزين الملفات الأساسية
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 SW: Caching system assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. التفعيل (Activate): تنظيف الإصدارات القديمة
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑️ SW: Removing old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. جلب الموارد (Fetch): استراتيجية ذكية
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // استثناء طلبات Firebase و APIs لضمان دقة البيانات المالية والمحادثات
  if (
    url.origin.includes("googleapis.com") || 
    url.origin.includes("firebaseapp.com") ||
    request.method !== "GET"
  ) {
    return; // دع الشبكة تتعامل مع هذه الطلبات مباشرة
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // تحديث الكاش في الخلفية لضمان أن المستخدم سيحصل على أحدث نسخة في المرة القادمة
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // إذا لم يكن في الكاش، اطلبه من الشبكة
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // إذا فشل كل شيء (أوفلاين)، ارجع لصفحة البداية إذا كان الطلب ملاحة (Navigation)
        if (request.mode === 'navigate') {
          return caches.match("./index.html");
        }
      });
    })
  );
});

// 4. تحديث يدوي عند الحاجة
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
