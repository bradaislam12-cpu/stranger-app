// ui-logic.js - المحرك المركزي الشامل للمشروع
// تم دمج: (إصلاح API Key + منع إعادة التحميل + نظام المطابقة + نظام النقاط)

// 1️⃣ استيراد مكتبات Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, deleteUser, onAuthStateChanged, signOut, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2️⃣ استيراد المنطق الفرعي (الترجمة والواجهة)
import { applyTranslations, toggleLang, toggleTheme, initUI } from "./translations.js";

// 3️⃣ إعداد Firebase الجديد (بيانات مشروعك الصحيحة)
const firebaseConfig = {
  apiKey: "AIzaSyANA4owgSvA_s8h2syHOnRTS5fhnW1JIeg",
  authDomain: "strangermeeting-91226.firebaseapp.com",
  projectId: "strangermeeting-91226",
  storageBucket: "strangermeeting-91226.firebasestorage.app",
  messagingSenderId: "575547116212",
  appId: "1:575547116212:web:333a4732abf59903e7e5e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 4️⃣ دالة إنشاء حساب جديد (مع منع اختفاء البيانات)
export async function registerUser(event) {
    if (event) event.preventDefault(); // الحل الجذري لاختفاء البيانات
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const gender = document.getElementById('gender').value;

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullname: fullname,
            email: email,
            gender: gender,
            points: 100, // رصيد ترحيبي
            isOnline: true,
            isBusy: false,
            createdAt: serverTimestamp()
        });
        window.location.replace("dashboard.html");
    } catch (error) {
        alert("خطأ في التسجيل: " + error.message);
    }
}

// 5️⃣ دالة تسجيل الدخول (مع منع اختفاء البيانات)
export async function loginUser(event) {
    if (event) event.preventDefault(); // منع مسح الحقول

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("dashboard.html");
    } catch (error) {
        alert("خطأ في الدخول: " + error.message);
    }
}

// 6️⃣ تسجيل الدخول بجوجل
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
        points: 100,
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

// 7️⃣ محرك البحث عن شريك (Discovery Engine)
export async function startDiscovery(btnElement) {
  const { findMatch } = await import('./matchmaking.js'); 
  const originalText = btnElement.innerText;
  
  btnElement.disabled = true;
  btnElement.innerText = "🔍 جاري البحث...";

  try {
    const match = await findMatch();
    if (match) {
      btnElement.innerText = "✅ تم العثور!";
      setTimeout(() => {
        window.location.href = `meeting.html?room=${match.roomID}&role=caller`;
      }, 1000);
    } else {
      btnElement.innerText = "⏳ لا أحد متاح";
      setTimeout(() => {
        btnElement.disabled = false;
        btnElement.innerText = originalText;
      }, 3000);
    }
  } catch (error) {
    btnElement.disabled = false;
    btnElement.innerText = originalText;
  }
}

// 8️⃣ تسجيل الخروج وحذف الحساب
export async function logoutUser() {
  if (auth.currentUser) {
    await updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
  }
  await signOut(auth);
  window.location.replace("index.html");
}

export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user || !confirm("⚠️ سيتم حذف بياناتك نهائياً!")) return;
  try {
    await deleteUser(user);
    window.location.replace("index.html");
  } catch (error) {
    alert("يرجى إعادة تسجيل الدخول أولاً.");
  }
}

// 9️⃣ الربط مع الواجهة
window.loginUser = loginUser;
window.registerUser = registerUser;
window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;

window.addEventListener("DOMContentLoaded", () => {
  initUI();
});

export { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, onSnapshot, onAuthStateChanged };
export { applyTranslations, toggleLang, toggleTheme, initUI };

