here// matchmaking.js
import { db, auth, collection, query, where, getDoc, getDocs, doc, updateDoc } from './ui-logic.js';

/**
 * دالة البحث عن شريك متاح
 * تعتمد على: الجنس، الدولة، والاهتمامات المشتركة
 */
export async function findMatch() {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  // 1. جلب بيانات المستخدم الحالي لمعرفة تفضيلاته
  const userSnap = await getDoc(doc(db, "users", currentUser.uid));
  if (!userSnap.exists()) return null;
  const userData = userSnap.data();

  // 2. إنشاء استعلام للبحث عن المستخدمين المتاحين
  // الشروط: متصل (Online)، غير مشغول (Not Busy)، وليس المستخدم نفسه
  const usersRef = collection(db, "users");
  let q = query(
    usersRef,
    where("isOnline", "==", true),
    where("isBusy", "==", false)
  );

  const querySnapshot = await getDocs(q);
  let potentialMatches = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.uid !== currentUser.uid) {
      
      // تصفية بناءً على "أهتم بمقابلة" (Seeking) والجنس (Gender)
      const matchGender = (userData.seeking === "both" || userData.seeking === data.gender);
      const partnerWantsMe = (data.seeking === "both" || data.seeking === userData.gender);

      if (matchGender && partnerWantsMe) {
        // حساب نقاط الاهتمام المشترك
        const score = calculateInterestMatch(userData.interests, data.interests);
        potentialMatches.push({ ...data, matchScore: score });
      }
    }
  });

  // 3. ترتيب النتائج حسب الأعلى نقاطاً في الاهتمامات
  potentialMatches.sort((a, b) => b.matchScore - a.matchScore);

  if (potentialMatches.length > 0) {
    const bestMatch = potentialMatches[0];
    
    // 4. إنشاء معرف غرفة فريد (Room ID) يجمع الطرفين
    // نستخدم ترتيب الأبجدية لضمان أن الطرفين يحصلان على نفس الـ ID دائماً
    const roomID = [currentUser.uid, bestMatch.uid].sort().join("_");

    // 5. تحديث حالة الطرفين إلى "مشغول" لمنع دخول طرف ثالث
    await updateDoc(doc(db, "users", currentUser.uid), { isBusy: true });
    await updateDoc(doc(db, "users", bestMatch.uid), { isBusy: true });

    return { roomID, partner: bestMatch };
  }

  return null; // لم يتم العثور على أحد متاح
}

/**
 * دالة حساب نسبة التوافق في الاهتمامات
 */
function calculateInterestMatch(myInterests, theirInterests) {
  if (!myInterests || !theirInterests) return 0;
  const common = myInterests.filter(i => theirInterests.includes(i));
  return common.length;
}
