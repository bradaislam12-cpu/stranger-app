import { db, auth } from './ui-logic.js';
import { 
    collection, query, where, getDocs, doc, getDoc, limit, updateDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * محرك المطابقة المطور (Enhanced Matchmaking Engine)
 */
export const findMatch = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    try {
        // 1. جلب بياناتي وبيانات تفضيلاتي
        const myDoc = await getDoc(doc(db, "users", user.uid));
        if (!myDoc.exists()) throw new Error("User data not found");
        
        const myData = myDoc.data();
        const myInterests = myData.interests || [];

        // 2. بناء الاستعلام - استبعاد المستخدمين المشغولين (isBusy) أو غير المتصلين
        let q;
        const usersRef = collection(db, "users");
        
        // التصفية الأساسية: متصل، غير مشغول، ليس أنا
        const baseConstraints = [
            where("isOnline", "==", true),
            where("isBusy", "==", false), // تحسين: لا نطابق شخصاً في محادثة حالياً
            limit(50)
        ];

        if (myData.seeking === "both") {
            q = query(usersRef, ...baseConstraints);
        } else {
            q = query(usersRef, where("gender", "==", myData.seeking), ...baseConstraints);
        }

        const querySnapshot = await getDocs(q);
        const candidates = [];

        // 3. التصفية المتقدمة وحساب النقاط
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            
            // استبعاد نفسي برمجياً لأن Firestore لا يدعم "!=" مع "==" في نفس الاستعلام أحياناً بشكل فعال
            if (data.uid === user.uid) return;

            // هل الطرف الآخر مهتم بجنسي؟
            const isMutualMatch = (data.seeking === "both" || data.seeking === myData.gender);
            
            if (isMutualMatch) {
                // حساب الاهتمامات المشتركة
                let score = 0;
                if (data.interests && myInterests.length > 0) {
                    const common = data.interests.filter(item => myInterests.includes(item));
                    score = common.length; 
                }
                candidates.push({ ...data, matchScore: score });
            }
        });

        // 4. اختيار الشريك المثالي
        if (candidates.length > 0) {
            // ترتيب تنازلي حسب النقاط
            candidates.sort((a, b) => b.matchScore - a.matchScore);

            // اختيار عشوائي من بين الأفضل لكسر الملل
            const topPool = candidates.slice(0, 3);
            const partner = topPool[Math.floor(Math.random() * topPool.length)];

            // 5. تحديث حالة الطرفين إلى "مشغول" فوراً لمنع دخول طرف ثالث
            // ملاحظة: في المشاريع الكبيرة نستخدم (Transactions) هنا لضمان الأمان
            const roomID = [user.uid, partner.uid].sort().join("_");

            return { roomID, partner };
        } 
        
        return null; // لم نجد أحداً

    } catch (error) {
        console.error("Matchmaking Error:", error);
        throw error;
    }
};

/**
 * تحديث حالة المستخدم (متصل، مشغول، توقيت الظهور)
 */
export const setUserStatus = async (statusObj) => {
    const user = auth.currentUser;
    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                ...statusObj,
                lastSeen: serverTimestamp() // استخدام وقت السيرفر بدلاً من وقت الهاتف
            });
        } catch (e) {
            console.error("Status Update Failed", e);
        }
    }
};

