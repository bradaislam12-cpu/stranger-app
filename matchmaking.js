// matchmaking.js - محرك البحث الذكي المدمج بنظام النقاط
import { db, auth } from './ui-logic.js';
import { collection, query, where, getDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { checkSearchEligibility, deductPointsForSearch } from './economy.js';

/**
 * دالة البحث عن شريك متاح مع التحقق من الرصيد
 */
export async function findMatch() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  // 1. التحقق من النقاط أو اشتراك الـ 30 دقيقة
  const status = await checkSearchEligibility();
  if (!status.canSearch) {
    alert("عذراً! لا تملك نقاطاً كافية للبحث (تكلفة البحث 5 نقاط). شاهد إعلاناً للحصول عليها.");
    return null;
  }

  // 2. جلب بيانات المستخدم الحالي لمعرفة تفضيلاته
  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
  if (!userSnap.exists()) return null;
  const userData = userSnap.data();

  // 3. إنشاء استعلام للبحث عن المستخدمين المتاحين
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("isOnline", "==", true),
    where("isBusy", "==", false)
  );

  const querySnapshot = await getDocs(q);
  let potentialMatches = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.uid !== currentUser.uid) {
      
      // تصفية بناءً على الجنس والاهتمام (Seeking)
      const matchGender = (userData.seeking === "both" || userData.seeking === data.gender);
      const partnerWantsMe = (data.seeking === "both" || data.seeking === userData.gender);

      if (matchGender && partnerWantsMe) {
        const score = calculateInterestMatch(userData.interests, data.interests);
        potentialMatches.push({ ...data, matchScore: score });
      }
    }
  });

  // 4. ترتيب النتائج حسب الأعلى نقاطاً في الاهتمامات
  potentialMatches.sort((a, b) => b.matchScore - a.matchScore);

  if (potentialMatches.length > 0) {
    const bestMatch = potentialMatches[0];
    
    // إنشاء معرف غرفة فريد
    const roomID = [currentUser.uid, bestMatch.uid].sort().join("_");

    // 5. خصم النقاط إذا لم يكن المستخدم مشتركاً في خدمة "نصف ساعة"
    if (!status.isPremium) {
      await deductPointsForSearch();
    }

    // 6. تحديث حالة الطرفين إلى "مشغول"
    await updateDoc(doc(db, "users", currentUser.uid), { isBusy: true });
    await updateDoc(doc(db, "users", bestMatch.uid), { isBusy: true });

    return { roomID, partner: bestMatch };
  }

  return null; // لم يتم العثور على أحد متاح حالياً
}

/**
 * دالة حساب نسبة التوافق في الاهتمامات
 */
function calculateInterestMatch(myInterests, theirInterests) {
  if (!myInterests || !theirInterests) return 0;
  // تأكد من أن المدخلات مصفوفات
  const mine = Array.isArray(myInterests) ? myInterests : [];
  const theirs = Array.isArray(theirInterests) ? theirInterests : [];
  const common = mine.filter(i => theirs.includes(i));
  return common.length;
}
