// translations.js - القاموس الشامل ومحرك الواجهة

const translations = {
  // 🇸🇦 العربية
  ar: {
    // العامة (Common)
    app_name: "Stranger Meeting",
    save_changes: "حفظ التغييرات ✅",
    loading: "جاري التحميل...",
    error_occurred: "حدث خطأ ما، حاول ثانية",
    back: "رجوع",
    logout: "تسجيل الخروج",
    confirm: "تأكيد",
    cancel: "إلغاء",
    
    // صفحة البداية (index.html)
    welcome_msg: "مرحباً بك في عالم التعارف الآمن",
    terms_intro: "تحدث مع أشخاص جدد حول العالم عبر الفيديو والدردشة المشفرة. ابدأ رحلتك الآن مجاناً وبكل خصوصية.",
    login: "تسجيل الدخول",
    register_title: "إنشاء حساب جديد",
    encrypted: "🔒 مشفر",
    fast: "⚡ سريع",
    global: "🌍 عالمي",

    // صفحة التسجيل والدخول (Login & Register)
    email_label: "البريد الإلكتروني",
    pass_label: "كلمة المرور",
    google_login: "الدخول بواسطة جوجل",
    no_account: "ليس لديك حساب؟ سجل الآن",
    have_account: "لديك حساب بالفعل؟ سجل دخولك",
    welcome_back: "مرحباً بك مجدداً!",
    fullname_placeholder: "الاسم المستعار",
    gender_label: "جنسك",
    male: "ذكر",
    female: "أنثى",
    seeking_label: "أبحث عن",
    seeking_male: "رجال",
    seeking_female: "نساء",
    seeking_both: "الجميع",
    
    // نظام الاقتصاد والنقاط (Economy & Points)
    points_balance: "رصيدك: {n} نقطة",
    get_points: "احصل على نقاط مجانية 💰",
    watch_ad: "شاهد إعلان (+5 نقاط)",
    insufficient_points: "عذراً! رصيدك غير كافٍ للبحث. شاهد إعلاناً للمتابعة.",
    premium_active: "وضع البريميوم نشط (30 دقيقة بحث مجاني)",
    buy_premium: "شراء 30 دقيقة بحث بلا حدود",
    search_cost: "تكلفة البحث: 5 نقاط",

    // لوحة التحكم (Dashboard)
    secure_chat: "ابدأ محادثة فيديو آمنة",
    discovery_desc: "تواصل مع أشخاص متاحين الآن حول العالم بخصوصية تامة.",
    start_search: "🚀 ابدأ البحث الآن",
    searching: "🔍 جاري البحث عن شريك متاح...",
    match_found: "✅ تم العثور على شريك! جاري التحويل...",
    no_match: "⏳ لا يوجد أحد متاح الآن، حاول ثانية",
    safety_tip: "نصيحة الأمان 🛡️",
    safety_desc: "لا تشارك معلوماتك الشخصية أو البنكية أبداً. نحن نقوم بتشفير المحادثات لحمايتك.",
    online_now: "● متصل الآن",

    // الملف الشخصي (Profile)
    profile_header: "الملف الشخصي",
    update_success: "تم تحديث بياناتك بنجاح! ✨",
    delete_account: "حذف الحساب نهائياً",
    delete_confirm: "⚠️ هل أنت متأكد؟ سيتم مسح حسابك ونقاطك نهائياً.",
    interests_label: "الاهتمامات",

    // الدردشة والفيديو (Chat & Meeting)
    type_message: "اكتب رسالتك هنا...",
    partner_offline: "غادر الشريك المحادثة",
    partner_online: "متصل الآن",
    end_call: "إنهاء المكالمة",
    camera_on: "الكاميرا تعمل",
    camera_off: "الكاميرا مغلقة",
    mic_on: "الميكروفون يعمل",
    mic_off: "الميكروفون صامت",
    calling: "جاري الاتصال...",

    // الشروط والخصوصية (Terms)
    terms_header: "شروط الاستخدام والخصوصية 🛡️",
    terms_accept: "أوافق وأرغب في المتابعة ✅",
    terms_disclaimer: "بمتابعتك، أنت توافق على القواعد وتتحمل مسؤولية أفعالك."
  },

  // 🇺🇸 English
  en: {
    app_name: "Stranger Meeting",
    save_changes: "Save Changes ✅",
    loading: "Loading...",
    error_occurred: "An error occurred, try again",
    back: "Back",
    logout: "Logout",
    confirm: "Confirm",
    cancel: "Cancel",
    welcome_msg: "Safe Meeting World",
    terms_intro: "Talk to new people worldwide via encrypted video and chat. Secure and private journey starts here.",
    login: "Login",
    register_title: "Create Account",
    encrypted: "🔒 Encrypted",
    fast: "⚡ Fast",
    global: "🌍 Global",
    email_label: "Email",
    pass_label: "Password",
    google_login: "Login with Google",
    no_account: "No account? Register now",
    have_account: "Have an account? Login",
    welcome_back: "Welcome Back!",
    fullname_placeholder: "Nickname",
    gender_label: "Your Gender",
    male: "Male",
    female: "Female",
    seeking_label: "Looking for",
    seeking_male: "Men",
    seeking_female: "Women",
    seeking_both: "Everyone",
    points_balance: "Balance: {n} Points",
    get_points: "Get Free Points 💰",
    watch_ad: "Watch Ad (+5 Pts)",
    insufficient_points: "Not enough points! Watch an ad to search.",
    premium_active: "Premium Active (30m Unlimited Search)",
    buy_premium: "Buy 30m Unlimited Access",
    search_cost: "Search Cost: 5 Points",
    secure_chat: "Start Secure Video Chat",
    discovery_desc: "Connect with available people worldwide with total privacy.",
    start_search: "🚀 Start Search",
    searching: "🔍 Looking for a partner...",
    match_found: "✅ Match Found! Redirecting...",
    no_match: "⏳ No one available now, try again",
    safety_tip: "Safety Tip 🛡️",
    safety_desc: "Never share personal or bank info. We encrypt chats for your protection.",
    online_now: "● Online Now",
    profile_header: "User Profile",
    update_success: "Profile updated successfully! ✨",
    delete_account: "Delete Account",
    delete_confirm: "⚠️ Are you sure? All your data and points will be lost.",
    interests_label: "Interests",
    type_message: "Type a message...",
    partner_offline: "Partner left the chat",
    partner_online: "Online",
    end_call: "End Call",
    camera_on: "Cam On",
    camera_off: "Cam Off",
    mic_on: "Mic On",
    mic_off: "Mic Muted",
    calling: "Calling...",
    terms_header: "Terms & Privacy 🛡️",
    terms_accept: "I Agree & Continue ✅",
    terms_disclaimer: "By continuing, you agree to the rules and take full responsibility."
  }
};

// --- وظائف التحكم الذكي بالواجهة ---

export function applyTranslations(lang) {
  const elements = document.querySelectorAll(".tr");
  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      let text = translations[lang][key];
      
      // دعم النصوص التي تحتوي على متغيرات مثل النقاط {n}
      if (el.hasAttribute("data-val")) {
        text = text.replace("{n}", el.getAttribute("data-val"));
      }

      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = text;
      } else {
        el.innerText = text;
      }
    }
  });

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  localStorage.setItem("preferredLang", lang);
  
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.innerText = lang === "ar" ? "EN" : "AR";
}

export function toggleLang() {
  const current = localStorage.getItem("preferredLang") || "ar";
  const next = current === "ar" ? "en" : "ar";
  applyTranslations(next);
}

export function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function initUI() {
  const savedLang = localStorage.getItem("preferredLang") || "ar";
  const savedTheme = localStorage.getItem("theme") || "light";

  applyTranslations(savedLang);
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
}

// تصدير القاموس للاستخدام البرمجي المباشر (مثل رسائل التنبيه Alert)
export { translations };
