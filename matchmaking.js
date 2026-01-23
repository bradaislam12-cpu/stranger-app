// matchmaking.js
import { auth, db } from './ui-logic.js';
import { 
  doc, getDoc, updateDoc, collection, query, where, getDocs, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// دالة حساب نسبة التشابه بين الاهتمامات
function calculateInterestMatch(myInterests, partnerInterests) {
  if (!myInterests || !partnerInterests) return 0;
  const common = myInterests.filter(i => partnerInterests.includes(i));
  return (common.length / Math.max(myInterests.length, partnerInterests.length)) * 100;
}

// دالة البحث عن شريك مناسب
export async function findMatch() {
  const user = auth.currentUser;
  if (!user) return null;

  const myDoc = await getDoc(doc(db, "users", user.uid));
  const myData = myDoc.data();

  // الاستعلام الأساسي: مستخدمين متصلين وغير مشغولين
  let q = query(
    collection(db, "users"),
    where("isOnline", "==", true),
    where("isBusy", "==", false),
    where("uid", "!=", user.uid),
    limit(50)
  );

  const querySnapshot = await getDocs(q);
  const candidates = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    // تحقق من التوافق في الجنس
    const amIInterested = (myData.seeking === "both" || data.gender === myData.seeking);
    const isPartnerInterested = (data.seeking === "both" || data.seeking === myData.gender);

    if (amIInterested && isPartnerInterested) {
      // حساب نسبة التشابه في الاهتمامات
      const interestScore = calculateInterestMatch(myData.interests, data.interests);

      // إضافة المرشح مع درجة التوافق
      candidates.push({
        ...data,
        matchScore: interestScore
      });
    }
  });

  if (candidates.length === 0) return null;

  // ترتيب المرشحين حسب درجة التوافق
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  // اختيار أفضل مرشح
  const partner = candidates[0];
  const roomID = [user.uid, partner.uid].sort().join("_");

  // تحديث حالة المستخدم
  await updateDoc(doc(db, "users", user.uid), { isBusy: true });

  return { partner, roomID };
}
