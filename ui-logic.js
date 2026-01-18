// 1. استيراد مكتبات Firebase الأساسية
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
    query, where, getDocs, serverTimestamp, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. إعدادات المشروع (API Keys)
const firebaseConfig = {
    apiKey: "AIzaSyAMA4owgSvA_sBh2syHOnRTS5fhnW1JIeg",
    authDomain: "strangermeeting-91226.firebaseapp.com",
    projectId: "strangermeeting-91226",
    storageBucket: "strangermeeting-91226.firebasestorage.app",
    messagingSenderId: "575547116212",
    appId: "1:575547116212:web:333a4732abf59903e7e5e1"
};

// 3. تشغيل الخدمات
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- وظائف المنطق البرمجي (Logic) ---

// أ. وظيفة تسجيل الدخول عبر جوجل
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // فحص هل المستخدم جديد أم قديم لإنشاء بروفايل له
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                fullname: user.displayName,
                email: user.email,
                gender: "male", // افتراضي
                seeking: "both", // افتراضي
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
        throw error;
    }
};

// ب. محرك البحث العشوائي (The Discovery Engine)
export const startDiscovery = async () => {
    const user = auth.currentUser;
    if (!user) return alert("يجب تسجيل الدخول أولاً");

    try {
        // 1. جلب بياناتي الشخصية لمعرفة تفضيلاتي
        const myDoc = await getDoc(doc(db, "users", user.uid));
        const myData = myDoc.data();

        // 2. بناء استعلام للبحث عن مستخدمين متصلين
        // نبحث عن شخص: متصل + ليس أنا + يطابق الجنس المطلوب
        let q;
        if (myData.seeking === "both") {
            q = query(
                collection(db, "users"),
                where("isOnline", "==", true),
                where("uid", "!=", user.uid),
                limit(20)
            );
        } else {
            q = query(
                collection(db, "users"),
                where("isOnline", "==", true),
                where("gender", "==", myData.seeking),
                where("uid", "!=", user.uid),
                limit(20)
            );
        }

        const querySnapshot = await getDocs(q);
        const candidates = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // تصفية إضافية: هل الطرف الآخر يبحث عن جنسي أنا أيضاً؟
            if (data.seeking === "both" || data.seeking === myData.gender) {
                candidates.push(data);
            }
        });

        if (candidates.length > 0) {
            // اختيار شخص عشوائي من القائمة المطابقة
            const randomFriend = candidates[Math.floor(Math.random() * candidates.length)];
            
            // إنشاء معرف غرفة فريد
            const roomName = [user.uid, randomFriend.uid].sort().join("");
            
            // التوجه لصفحة الفيديو مع تمرير المعرفات
            window.location.href = `meeting.html?room=${roomName}&target=${randomFriend.uid}`;
        } else {
            alert("عذراً، لا يوجد مستخدمين متاحين حالياً يطابقون خياراتك. حاول لاحقاً!");
        }
    } catch (error) {
        console.error("Discovery Error:", error);
        alert("حدث خطأ أثناء البحث عن شركاء.");
    }
};

// ج. تحديث الحالة عند الخروج أو إغلاق الصفحة
window.addEventListener('beforeunload', () => {
    if (auth.currentUser) {
        updateDoc(doc(db, "users", auth.currentUser.uid), { isOnline: false });
    }
});
