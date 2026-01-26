// ui-logic.js - المحرك المركزي للمشروع

// 1️⃣ استيراد مكتبات Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, deleteUser, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2️⃣ استيراد المنطق الفرعي (الترجمة والبحث)
import { applyTranslations, toggleLang, toggleTheme, initUI } from "./translations.js";

// 3️⃣ إعداد Firebase (استبدل القيم ببيانات مشروعك الحقيقية)
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

// 4️⃣ إعادة تصدير دوال Firestore لتبسيط الاستخدام في الصفحات
export { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, onAuthStateChanged };
export { applyTranslations, toggleLang, toggleTheme, initUI };

/**
 * 5️⃣ تسجيل الدخول بجوجل مع تهيئة بيانات المستخدم
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
        country: "Unknown",
        interests: [],
        isOnline: true,
        isBusy: false,
        createdAt: new Date()
      });
    } else {
      await updateDoc(userRef, { isOnline: true, isBusy: false });
    }
    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("❌ Google Login Error:", error);
    alert("فشل تسجيل الدخول بجوجل.");
  }
}

/**
 * 6️⃣ محرك البحث عن شريك (Discovery Engine)
 */
export async function startDiscovery(btnElement) {
  const { findMatch } = await import('./matchmaking.js'); // استيراد ديناميكي لتوفير الأداء
  const originalText = btnElement.innerText;
  
  btnElement.disabled = true;
  btnElement.innerText = "🔍 جاري البحث...";

  try {
    const match = await findMatch();
    if (match) {
      btnElement.innerText = "✅ تم العثور على شريك!";
      // تحديث حالة المستخدم ليصبح مشغولاً
      await updateDoc(doc(db, "users", auth.currentUser.uid), { isBusy: true });
      
      setTimeout(() => {
        window.location.href = `meeting.html?room=${match.roomID}`;
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
    btnElement.innerText = originalText;
  }
}

/**
 * 7️⃣ حذف الحساب نهائياً
 */
export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) return;

  const lang = localStorage.getItem('preferredLang') || 'ar';
  const msg = lang === 'ar' ? "⚠️ هل أنت متأكد؟ سيتم حذف جميع بياناتك نهائياً." : "⚠️ Are you sure? Your data will be deleted forever.";

  if (confirm(msg)) {
    try {
      await deleteUser(user);
      window.location.replace("index.html");
    } catch (error) {
      alert(lang === 'ar' ? "يرجى إعادة تسجيل الدخول أولاً لدواعي أمنية." : "Please re-login for security reasons before deleting.");
    }
  }
}

/**
 * 8️⃣ تسجيل الخروج وتحديث الحالة
 */
export async function logoutUser() {
  if (auth.currentUser) {
    await updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
  }
  await signOut(auth);
  window.location.replace("index.html");
}

// 9️⃣ تهيئة تلقائية للواجهة عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  initUI();
});

