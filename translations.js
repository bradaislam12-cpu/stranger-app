// translations.js

// ✅ قاموس الترجمات
export const translations = {
  ar: {
    app_name: "Stranger Meeting",
    login_title: "تسجيل الدخول",
    register_title: "إنشاء حساب جديد",
    profile_header: "الملف الشخصي",
    secure_chat: "مكالمة فيديو آمنة 🔒",
    welcome_back: "مرحباً بك مجدداً!",
    email_label: "البريد الإلكتروني",
    pass_label: "كلمة المرور",
    login: "تسجيل الدخول",
    google_login: "الدخول بواسطة جوجل",
    no_account: "ليس لديك حساب؟ سجل الآن",
    save_changes: "حفظ البيانات ✅",
    delete_account: "حذف الحساب نهائياً ⚠️",
    fullname_placeholder: "الاسم الكامل",
    gender_label: "الجنس",
    male: "ذكر",
    female: "أنثى",
    seeking_label: "أهتم بمقابلة",
    seeking_male: "رجال",
    seeking_female: "نساء",
    seeking_both: "الجميع",
    country_label: "اختر الدولة",
    interests_label: "الاهتمامات المشتركة"
  },
  en: {
    app_name: "Stranger Meeting",
    login_title: "Login",
    register_title: "Create Account",
    profile_header: "Profile",
    secure_chat: "Secure Video Call 🔒",
    welcome_back: "Welcome back!",
    email_label: "Email",
    pass_label: "Password",
    login: "Login",
    google_login: "Login with Google",
    no_account: "Don't have an account? Register now",
    save_changes: "Save changes ✅",
    delete_account: "Delete account ⚠️",
    fullname_placeholder: "Full Name",
    gender_label: "Gender",
    male: "Male",
    female: "Female",
    seeking_label: "Looking to meet",
    seeking_male: "Men",
    seeking_female: "Women",
    seeking_both: "Everyone",
    country_label: "Select Country",
    interests_label: "Shared Interests"
  }
};

// ✅ دالة لتطبيق الترجمة
export function applyTranslations(lang = "ar") {
  const elements = document.querySelectorAll(".tr");
  elements.forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // تحديث زر اللغة
  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.textContent = lang === "ar" ? "EN" : "AR";
  }

  // حفظ اللغة المفضلة
  localStorage.setItem("preferredLang", lang);
}

// ✅ دالة لتبديل اللغة
export function toggleLang() {
  const currentLang = localStorage.getItem("preferredLang") || "ar";
  const newLang = currentLang === "ar" ? "en" : "ar";
  applyTranslations(newLang);
}

// ✅ دالة لتبديل الثيم (نهاري/ليلي)
export function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("light-mode")) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
}

// ✅ تحميل الثيم واللغة عند فتح الصفحة
export function initUI() {
  const savedLang = localStorage.getItem("preferredLang") || "ar";
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTranslations(savedLang);
  document.body.classList.add(savedTheme === "dark" ? "dark-mode" : "light-mode");
}
