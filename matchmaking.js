import { db, auth } from './ui-logic.js';
import { collection, query, where, getDocs, limit, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const startRandomMatch = async () => {
    const user = auth.currentUser;
    if (!user) return alert("سجل دخولك أولاً!");

    // 1. جلب بيانات المستخدم الحالي لمعرفة اهتماماته
    // (نفترض أننا جلبناها مسبقاً في الداشبورد)
    
    // 2. البحث عن مستخدم متاح
    const usersRef = collection(db, "users");
    const q = query(
        usersRef, 
        where("isOnline", "==", true), 
        where("uid", "!=", user.uid),
        limit(10) // نجلب عينة للمفاضلة بينهم
    );

    const querySnapshot = await getDocs(q);
    let matchedUser = null;

    querySnapshot.forEach((doc) => {
        // هنا يمكننا إضافة منطق مطابقة الاهتمامات Interests
        matchedUser = doc.data(); 
    });

    if (matchedUser) {
        // إنشاء معرف غرفة عشوائي
        const roomID = "SM_" + Math.random().toString(36).substring(7);
        
        // توجيه المستخدم لصفحة الفيديو مع تمرير المعرفات
        window.location.href = `meeting.html?room=${roomID}&target=${matchedUser.uid}`;
    } else {
        alert("لا يوجد مستخدمون متاحون حالياً، جرب بعد قليل.");
    }
};
