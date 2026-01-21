// 1. استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
    query, where, getDocs, serverTimestamp, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. إعدادات المشروع (تأكد من مطابقتها لإعدادات Firebase Console الخاصة بك)
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
const googleProvider = new GoogleAuthProvider();

// 3. قاموس اللغات (تمت مراجعته وتدقيقه)
export const translations = {
    ar: {
        app_name: "Stranger Meeting",
        welcome: "مرحباً بك مجدداً!",
        login: "تسجيل الدخول",
        register: "إنشاء حساب جديد",
        dashboard: "الرئيسية",
        profile: "الملف الشخصي",
        fullname: "الاسم الكامل",
        email: "البريد الإلكتروني",
        gender: "جنسك",
        male: "ذكر",
        female: "أنثى",
        seeking: "اهتمامك",
        both: "الجميع",
        save_changes: "حفظ التغييرات ✅",
        logout: "خروج 🚪",
        start_search: "بحث عن صديق 🚀",
        searching: "جاري البحث عن شريك مناسب...",
        online: "متصل",
        no_users: "لا يوجد مستخدمين متاحين حالياً، حاول مرة أخرى.",
        // أضف أي مفاتيح أخرى هنا
    },
    en: {
        app_name: "Stranger Meeting",
        welcome: "Welcome Back!",
        login: "Login",
        register: "Register",
        dashboard: "Dashboard",
        profile: "Profile",
        fullname: "Full Name",
        email: "Email",
        gender: "Gender",
        male: "Male",
        female: "Female",
        seeking: "Seeking",
        both: "Everyone",
        save_changes: "Save ✅",
        logout: "Logout 🚪",
        start_search: "Find Match 🚀",
        searching: "Searching for partner...",
        online: "Online",
        no_users: "No users available right now, try again.",
    }
};

// --- وظائف الواجهة (UI Functions) ---

export function applyTranslations(lang) {
    const elements = document.querySelectorAll('.tr');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerText = translations[lang][key];
            }
        }
    });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerText = lang === 'ar' ? 'EN' : 'AR';
}

export const toggleLang = () => {
    let currentLang = localStorage.getItem('preferredLang') === 'en' ? 'ar' : 'en';
    localStorage.setItem('preferredLang', currentLang);
    applyTranslations(currentLang);
    window.location.reload(); // لإعادة تحميل القوائم الديناميكية مثل الهوايات
};

export const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// --- وظائف المنطق (Logic Functions) ---

// تسجيل الدخول بجوجل
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                fullname: user.displayName,
                email: user.email,
                gender: "male",
                seeking: "both",
                country: "Algeria",
                interests: [],
                isOnline: true,
                isBusy: false,
                createdAt: serverTimestamp()
            });
        } else {
            await updateDoc(userRef, { isOnline: true, isBusy: false });
        }
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Google Login Error:", error);
    }
};

// محرك البحث المطور
export const startDiscovery = async (btn) => {
    const user = auth.currentUser;
    if (!user) return;

    const lang = localStorage.getItem('preferredLang') || 'ar';
    const originalText = btn.innerText;
    
    try {
        btn.disabled = true;
        btn.innerText = translations[lang].searching;

        const myDoc = await getDoc(doc(db, "users", user.uid));
        const myData = myDoc.data();

        // استعلام لجلب مستخدمين متاحين
        let q = query(
            collection(db, "users"),
            where("isOnline", "==", true),
            where("isBusy", "==", false),
            where("uid", "!=", user.uid),
            limit(30)
        );

        const querySnapshot = await getDocs(q);
        const candidates = [];

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // شرط المطابقة المتبادلة (Mutual Match)
            const amIInterested = (myData.seeking === "both" || data.gender === myData.seeking);
            const isPartnerInterested = (data.seeking === "both" || data.seeking === myData.gender);

            if (amIInterested && isPartnerInterested) {
                candidates.push(data);
            }
        });

        if (candidates.length > 0) {
            const partner = candidates[Math.floor(Math.random() * candidates.length)];
            const roomID = [user.uid, partner.uid].sort().join("_");
            
            // تحديث حالتي لمشغول قبل الانتقال
            await updateDoc(doc(db, "users", user.uid), { isBusy: true });
            
            window.location.href = `meeting.html?room=${roomID}&target=${partner.uid}`;
        } else {
            alert(translations[lang].no_users);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    } catch (error) {
        console.error("Discovery Error:", error);
        btn.disabled = false;
        btn.innerText = originalText;
    }
};

// تهيئة الإعدادات عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', () => {
    // 1. الثيم
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // 2. اللغة
    const savedLang = localStorage.getItem('preferredLang') || 'ar';
    applyTranslations(savedLang);

    // 3. مراقبة حالة المستخدم لتحديث الـ Online/Offline
    onAuthStateChanged(auth, (user) => {
        if (user) {
            updateDoc(doc(db, "users", user.uid), { isOnline: true });
        }
    });
});

