import { db, auth } from './ui-logic.js';
import { 
    collection, query, where, getDocs, doc, getDoc, limit, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * محرك المطابقة الذكي (Matchmaking Engine)
 * يقوم بالبحث عن مستخدمين متصلين يطابقون تفضيلات الجنس والاهتمامات
 */
export const findMatch = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    try {
        // 1. جلب بيانات المستخدم الحالي لمعرفة تفضيلاته
        const myDoc = await getDoc(doc(db, "users", user.uid));
        if (!myDoc.exists()) throw new Error("User data not found");
        
        const myData = myDoc.data();
        const myInterests = myData.interests || [];

        // 2. بناء استعلام للبحث عن مستخدمين متصلين يطابقون خيار الجنس
        let q;
        if (myData.seeking === "both") {
            q = query(
                collection(db, "users"),
                where("isOnline", "==", true),
                where("uid", "!=", user.uid),
                limit(40) // جلب عينة أكبر لتصفيتها برمجياً بناءً على الاهتمامات
            );
        } else {
            q = query(
                collection(db, "users"),
                where("isOnline", "==", true),
                where("gender", "==", myData.seeking),
                where("uid", "!=", user.uid),
                limit(40)
            );
        }

        const querySnapshot = await getDocs(q);
        const candidates = [];

        // 3. التصفية المتقدمة (الاهتمامات والمطابقة المتبادلة)
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // أ. هل الطرف الآخر يبحث عن جنسي أنا أيضاً؟ (Mutual Attraction)
            const isMutualMatch = (data.seeking === "both" || data.seeking === myData.gender);
            
            if (isMutualMatch) {
                // ب. حساب قوة التطابق بناءً على الاهتمامات المشتركة
                let score = 0;
                if (data.interests && myInterests.length > 0) {
                    const common = data.interests.filter(item => myInterests.includes(item));
                    score = common.length; 
                }
                
                candidates.push({ ...data, matchScore: score });
            }
        });

        // 4. اختيار الأفضل أو عشوائي
        if (candidates.length > 0) {
            // ترتيب المرشحين حسب أعلى نقاط اهتمام مشترك
            candidates.sort((a, b) => b.matchScore - a.matchScore);

            // نأخذ أفضل 5 مرشحين ونختار واحد منهم عشوائياً لضمان التنوع
            const topCandidates = candidates.slice(0, 5);
            const randomPick = topCandidates[Math.floor(Math.random() * topCandidates.length)];

            // 5. إنشاء معرف الغرفة (Room ID)
            const roomID = [user.uid, randomPick.uid].sort().join("_");

            return {
                roomID: roomID,
                partner: randomPick
            };
        } else {
            return null; // لا يوجد أحد متاح حالياً
        }

    } catch (error) {
        console.error("Matchmaking Error:", error);
        throw error;
    }
};

/**
 * تحديث حالة المستخدم في قاعدة البيانات
 */
export const setUserStatus = async (isOnline) => {
    const user = auth.currentUser;
    if (user) {
        await updateDoc(doc(db, "users", user.uid), {
            isOnline: isOnline,
            lastSeen: new Date().getTime()
        });
    }
};
