// ui-logic.js - المحرك المركزي لـ Stranger Meeting
// تم التحديث ببيانات المشروع الجديد لإنهاء مشكلة API Key

// 1️⃣ استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, deleteUser, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2️⃣ استيراد الترجمة والواجهة
import { applyTranslations, initUI } from "./translations.js";

// 3️⃣ إعدادات الربط (المستخرجة من صور إعدادات مشروعك)
const firebaseConfig = {
  apiKey: "AIzaSyANA4owgSvA_s8h2syHOnRTS5fhnW1JIeg", // تم التحديث
  authDomain: "strangermeeting-91226.firebaseapp.com", // تم التحديث
  projectId: "strangermeeting-91226", // تم التحديث
  storageBucket: "strangermeeting-91226.firebasestorage.app", // تم التحديث
  messagingSenderId: "575547116212", // تم التحديث
  appId: "1:575547116212:web:333a4732abf59903e7e5e1" // تم التحديث
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 4️⃣ دوال تسجيل الدخول والحساب الجديد
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
    console.error("Login Error:", error.message);
    alert("حدث خطأ في تسجيل الدخول بجوجل.");
  }
}

// 5️⃣ محرك البحث والمطابقة (Discovery)
export async function startDiscovery(btnElement) {
  const originalText = btnElement.innerText;
  btnElement.disabled = true;
  btnElement.innerText = "🔍 جاري البحث...";

  try {
    // استيراد ديناميكي لمحرك المطابقة
    const { findMatch } = await import('./matchmaking.js');
    const match = await findMatch();
    
    if (match) {
      btnElement.innerText = "✅ تم العثور على شريك!";
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
    console.error("Matchmaking Error:", error);
    btnElement.disabled = false;
    btnElement.innerText = "❌ حدث خطأ";
  }
}

// 6️⃣ تسجيل الخروج
export async function logoutUser() {
  if (auth.currentUser) {
    await updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
  }
  await signOut(auth);
  window.location.replace("index.html");
}

// تصدير الأدوات اللازمة لباقي الصفحات
export { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, onAuthStateChanged };
export { applyTranslations, initUI };

// تهيئة الواجهة عند التحميل
window.addEventListener("DOMContentLoaded", initUI);
