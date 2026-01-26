// economy.js - المحرك المالي (النقاط، الإعلانات، والاشتراكات)

import { db, auth, doc, getDoc, updateDoc } from './ui-logic.js';

/**
 * جلب رصيد النقاط الحالي للمستخدم
 */
export async function getUserPoints() {
    const user = auth.currentUser;
    if (!user) return 0;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
        return snap.data().points || 0;
    }
    return 0;
}

/**
 * محاكاة مشاهدة إعلان والحصول على مكافأة عشوائية (1-10 نقاط)
 */
export async function watchAdAndEarn() {
    const user = auth.currentUser;
    if (!user) {
        alert("يجب تسجيل الدخول أولاً");
        return;
    }

    // هنا يمكن مستقبلاً ربط SDK الخاص بـ Google AdSense أو Unity Ads
    console.log("Loading Ad...");
    
    return new Promise((resolve) => {
        // محاكاة وقت مشاهدة الإعلان (5 ثوانٍ)
        setTimeout(async () => {
            const reward = Math.floor(Math.random() * 10) + 1; // مكافأة عشوائية
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            
            const currentPoints = snap.data().points || 0;
            const newPoints = currentPoints + reward;

            await updateDoc(userRef, { points: newPoints });

            resolve({ reward, newPoints });
        }, 5000);
    });
}

/**
 * شراء خدمة "نصف ساعة بحث غير محدود" مقابل 200 نقطة
 */
export async function purchasePremiumHalfHour() {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "Login required" };

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const points = snap.data().points || 0;

    if (points < 200) {
        return { success: false, message: "نقاطك غير كافية، تحتاج 200 نقطة" };
    }

    // حساب وقت الانتهاء (الوقت الحالي + 30 دقيقة)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    await updateDoc(userRef, {
        points: points - 200,
        premiumUntil: expiryDate // تخزين تاريخ انتهاء الصلاحية
    });

    return { success: true, expiry: expiryDate };
}

/**
 * التحقق مما إذا كان المستخدم يملك صلاحية البحث (نقاط أو اشتراك فعال)
 */
export async function checkSearchEligibility() {
    const user = auth.currentUser;
    if (!user) return false;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const data = snap.data();

    // 1. التحقق من اشتراك الـ 30 دقيقة
    if (data.premiumUntil) {
        const now = new Date();
        const expiry = data.premiumUntil.toDate(); // تحويل طابع Firebase الزمني لتاريخ JS
        if (now < expiry) return { canSearch: true, isPremium: true };
    }

    // 2. التحقق من النقاط (تكلفة البحث الواحد مثلاً 5 نقاط)
    const points = data.points || 0;
    if (points >= 5) {
        return { canSearch: true, isPremium: false, currentPoints: points };
    }

    return { canSearch: false, isPremium: false };
}

/**
 * خصم نقاط مقابل عملية بحث واحدة
 */
export async function deductPointsForSearch() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const currentPoints = snap.data().points || 0;

    if (currentPoints >= 5) {
        await updateDoc(userRef, { points: currentPoints - 5 });
    }
}
