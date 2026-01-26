here// economy.js - المحرك المالي المطور (النقاط، الإعلانات الوهمية، والاشتراكات)

import { db, auth } from './ui-logic.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
 * إظهار إعلان وهمي (Mock Ad) ومنح مكافأة عشوائية
 * تم دمج واجهة الإعلان برمجياً هنا لتبسيط العمل
 */
export async function showMockAd() {
    return new Promise((resolve) => {
        const user = auth.currentUser;
        if (!user) {
            alert("يجب تسجيل الدخول أولاً");
            return resolve(null);
        }

        // 1. بناء واجهة الإعلان المنبثقة
        const adOverlay = document.createElement('div');
        adOverlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            font-family: sans-serif; direction: rtl;
        `;
        
        adOverlay.innerHTML = `
            <div style="background: #222; padding: 30px; border-radius: 20px; text-align: center; border: 2px solid #ff9800; max-width: 90%;">
                <div id="adTimer" style="font-size: 3rem; color: #ff9800; margin-bottom: 10px;">10</div>
                <h3 style="color: white; margin-bottom: 20px;">شاهد الإعلان للحصول على نقاط مجانية</h3>
                <div style="width: 100%; height: 150px; background: #333; display: flex; align-items: center; justify-content: center; color: #666; margin-bottom: 20px;">
                    🎥 محاكاة فيديو إعلاني...
                </div>
                <button id="closeAdBtn" disabled style="padding: 12px 25px; border: none; border-radius: 10px; background: #555; color: white; cursor: not-allowed;">انتظر قليلًا...</button>
            </div>
        `;
        
        document.body.appendChild(adOverlay);

        let timeLeft = 10;
        const timerElement = adOverlay.querySelector('#adTimer');
        const closeBtn = adOverlay.querySelector('#closeAdBtn');

        // 2. تشغيل العداد
        const interval = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                timerElement.innerText = "✅";
                closeBtn.disabled = false;
                closeBtn.innerText = "استلام المكافأة وإغلاق";
                closeBtn.style.background = "#28a745";
                closeBtn.style.cursor = "pointer";
            }
        }, 1000);

        // 3. معالجة إغلاق الإعلان ومنح النقاط
        closeBtn.onclick = async () => {
            const reward = Math.floor(Math.random() * 10) + 1; // من 1 إلى 10 نقاط
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            
            const currentPoints = snap.data().points || 0;
            const newPoints = currentPoints + reward;

            await updateDoc(userRef, { points: newPoints });
            
            document.body.removeChild(adOverlay);
            alert(`مبروك! شاهدت الإعلان وحصلت على ${reward} نقاط 💰`);
            resolve(newPoints);
        };
    });
}

/**
 * شراء خدمة "نصف ساعة بحث غير محدود" مقابل 200 نقطة
 */
export async function purchasePremiumHalfHour() {
    const user = auth.currentUser;
    if (!user) return { success: false, message: "يجب تسجيل الدخول" };

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    const points = snap.data().points || 0;

    if (points < 200) {
        return { success: false, message: "رصيدك غير كافٍ (تحتاج 200 نقطة)" };
    }

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    await updateDoc(userRef, {
        points: points - 200,
        premiumUntil: expiryDate
    });

    return { success: true, message: "تم تفعيل 30 دقيقة بحث غير محدود!" };
}

/**
 * التحقق من أهلية البحث (بريميوم أو نقاط)
 */
export async function checkSearchEligibility() {
    const user = auth.currentUser;
    if (!user) return { canSearch: false };

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return { canSearch: false };
    
    const data = snap.data();

    // التحقق من اشتراك الـ 30 دقيقة
    if (data.premiumUntil) {
        const now = new Date();
        const expiry = data.premiumUntil.toDate(); 
        if (now < expiry) return { canSearch: true, isPremium: true };
    }

    // التحقق من النقاط (خصم 5 نقاط لكل بحث)
    const points = data.points || 0;
    if (points >= 5) {
        return { canSearch: true, isPremium: false, currentPoints: points };
    }

    return { canSearch: false, isPremium: false };
}

/**
 * خصم نقاط مقابل عملية بحث واحدة (يستدعى فقط إذا لم يكن بريميوم)
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
