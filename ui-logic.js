here// ui-logic.js - المحرك المركزي المحدث
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1️⃣ إعدادات الربط الصحيحة (مشروعك الجديد)
const firebaseConfig = {
  apiKey: "AIzaSyANA4owgSvA_s8h2syHOnRTS5fhnW1JIeg", //
  authDomain: "strangermeeting-91226.firebaseapp.com", //
  projectId: "strangermeeting-91226", //
  storageBucket: "strangermeeting-91226.firebasestorage.app", //
  messagingSenderId: "575547116212", //
  appId: "1:575547116212:web:333a4732abf59903e7e5e1" //
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 2️⃣ دالة إنشاء حساب جديد (Register)
export async function registerUser(event) {
    if (event) event.preventDefault(); // منع مسح البيانات وإعادة تحميل الصفحة

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const gender = document.getElementById('gender').value;

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // حفظ بيانات المستخدم الإضافية في Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullname: fullname,
            email: email,
            gender: gender,
            points: 100, // هدية التسجيل
            isOnline: true,
            isBusy: false,
            createdAt: serverTimestamp()
        });

        window.location.replace("dashboard.html");
    } catch (error) {
        console.error("Registration Error:", error.code);
        alert("فشل التسجيل: " + error.message);
    }
}

// 3️⃣ دالة تسجيل الدخول بالبريد (Login)
export async function loginUser(event) {
    if (event) event.preventDefault(); // منع اختفاء البيانات

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.replace("dashboard.html");
    } catch (error) {
        console.error("Login Error:", error.code);
        alert("خطأ في تسجيل الدخول: " + error.message);
    }
}

// 4️⃣ تسجيل الدخول بجوجل
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
            await updateDoc(userRef, { isOnline: true });
        }
        window.location.replace("dashboard.html");
    } catch (error) {
        alert("فشل الدخول بجوجل: " + error.message);
    }
}

// 5️⃣ تسجيل الخروج
export async function logoutUser() {
    if (auth.currentUser) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
    }
    await signOut(auth);
    window.location.replace("index.html");
}

// ربط الدوال بالنافذة (لتعمل مع أزرار HTML)
window.registerUser = registerUser;
window.loginUser = loginUser;
window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;
