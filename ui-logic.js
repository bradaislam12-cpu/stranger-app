// استيراد Firebase من CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMA4owgSvA_sBh2syHOnRTS5fhnW1JIeg",
    authDomain: "strangermeeting-91226.firebaseapp.com",
    projectId: "strangermeeting-91226",
    storageBucket: "strangermeeting-91226.firebasestorage.app",
    messagingSenderId: "575547116212",
    appId: "1:575547116212:web:333a4732abf59903e7e5e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// قاموس الترجمة (تم الإبقاء عليه مع إضافة مفاتيح جديدة)
const i18n = {
    ar: {
        title: "Stranger Meeting",
        googleLogin: "تسجيل الدخول عبر Google",
        matchSame: "مطابقة مع نفس الجنس",
        matchOpposite: "مطابقة مع الجنس الآخر",
        // ... (بقية الترجمات السابقة)
    },
    en: {
        title: "Stranger Meeting",
        googleLogin: "Login with Google",
        matchSame: "Match with Same Gender",
        matchOpposite: "Match with Opposite Gender",
        // ... (بقية الترجمات السابقة)
    }
};

// --- وظائف تسجيل الدخول الجديدة ---

window.loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
            // توجيه المستخدم لإكمال بياناته (الجنس والاهتمامات)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullname: user.displayName,
                email: user.email,
                isOnline: true,
                gender: "pending", // سيتم تحديثه في صفحة البروفايل
                seeking: "both"
            });
            window.location.href = "profile.html?firstLogin=true";
        } else {
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        console.error("Google Login Failed", error);
    }
};

// --- محرك المطابقة الذكي (Matchmaking) ---

window.startDiscovery = async (filterType) => {
    const user = auth.currentUser;
    if (!user) return;

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const myData = userSnap.data();
    
    let targetGender = myData.seeking;
    if (filterType === 'opposite') {
        targetGender = myData.gender === 'male' ? 'female' : 'male';
    } else if (filterType === 'same') {
        targetGender = myData.gender;
    }

    const q = query(
        collection(db, "users"),
        where("isOnline", "==", true),
        where("gender", "==", targetGender),
        where("uid", "!=", user.uid)
    );

    const snapshot = await getDocs(q);
    const matches = [];
    snapshot.forEach(doc => matches.push(doc.data()));

    if (matches.length > 0) {
        const randomMatch = matches[Math.floor(Math.random() * matches.length)];
        const roomID = [user.uid, randomMatch.uid].sort().join("_");
        window.location.href = `meeting.html?room=${roomID}`;
    } else {
        alert("لا يوجد أحد متاح حالياً بهذا الفلتر. جرب خياراً آخر!");
    }
};

// تطبيق الإعدادات (نفس دالتك السابقة)
function applySettings() {
    const lang = localStorage.getItem('sm-lang') || 'ar';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('.tr').forEach(el => {
        const key = el.getAttribute('data-key');
        if (i18n[lang][key]) el.innerText = i18n[lang][key];
    });
}
document.addEventListener('DOMContentLoaded', applySettings);
