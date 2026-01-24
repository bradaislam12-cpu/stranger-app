// ui-logic.js

// ✅ استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, deleteUser } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ استيراد الترجمات والثيم
import { applyTranslations, toggleLang, toggleTheme, initUI } from "./translations.js";

// ✅ إعداد Firebase
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

// ✅ تسجيل الدخول بجوجل
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // حفظ بيانات المستخدم في Firestore إذا كان جديد
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        fullname: user.displayName || "",
        email: user.email,
        avatarUrl: user.photoURL || "default-avatar.png",
        gender: "male",
        seeking: "both",
        country: "Algeria",
        interests: [],
        isOnline: true,
        isBusy: false
      });
    }

    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("❌ فشل تسجيل الدخول بجوجل:", error);
    alert("فشل تسجيل الدخول بجوجل، حاول ثانية");
  }
}

// ✅ حذف الحساب
export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) return;

  if (confirm("هل أنت متأكد أنك تريد حذف حسابك نهائياً؟ ⚠️")) {
    try {
      await deleteUser(user);
      alert("✅ تم حذف الحساب بنجاح");
      window.location.replace("index.html");
    } catch (error) {
      console.error("❌ فشل حذف الحساب:", error);
      alert("فشل حذف الحساب، حاول ثانية");
    }
  }
}

// ✅ تحميل واجهة المستخدم (ترجمة + ثيم)
window.addEventListener("DOMContentLoaded", () => {
  initUI();
});
