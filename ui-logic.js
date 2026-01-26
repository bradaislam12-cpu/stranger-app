// ui-logic.js - المحرك المركزي لتطبيق Stranger Meeting

// 1️⃣ استيراد مكتبات Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, deleteUser, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2️⃣ استيراد الإضافات والترجمة
import { applyTranslations, toggleLang, toggleTheme, initUI } from "./translations.js";

// 3️⃣ إعداد Firebase (تأكد من وضع بياناتك الحقيقية هنا)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// تصدير الدوال للاستخدام في الصفحات
export { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, onAuthStateChanged };
export { applyTranslations, toggleLang, toggleTheme, initUI };

/**
 * 4️⃣ تسجيل الدخول بجوجل + هدية 100 نقطة للمستخدم الجديد
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        fullname: user.displayName || "Stranger",
        email: user.email,
        avatarUrl: user.photoURL || "default-avatar.png",
        gender: "male", 
        seeking: "both",
        points: 100, // رصيد ترحيبي
        isOnline: true,
        isBusy: false,
        createdAt: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, { isOnline: true, isBusy: false });
    }
    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("❌ Google Login Error:", error);
  }
}

/**
 * 5️⃣ محرك البحث المدمج بنظام النقاط (Discovery Engine)
 */
export async function startDiscovery(btnElement) {
  const { findMatch } = await import('./matchmaking.js');
  const originalText = btnElement.innerText;
  
  btnElement.disabled = true;
  btnElement.innerText = "🔍 جاري البحث...";

  try {
    // استدعاء محرك المطابقة (الذي يفحص النقاط تلقائياً الآن)
    const match = await findMatch();
    
    if (match) {
      btnElement.innerText = "✅ تم العثور على شريك!";
      
      // التوجه لغرفة المكالمة بصفتك المنشئ (Caller)
      setTimeout(() => {
        window.location.href = `meeting.html?room=${match.roomID}&role=caller`;
      }, 1000);
    } else {
      btnElement.innerText = "⏳ لا أحد متاح الآن";
      setTimeout(() => {
        btnElement.disabled = false;
        btnElement.innerText = originalText;
      }, 3000);
    }
  } catch (error) {
    console.error("Discovery Error:", error);
    btnElement.disabled = false;
    btnElement.innerText = "❌ حدث خطأ";
  }
}

/**
 * 6️⃣ مراقبة المكالمات الواردة (Incoming Calls)
 * تعمل في الخلفية في لوحة التحكم
 */
export function listenForIncomingCalls(uid) {
  const usersRef = doc(db, "users", uid);
  
  // الاستماع لتغيير حالة "isBusy" أو استقبال طلبات في مجموعة videoCalls
  // ملاحظة: المنطق الأبسط هو مراقبة غرف الفيديو التي يكون المستخدم جزءاً منها
  return onSnapshot(collection(db, "videoCalls"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const roomID = change.id;
        if (roomID.includes(uid)) {
          // إذا لم يكن المستخدم هو من بدأ المكالمة، فهو المستقبل
          const callerId = roomID.replace(uid, "").replace("_", "");
          if (callerId !== uid) {
            window.location.href = `meeting.html?room=${roomID}&role=receiver`;
          }
        }
      }
    });
  });
}

/**
 * 7️⃣ تسجيل الخروج وتحديث الحالة فوراً
 */
export async function logoutUser() {
  if (auth.currentUser) {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { 
        isOnline: false,
        isBusy: false 
      });
    } catch (e) {}
  }
  await signOut(auth);
  window.location.replace("index.html");
}

/**
 * 8️⃣ حذف الحساب نهائياً
 */
export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    // 1. حذف البيانات من Firestore أولاً
    await updateDoc(doc(db, "users", user.uid), { isOnline: false });
    // 2. حذف المستخدم من Authentication
    await deleteUser(user);
    window.location.replace("index.html");
  } catch (error) {
    alert("يرجى تسجيل الدخول مجدداً ثم محاولة حذف الحساب لدواعي أمنية.");
  }
}

// تهيئة الواجهة عند التحميل
window.addEventListener("DOMContentLoaded", initUI);
