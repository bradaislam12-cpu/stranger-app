// 1. استيراد مكتبات Firebase الأساسية
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
    query, where, getDocs, serverTimestamp, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. إعدادات المشروع
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

// 3. قاموس اللغات الشامل
const translations = {
    ar: {
        app_name: "Stranger Meeting",
        welcome: "مرحباً بك مجدداً!",
        login: "تسجيل الدخول",
        register: "إنشاء حساب جديد",
        dashboard: "الرئيسية",
        profile: "الملف الشخصي",
        settings: "الإعدادات",
        terms: "شروط الخدمة",
        chat: "المحادثة",
        fullname: "الاسم الكامل",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        gender: "جنسك",
        male: "ذكر",
        female: "أنثى",
        seeking: "تريد مقابلة",
        both: "الجميع",
        country: "البلد",
        interests: "الاهتمامات (هواياتك)",
        save_changes: "حفظ التغييرات ✅",
        logout: "تسجيل الخروج 🚪",
        start_search: "ابدأ البحث عن صديق 🚀",
        searching: "جاري البحث عن شريك مناسب...",
        cancel_search: "إلغاء البحث",
        no_friends: "لا يوجد أصدقاء بعد. ابدأ بمقابلة الناس!",
        friends_list: "👥 أصدقاؤك",
        friend_requests: "🔔 طلبات الصداقة",
        online: "متصل الآن",
        offline: "غير متصل",
        type_message: "اكتب رسالتك هنا...",
        send: "إرسال",
        chat_secure: "بداية المحادثة الآمنة 🔒",
        friend_added: "تمت إضافة الصديق بنجاح! 🎉",
        add_friend: "إرسال طلب صداقة ➕",
        request_sent: "تم إرسال الطلب بنجاح",
        error_required: "يرجى ملء جميع الحقول المطلوبة",
        error_email_used: "هذا البريد مستخدم بالفعل",
        error_weak_pass: "كلمة المرور ضعيفة جداً",
        error_generic: "حدث خطأ ما، حاول ثانية",
        success_update: "تم تحديث البيانات بنجاح!",
        confirm_exit: "هل أنت متأكد من الخروج؟",
        back: "رجوع",
        agree: "أوافق وأرغب في المتابعة ✅",
        have_account: "لديك حساب بالفعل؟ سجل دخولك",
        no_account: "ليس لديك حساب؟ سجل الآن",
        dark_mode: "الوضع الليلي",
        light_mode: "الوضع النهاري"
    },
    en: {
        app_name: "Stranger Meeting",
        welcome: "Welcome Back!",
        login: "Login",
        register: "Create New Account",
        dashboard: "Dashboard",
        profile: "Profile",
        settings: "Settings",
        terms: "Terms of Service",
        chat: "Chat",
        fullname: "Full Name",
        email: "Email Address",
        password: "Password",
        gender: "Gender",
        male: "Male",
        female: "Female",
        seeking: "Seeking",
        both: "Everyone",
        country: "Country",
        interests: "Interests (Hobbies)",
        save_changes: "Save Changes ✅",
        logout: "Logout 🚪",
        start_search: "Start Searching 🚀",
        searching: "Looking for a match...",
        cancel_search: "Cancel Search",
        no_friends: "No friends yet. Start meeting people!",
        friends_list: "👥 Your Friends",
        friend_requests: "🔔 Friend Requests",
        online: "Online Now",
        offline: "Offline",
        type_message: "Type your message...",
        send: "Send",
        chat_secure: "Secure Conversation Started 🔒",
        friend_added: "Friend added successfully! 🎉",
        add_friend: "Add Friend ➕",
        request_sent: "Request sent successfully",
        error_required: "Please fill all required fields",
        error_email_used: "This email is already registered",
        error_weak_pass: "Password is too weak",
        error_generic: "Something went wrong, try again",
        success_update: "Data updated successfully!",
        confirm_exit: "Are you sure you want to exit?",
        back: "Back",
        agree: "I agree and want to proceed ✅",
        have_account: "Have an account? Login",
        no_account: "No account? Register now",
        dark_mode: "Dark Mode",
        light_mode: "Light Mode"
    }
};

// --- وظائف الواجهة (UI Functions) ---

export function applyTranslations(lang) {
    const elements = document.querySelectorAll('.tr');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            if (el.placeholder !== undefined) {
                el.placeholder = translations[lang][key];
            }
            if (el.tagName !== 'INPUT') {
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
};

export const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// --- وظائف المنطق (Logic Functions) ---

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
                country: "Unknown",
                isOnline: true,
                createdAt: serverTimestamp()
            });
        } else {
            await updateDoc(userRef, { isOnline: true });
        }
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Google Login Error:", error);
    }
};

// محرك البحث العشوائي
export const startDiscovery = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const myDoc = await getDoc(doc(db, "users", user.uid));
        const myData = myDoc.data();

        let q = query(
            collection(db, "users"),
            where("isOnline", "==", true),
            where("uid", "!=", user.uid),
            limit(20)
        );

        const querySnapshot = await getDocs(q);
        const candidates = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if ((myData.seeking === "both" || data.gender === myData.seeking) &&
                (data.seeking === "both" || data.seeking === myData.gender)) {
                candidates.push(data);
            }
        });

        if (candidates.length > 0) {
            const randomFriend = candidates[Math.floor(Math.random() * candidates.length)];
            const roomName = [user.uid, randomFriend.uid].sort().join("");
            window.location.href = `meeting.html?room=${roomName}&target=${randomFriend.uid}`;
        } else {
            const lang = localStorage.getItem('preferredLang') || 'ar';
            alert(lang === 'ar' ? "لا يوجد مستخدمين متاحين" : "No users available");
        }
    } catch (error) {
        console.error("Discovery Error:", error);
    }
};

// تهيئة الإعدادات عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    const savedLang = localStorage.getItem('preferredLang') || 'ar';
    applyTranslations(savedLang);
});

window.addEventListener('beforeunload', () => {
    if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
    }
});
