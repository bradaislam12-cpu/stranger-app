// translations.js

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
    fullname_placeholder: "الاسم الكامل",
    gender_label: "الجنس",
    male: "ذكر",
    female: "أنثى",
    seeking_label: "أهتم بمقابلة",
    seeking_male: "رجال",
    seeking_female: "نساء",
    seeking_both: "الجميع",
    country_label: "الدولة",
    interests_label: "اهتماماتك",
    captcha_quest: "سؤال أمان: كم ناتج",
    captcha_err: "❌ حل الكابتشا غير صحيح",

    // لوحة التحكم (Dashboard)
    secure_chat: "ابدأ محادثة جديدة آمنة",
    discovery_desc: "ابحث عن أشخاص يشاركونك نفس الاهتمامات حول العالم",
    start_search: "🚀 ابحث عن شريك متاح",
    searching: "🔍 جاري البحث عن شريك مناسب...",
    match_found: "✅ تم العثور على شريك! جاري التحويل...",
    no_match: "⏳ لا يوجد أحد متاح الآن، حاول ثانية",
    safety_tip: "نصيحة الأمان 🛡️",
    safety_desc: "لا تشارك معلوماتك البنكية أو كلمات المرور مع الغرباء. المحادثات هنا مشفرة تماماً.",
    online_now: "● متصل الآن",

    // الملف الشخصي (Profile)
    profile_header: "الملف الشخصي",
    update_success: "تم التحديث بنجاح! ✨",
    delete_account: "حذف الحساب نهائياً",
    delete_confirm: "⚠️ هل أنت متأكد؟ سيتم حذف جميع بياناتك نهائياً.",

    // الدردشة والفيديو (Chat & Meeting)
    type_message: "اكتب رسالتك هنا...",
    partner_offline: "الشريك غير متصل حالياً",
    partner_online: "متصل الآن",
    end_call: "إنهاء المكالمة",
    camera_on: "كاميرا تعمل",
    camera_off: "كاميرا مغلقة",
    mic_on: "مايك يعمل",
    mic_off: "مايك صامت",

    // الشروط والخصوصية (Terms)
    terms_header: "شروط الاستخدام والخصوصية 🛡️",
    terms_privacy_title: "🔒 الخصوصية والأمان",
    terms_privacy_1: "التشفير: جميع مكالمات الفيديو والدردشة مشفرة ولا يتم تسجيلها.",
    terms_privacy_2: "البيانات: معلوماتك تستخدم فقط لغرض المطابقة لتحسين تجربتك.",
    terms_rules_title: "🚫 قواعد السلوك",
    terms_rules_1: "يُمنع منعاً باتاً أي سلوك خادش للحياء أو تنمر.",
    terms_rules_2: "انتحال الشخصية يعرضك للحظر الدائم من المنصة.",
    terms_disclaimer: "تنبيه: متابعتك لاستخدام التطبيق تعني موافقتك الصريحة على هذه الشروط.",
    terms_accept: "أوافق وأرغب في المتابعة ✅"
  },

  // 🇺🇸 English
  en: {
    app_name: "Stranger Meeting",
    save_changes: "Save Changes ✅",
    loading: "Loading...",
    error_occurred: "An error occurred, try again",
    back: "Back",
    logout: "Logout",
    welcome_msg: "Welcome to Safe Meeting World",
    terms_intro: "Talk to new people worldwide via encrypted video and chat. Start your journey now for free and with complete privacy.",
    login: "Login",
    register_title: "Register New Account",
    encrypted: "🔒 Encrypted",
    fast: "⚡ Fast",
    global: "🌍 Global",
    email_label: "Email Address",
    pass_label: "Password",
    google_login: "Login with Google",
    no_account: "Don't have an account? Register now",
    have_account: "Already have an account? Login",
    fullname_placeholder: "Full Name",
    gender_label: "Gender",
    male: "Male",
    female: "Female",
    seeking_label: "Interested in meeting",
    seeking_male: "Men",
    seeking_female: "Women",
    seeking_both: "Everyone",
    country_label: "Country",
    interests_label: "Your Interests",
    captcha_quest: "Security Check: What is",
    captcha_err: "❌ Incorrect CAPTCHA answer",
    secure_chat: "Start a Secure Conversation",
    discovery_desc: "Find people who share your interests around the world",
    start_search: "🚀 Find a Match",
    searching: "🔍 Searching for a partner...",
    match_found: "✅ Match Found! Redirecting...",
    no_match: "⏳ No one available now, try again",
    safety_tip: "Safety Tip 🛡️",
    safety_desc: "Do not share bank info or passwords with strangers. Chats here are fully encrypted.",
    online_now: "● Online Now",
    profile_header: "User Profile",
    update_success: "Updated successfully! ✨",
    delete_account: "Delete Account Permanently",
    delete_confirm: "⚠️ Are you sure? All your data will be permanently deleted.",
    type_message: "Type your message here...",
    partner_offline: "Partner is currently offline",
    partner_online: "Online",
    end_call: "End Call",
    camera_on: "Camera On",
    camera_off: "Camera Off",
    mic_on: "Mic On",
    mic_off: "Mic Muted",
    terms_header: "Privacy & Terms of Service 🛡️",
    terms_privacy_title: "🔒 Privacy & Security",
    terms_privacy_1: "Encryption: All video calls and chats are encrypted and not recorded.",
    terms_privacy_2: "Data: Your info is only used for matching to improve your experience.",
    terms_rules_title: "🚫 Code of Conduct",
    terms_rules_1: "Any inappropriate behavior or bullying is strictly prohibited.",
    terms_rules_2: "Impersonation will lead to a permanent ban.",
    terms_disclaimer: "Notice: Your continued use of the app means you agree to these terms.",
    terms_accept: "I agree and want to continue ✅"
  }
};

// --- وظائف التحكم في الواجهة ---

export function applyTranslations(lang) {
  const elements = document.querySelectorAll(".tr");
  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      // إذا كان العنصر Input نغير الـ Placeholder
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });

  // تحديث اتجاه الصفحة
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  
  // حفظ التفضيل
  localStorage.setItem("preferredLang", lang);
  
  // تحديث نص زر اللغة إذا وجد
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.innerText = lang === "ar" ? "EN" : "AR";
}

export function toggleLang() {
  const current = localStorage.getItem("preferredLang") || "ar";
  const next = current === "ar" ? "en" : "ar";
  applyTranslations(next);
}

export function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function initUI() {
  const savedLang = localStorage.getItem("preferredLang") || "ar";
  const savedTheme = localStorage.getItem("theme") || "light";

  applyTranslations(savedLang);
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

